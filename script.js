const tabs = document.querySelectorAll(".tab-button");
const cards = document.querySelectorAll(".route-card");
const pins = document.querySelectorAll(".pin");

function setActiveNode(node) {
  pins.forEach((pin) => {
    pin.classList.toggle("is-active", pin.dataset.node === node);
  });
  cards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.node === node);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;

    tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    cards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !visible);
    });
  });
});

cards.forEach((card) => {
  card.addEventListener("mouseenter", () => setActiveNode(card.dataset.node));
  card.addEventListener("focusin", () => setActiveNode(card.dataset.node));
});

pins.forEach((pin) => {
  pin.addEventListener("mouseenter", () => setActiveNode(pin.dataset.node));
  pin.addEventListener("focusin", () => setActiveNode(pin.dataset.node));
});

setActiveNode("htwallpaper");
