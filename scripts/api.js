const apiKey = "16db685a81d747498056dca116082292"; // replace with your Twelve Data key
const button = document.getElementById("loadBtn");
const symbolInput = document.getElementById("symbolInput");
const ctx = document.getElementById("stockChart").getContext("2d");

let chart;

button.addEventListener("click", async () => {
  const symbol = symbolInput.value.toUpperCase().trim();
  if (!symbol) return alert("Enter a stock symbol!");

  const data = await getStockData(symbol);
  if (!data) return;

  const labels = data.map(d => d.datetime);
  const prices = data.map(d => parseFloat(d.close));

  if (chart) chart.destroy(); // remove previous chart
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: `${symbol} Price`,
        data: prices,
        borderColor: "blue",
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true, title: { display: true, text: "Time" }},
        y: { display: true, title: { display: true, text: "Price (USD)" }}
      }
    }
  });
});

async function getStockData(symbol) {
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&outputsize=30&apikey=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const json = await res.json();

    if (json.status === "error") {
      alert("Error fetching data: " + json.message);
      console.error(json);
      return null;
    }

    return json.values.reverse(); // reverse so oldest data is first
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}
