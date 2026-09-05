const CONFIG = {
  brandName: "Custom Label Factory",
  whatsappLink: "https://api.whatsapp.com/message/AWJL6N3AAGIZA1?autoload=1&app_absent=0",
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
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    const formData = new FormData(form);
    const lines = [];
    formData.forEach((value, key) => {
      if (value && typeof value === "string") {
        lines.push(`${key}: ${value}`);
      }
    });
    const subject = encodeURIComponent("Custom label quote request");
    const body = encodeURIComponent(lines.join("\n"));
    if (status) {
      status.textContent = `Opening your email app to send these requirements to ${CONFIG.email}.`;
      status.setAttribute("role", "status");
    }
    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
  });
}


