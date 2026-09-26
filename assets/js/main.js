const CONFIG = {
  brandName: "Custom Label Factory",
  whatsappLink: "https://api.whatsapp.com/message/LXEW2FWSFWGPJ1?autoload=1&app_absent=0",
  email: "ruishengmao05@gmail.com",
  domain: "https://zfulabels.com"
};

const messages = {
  home: "Hello, I'm interested in custom food and beverage labels. I'd like to get a quote.",
  food: "Hello, I'm interested in custom food labels. I can send my packaging type, size, quantity and artwork.",
  beverage: "Hello, I'm looking for custom beverage labels. I can send my bottle size, quantity and artwork.",
  material: "Hello, I need help choosing the right label material for my packaging.",
  proof: "Hello, I'd like to request a free digital proof for my custom label project.",
  quote: "Hello, I'd like to discuss a custom food or beverage label project."
};

function whatsappUrl(type = "quote") {
  return CONFIG.whatsappLink;
}

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.setAttribute("href", whatsappUrl(link.dataset.whatsapp));
});

document.querySelectorAll("[data-email]").forEach((link) => {
  link.setAttribute("href", `mailto:${CONFIG.email}`);
});

document.querySelectorAll("[data-brand]").forEach((node) => {
  node.textContent = CONFIG.brandName;
});

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
}

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const open = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
});

const form = document.querySelector("[data-quote-form]");
if (form) {
  const status = form.querySelector(".form-status");
  const preview = form.querySelector("[data-quote-preview]");
  function requirements() {
    const lines = [];
    for (const [key, value] of new FormData(form)) {
      if (typeof value !== "string" || !value.trim()) continue;
      const input = form.elements.namedItem(key);
      const label = input && form.querySelector(`label[for="${input.id}"]`);
      lines.push(`${label ? label.textContent : key}: ${value.trim()}`);
    }
    const text = lines.join("\n");
    if (preview) preview.value = text;
    return text;
  }
  form.addEventListener("input", requirements);
  form.addEventListener("change", requirements);
  form.querySelector("[data-copy-quote]")?.addEventListener("click", async () => {
    const text = requirements();
    try {
      await navigator.clipboard.writeText(text);
      if (status) status.textContent = "Requirements copied. Paste them into your email or WhatsApp message.";
    } catch {
      preview?.focus();
      preview?.select();
      if (status) status.textContent = "Select and copy your requirements below.";
    }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const subject = encodeURIComponent("Custom label quote request");
    const body = encodeURIComponent(requirements());
    if (status) {
      status.textContent = `Opening your email app to send these requirements to ${CONFIG.email}.`;
      status.setAttribute("role", "status");
    }
    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
  });
  requirements();
}


