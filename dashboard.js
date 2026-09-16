const subscriptionCost = 100;
const rewardsInput = document.querySelector("#rewards-input");
const spendInput = document.querySelector("#spend-input");
const revenueOutput = document.querySelector("#revenue-output");
const revenueDetail = document.querySelector("#revenue-detail");
const netOutput = document.querySelector("#net-output");
const insightTitle = document.querySelector("#insight-title");
const insightCopy = document.querySelector("#insight-copy");

function currency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function updateBusinessSummary() {
  const rewards = Math.max(0, Number(rewardsInput.value) || 0);
  const averageSpend = Math.max(0, Number(spendInput.value) || 0);
  const revenue = rewards * averageSpend;
  const net = revenue - subscriptionCost;

  revenueOutput.textContent = currency(revenue);
  revenueDetail.textContent = `${rewards} visitas atribuidas × ${currency(averageSpend)}`;
  netOutput.textContent = `${net >= 0 ? currency(net) : `−${currency(Math.abs(net))}`} netos`;

  if (revenue >= subscriptionCost) {
    insightTitle.textContent = "El programa está creando retornos.";
    insightCopy.textContent = `Con ${rewards} recompensas usadas, el ingreso estimado supera la suscripción mensual. Prueba una promoción en días tranquilos y compara sus escaneos al final del mes.`;
  } else {
    insightTitle.textContent = "Hay una oportunidad de mejorar la activación.";
    insightCopy.textContent = "La estimación todavía no cubre la suscripción. Haz más visible el NFC en la entrada y prueba un beneficio sencillo para la primera visita.";
  }
}

rewardsInput.addEventListener("input", updateBusinessSummary);
spendInput.addEventListener("input", updateBusinessSummary);
updateBusinessSummary();
