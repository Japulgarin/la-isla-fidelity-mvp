const storageKey = "la-isla-fidelity-v1";
const maxVisits = 5;
const tapParameter = "tap";

const memberIdElement = document.querySelector("#member-id");
const visitCountElement = document.querySelector("#visit-count");
const stampsElement = document.querySelector("#stamps");
const statusElement = document.querySelector("#card-status");
const rewardElement = document.querySelector("#reward");
const resetButton = document.querySelector("#reset-button");

function createCard() {
  return { id: crypto.randomUUID().slice(0, 8).toUpperCase(), visits: 0, lastVisitAt: null };
}

function readCard() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return createCard();
    const card = JSON.parse(saved);
    if (typeof card.id !== "string" || !Number.isInteger(card.visits)) return createCard();
    return { ...card, visits: Math.min(Math.max(card.visits, 0), maxVisits) };
  } catch {
    return createCard();
  }
}

function saveCard(card) {
  localStorage.setItem(storageKey, JSON.stringify(card));
}

function render(card, justEarned) {
  memberIdElement.textContent = `Tarjeta #${card.id}`;
  visitCountElement.textContent = `${card.visits} / ${maxVisits}`;
  stampsElement.replaceChildren();
  for (let index = 1; index <= maxVisits; index += 1) {
    const stamp = document.createElement("span");
    stamp.className = `stamp${index <= card.visits ? " is-earned" : ""}`;
    stamp.textContent = index <= card.visits ? "★" : index;
    stamp.setAttribute("aria-label", index <= card.visits ? `Visita ${index} registrada` : `Visita ${index} pendiente`);
    stampsElement.append(stamp);
  }
  const completed = card.visits === maxVisits;
  rewardElement.hidden = !completed;
  statusElement.textContent = completed
    ? "Tus cinco visitas ya están registradas."
    : justEarned
      ? "¡Visita registrada! Vuelve pronto para tu siguiente sello."
      : "Escanea el NFC durante tu visita para recibir tu siguiente sello.";
}

function isNfcTap() {
  return new URLSearchParams(window.location.search).get(tapParameter) === "1";
}

let card = readCard();
const justEarned = isNfcTap() && card.visits < maxVisits;
if (justEarned) {
  card = { ...card, visits: card.visits + 1, lastVisitAt: new Date().toISOString() };
  saveCard(card);
  window.history.replaceState({}, document.title, window.location.pathname);
}
render(card, justEarned);

resetButton.addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  card = createCard();
  saveCard(card);
  render(card, false);
});

