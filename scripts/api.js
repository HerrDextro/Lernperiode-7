console.log("api.js LOADED");

// --- Config ---
const marketStocks = [
  "AAPL","MSFT","GOOGL","AMZN","META",
  "NVDA","TSLA","ORCL","PLTR","NOC",
  "LMT","RTX","BA","IBM","INTC"
];

const apiKey = "16db685a81d747498056dca116082292".trim(); // TwelveData API key
const marketTable = document.getElementById("market-table");
const stockChartCtx = document.getElementById("stockValueChart").getContext("2d");
let chartInstance;

// --- Fetch stock data ---
async function getStockData(symbol) {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&outputsize=30&apikey=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "error") {
            console.error(`API error for ${symbol}:`, data.message);
            return null;
        }
        return data.values.reverse(); // latest first
    } catch (err) {
        console.error(`Fetch error for ${symbol}:`, err);
        return null;
    }
}

// --- Update market overview ---
async function updateMarketOverview() {
    if (!marketTable) return console.error("Market table not found");
    marketTable.innerHTML = "";
    window.currentMarketData = {}; // global for portfolio.js

    const results = await Promise.all(marketStocks.map(s => getStockData(s)));

    results.forEach((data, i) => {
        const symbol = marketStocks[i];
        if (!data || data.length < 2) return;

        const latest = parseFloat(data[data.length - 1].close);
        const prev = parseFloat(data[data.length - 2].close);
        const change = (latest - prev).toFixed(2);
        const changePercent = ((change / prev) * 100).toFixed(2);
        const rating = change > 0 ? "Buy" : "Sell";

        // store for portfolio logic
        window.currentMarketData[symbol] = { price: latest, change, rating };

        const row = document.createElement("tr");
        const changeClass = change > 0 ? 'positive-change' : (change < 0 ? 'negative-change' : 'no-change');
        row.innerHTML = `
            <td>${symbol}</td>
            <td>$${latest.toFixed(2)}</td>
            <td class="${changeClass}">${change} (${changePercent}%)</td>
            <td>${rating}</td>
        `;
        // click to show chart
        row.onclick = () => displayStockChart(symbol);
        marketTable.appendChild(row);
    });

    // optional: refresh portfolio overview if function exists
    if (typeof window.renderPortfolio === "function") window.renderPortfolio();
}

// --- Display stock chart in middle column ---
async function displayStockChart(symbol) {
    const data = await getStockData(symbol);
    if (!data) return;

    const labels = data.map(d => new Date(d.datetime).toLocaleTimeString());
    const prices = data.map(d => parseFloat(d.close));

    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(stockChartCtx, {
        type: "line",
        data: {
            labels,
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
                x: { display: true, title: { display: true, text: "Time" } },
                y: { display: true, title: { display: true, text: "Price (USD)" } }
            }
        }
    });
}

// --- Initial load & refresh every 60s ---
updateMarketOverview();
setInterval(updateMarketOverview, 60000);
