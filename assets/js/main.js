const CONFIG = {
  brandName: "Custom Label Factory",
  whatsappNumber: "YOUR_WHATSAPP_NUMBER",
  email: "YOUR_EMAIL_ADDRESS",
  domain: "https://chadwick-ho.github.io/food-beverage-labels"
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
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(messages[type] || messages.quote)}`;
}

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.setAttribute("href", whatsappUrl(link.dataset.whatsapp));
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
    if (status) {
      status.textContent = "Your requirements are ready to send. Please connect a form endpoint before launch, or send the same details through WhatsApp.";
      status.setAttribute("role", "status");
    }
  });
}


