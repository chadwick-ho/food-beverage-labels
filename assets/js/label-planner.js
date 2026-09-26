(() => {
  const form = document.querySelector('[data-label-planner]');
  if (!form) return;
  const result = document.querySelector('[data-planner-result]');
  const status = document.querySelector('[data-planner-status]');
  const brief = document.querySelector('[data-planner-brief]');
  const email = document.querySelector('[data-planner-email]');
  const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
  const mode = form.elements.mode;
  const unit = form.elements.unit;
  const dimensionNames = ['width', 'diameter', 'gap', 'height'];
  let previousUnit = unit.value;
  let ready = false;

  function invalidate() {
    ready = false;
    brief.value = '';
    result.hidden = true;
    email.removeAttribute('href');
    status.textContent = '';
  }
  function syncMode() {
    const round = mode.value === 'round';
    for (const name of ['diameter', 'gap', 'width']) {
      const input = form.elements[name];
      const enabled = name === 'width' ? !round : round;
      input.disabled = !enabled;
      input.closest('.field').hidden = !enabled;
    }
  }
  form.addEventListener('input', invalidate);
  form.addEventListener('change', invalidate);
  mode.addEventListener('change', syncMode);
  unit.addEventListener('change', () => {
    const factor = unit.value === 'in' ? 1 / 25.4 : 25.4;
    if (unit.value !== previousUnit) {
      dimensionNames.forEach(name => {
        const input = form.elements[name];
        if (input.value !== '') input.value = String(Number((Number(input.value) * factor).toFixed(8)));
      });
      previousUnit = unit.value;
    }
    document.querySelectorAll('[data-dimension-unit]').forEach(node => { node.textContent = unit.value; });
  });
  form.addEventListener('reset', () => {
    setTimeout(() => {
      previousUnit = unit.value;
      document.querySelectorAll('[data-dimension-unit]').forEach(node => { node.textContent = unit.value; });
      syncMode();
      invalidate();
    }, 0);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    const scale = values.unit === 'in' ? 25.4 : 1;
    const height = Number(values.height) * scale;
    const width = values.mode === 'round'
      ? Math.PI * Number(values.diameter) * scale - Number(values.gap) * scale
      : Number(values.width) * scale;
    if (!Number.isFinite(width) || width <= 0 || width > 100000 || height <= 0 || height > 100000) {
      status.textContent = 'Check the dimensions. The wrap gap must be smaller than the bottle circumference.';
      return;
    }
    const base = Number(values.packages) * Number(values.perPack);
    const total = base + Math.ceil(base * Number(values.allowance) / 100);
    const size = `${number.format(width)} x ${number.format(height)} mm`;
    const material = {
      dry: 'Paper or film can suit dry packs. Confirm the container surface, finish and adhesive.',
      chilled: 'Review film or protected paper and an adhesive rated for the actual application temperature. Test condensation after labeling.',
      frozen: 'Review freezer-suitable film and adhesive. Confirm both application and service temperatures and test the real package.',
      oily: 'Review film, protective finish and adhesive for oil exposure. Test the finished label and package together.',
      ice: 'Compare film and wet-strength paper with a tested bottle adhesive. Validate immersion, edge lift and wet handling.'
    }[values.environment];
    document.querySelector('[data-result-size]').textContent = size;
    document.querySelector('[data-result-count]').textContent = number.format(total);
    document.querySelector('[data-result-area]').textContent = `${number.format(width * height * total / 1000000)} m2`;
    document.querySelector('[data-result-material]').textContent = material;
    brief.value = [
      'Custom label project brief', `Category: ${values.category}`, `Layout: ${values.mode === 'round' ? 'Straight cylindrical wrap' : 'Flat label panel'}`,
      `Calculated label size: ${size}`, `Packages: ${values.packages}`, `Labels per package: ${values.perPack}`,
      `Allowance: ${values.allowance}%`, `Planned total: ${total} labels`, `Artwork versions: ${values.skus}`,
      'Quantity per artwork: confirm separately', `Conditions: ${form.elements.environment.selectedOptions[0].textContent}`,
      `Application: ${values.application}`, `Material review: ${material}`,
      'Please confirm final dimensions, material, quantity per artwork, price and lead time. This plan is not an approved dieline or a quote.'
    ].join('\n');
    email.href = `mailto:ruishengmao05@gmail.com?subject=${encodeURIComponent('Label project brief')}&body=${encodeURIComponent(brief.value)}`;
    ready = true;
    result.hidden = false;
    status.textContent = 'Your plan is ready.';
    result.focus({ preventScroll: true });
  });
  document.querySelector('[data-copy-plan]').addEventListener('click', async () => {
    if (!ready) return;
    try {
      await navigator.clipboard.writeText(brief.value);
      status.textContent = 'Project brief copied.';
    } catch {
      brief.focus();
      brief.select();
      status.textContent = 'Select and copy the project brief below.';
    }
  });
  syncMode();
})();
