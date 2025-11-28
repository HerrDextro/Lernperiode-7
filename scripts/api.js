console.log("api.js LOADED");


//rounded-box market-box
// List of stocks to show in the live market table
const marketStocks = [
  "AAPL","MSFT","GOOGL","AMZN","META",
  "NVDA","TSLA","ORCL","PLTR","NOC",
  "LMT","RTX","BA","IBM","INTC"
];

const marketTable = document.getElementById("market-table");
const apiKey = "16db685a81d747498056dca116082292".trim(); // your TwelveData API key

// For chart
const symbolInput = document.getElementById("symbolInput"); // optional input
const loadBtn = document.getElementById("loadBtn");
const ctx = document.getElementById("stockChart").getContext("2d");
let chart;

// get all stock data
function getAllStockData() {
    console.log("getAllStockData called");
    const promises = marketStocks.map(symbol => getStockData(symbol));
    return Promise.all(promises);
}

// --- Fetch stock data ---
async function getStockData(symbol) {
    console.log("getStockData called for", symbol);
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&outputsize=30&apikey=${apiKey}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === "error") {
                console.error("API Error:", data.message);
                return null;
            }
            return data.values.reverse(); // latest first
        })
        .catch(err => {
            console.error("Fetch Error:", err);
            return null;
        });
}

// --- Live market overview ---
async function updateMarketOverview() {
    console.log("updateMarketOverview started");

    marketTable.innerHTML = "";

    const results = await Promise.all(
        marketStocks.map(s => getStockData(s))
    );

    results.forEach((data, i) => {
        if (!data || data.length < 2) return;

        const symbol = marketStocks[i];
        const price = parseFloat(data[data.length - 1].close);
        const prev = parseFloat(data[data.length - 2].close);
        const change = (price - prev).toFixed(2);
        const rating = change > 0 ? "Buy" : "Sell";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${symbol}</td>
            <td>$${price.toFixed(2)}</td>
            <td>${change}</td>
            <td>${rating}</td>
        `;
        row.onclick = () => displayStockChart(symbol);
        marketTable.appendChild(row);
    });
}

// --- Load chart for a selected stock ---
loadBtn.addEventListener("click", async () => {
    console.log("Load button clicked");
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



// Update every 60s
updateMarketOverview();
setInterval(updateMarketOverview, 60000);
// Ensure `currentMarketData` is available (it's globally defined in portfolio.js)
// Since api.js is loaded *after* portfolio.js, this variable should be accessible.

// ... (existing marketStocks, apiKey definition)

// Get the element ID for the stock chart, which is needed.
// Bug Fix: stockChart element does not exist in index.html, only accountValueChart.
// I will assume you want to use the second graph box for the stock chart.

const stockChartCtx = document.getElementById("stockValueChart").getContext("2d"); 
// Bug Fix: You had 'stockChart' in api.js but 'stockValueChart' in index.html
let chartInstance; // Renamed 'chart' to 'chartInstance' for clarity

// --- Fetch stock data & update market overview ---

async function updateMarketOverview() {
    console.log("updateMarketOverview started");

    const marketTable = document.getElementById("market-table");
    if (!marketTable) return console.error("Market table not found.");
    marketTable.innerHTML = "";

    const results = await Promise.all(
        marketStocks.map(s => getStockData(s))
    );
    
    // Clear old data for a fresh run
    window.currentMarketData = {}; 

    results.forEach((data, i) => {
        const symbol = marketStocks[i];

        // Check for valid data
        if (!data || data.length < 2) {
            console.warn(`Insufficient data for ${symbol}. Skipping.`);
            return;
        }

        // Use the latest two data points
        const latestData = data[data.length - 1];
        const previousData = data[data.length - 2];
        
        const price = parseFloat(latestData.close);
        const prev = parseFloat(previousData.close);
        const change = (price - prev).toFixed(2);
        const changePercent = ((change / prev) * 100).toFixed(2);
        const rating = change > 0 ? "Buy" : "Sell";
        
        // --- KEY IMPROVEMENT: SHARE DATA WITH PORTFOLIO.JS ---
        // Store current price globally for trading logic
        window.currentMarketData[symbol] = {
            price: price,
            change: change,
            rating: rating
        };
        // --- END IMPROVEMENT ---

        const row = document.createElement("tr");
        const changeClass = change > 0 ? 'positive-change' : (change < 0 ? 'negative-change' : 'no-change');

        row.innerHTML = `
            <td>${symbol}</td>
            <td>$${price.toFixed(2)}</td>
            <td class="${changeClass}">${change} (${changePercent}%)</td>
            <td>${rating}</td>
        `;
        // IMPROVEMENT: Clicking a row displays the chart
        row.onclick = () => displayStockChart(symbol);
        marketTable.appendChild(row);
    });
    
    // IMPROVEMENT: After market data is loaded, update the portfolio display!
    if (typeof window.renderPortfolio === 'function') {
        window.renderPortfolio();
    }
}

// ... (getStockData function remains the same)

// --- Stock Chart Logic ---

// Removed redundant input/button logic. Chart display is now triggered by clicking the table row.
async function displayStockChart(symbol) {
    const data = await getStockData(symbol);
    if (!data) return;

    const labels = data.map(d => new Date(d.datetime).toLocaleTimeString());
    const prices = data.map(d => parseFloat(d.close));

    if (chartInstance) chartInstance.destroy(); // Destroy previous chart
    
    // Initialize new chart
    chartInstance = new Chart(stockChartCtx, {
        type: "line",
        // ... (rest of the chart options remain the same)
        data: {
            labels: labels,
            datasets: [{
                label: `${symbol} Price`,
                data: prices,
                borderColor: "blue",
                fill: false
            }]
        },
        // ... (options)
    });
}

// Update every 60s
updateMarketOverview(); 
setInterval(updateMarketOverview, 60000);