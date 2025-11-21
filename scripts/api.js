const apiKey = ""; // your TwelveData API key

//rounded-box market-box
// List of stocks to show in the live market table
const marketStocks = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "FB", "NFLX"];
const marketTable = document.getElementById("market-table");

// For chart
const symbolInput = document.getElementById("symbolInput"); // optional input
const loadBtn = document.getElementById("loadBtn");
const ctx = document.getElementById("stockChart").getContext("2d");
let chart;

// --- Load chart for a selected stock ---
loadBtn.addEventListener("click", async () => {
    const symbol = symbolInput.value.toUpperCase().trim();
    if (!symbol) return alert("Enter a stock symbol!");
    await displayStockChart(symbol);
});

async function displayStockChart(symbol) {
    const data = await getStockData(symbol);
    if (!data) return;

    const labels = data.map(d => d.datetime);
    const prices = data.map(d => parseFloat(d.close));

    if (chart) chart.destroy();
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
}

// --- Live market overview ---
async function updateMarketOverview() {
    marketTable.innerHTML = ""; // clear table
    for (const symbol of marketStocks) {
        const data = await getStockData(symbol);
        if (!data) continue;

        const price = parseFloat(data[data.length - 1].close).toFixed(2);
        const prev = parseFloat(data[data.length - 2].close);
        const change = (price - prev).toFixed(2);
        const rating = (Math.random() > 0.5 ? "Buy" : "Sell"); // placeholder rating

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${symbol}</td>
            <td>$${price}</td>
            <td>${change}</td>
            <td>${rating}</td>
        `;
        // Optional: click row to load chart
        row.addEventListener("click", () => displayStockChart(symbol));
        marketTable.appendChild(row);
    }
}

// Update every 60s
updateMarketOverview();
setInterval(updateMarketOverview, 60000);

// --- Fetch stock data ---
async function getStockData(symbol) {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&outputsize=30&apikey=${apiKey}`;
    try {
        const res = await fetch(url);
        const json = await res.json();
        if (json.status === "error") {
            console.error("Error fetching data:", json.message);
            return null;
        }
        return json.values.reverse();
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}
