//The idea that this shows all the infos and portfolio/api come up with the numbers



// --- Placeholder data for JS integration ---
const holdingsData = [
  { symbol: "AAPL", price: 172.5, amount: 10 },
  { symbol: "TSLA", price: 305.2, amount: 5 },
  { symbol: "GOOGL", price: 127.8, amount: 2 }
];

const pendingTradesData = [
  "Buy 5 AAPL at $170",
  "Sell 2 TSLA at $310",
  "Buy 1 GOOGL at $128"
];

const marketData = [
  { symbol: "AAPL", price: 172.5, change: "+0.8%", rating: "Buy" },
  { symbol: "TSLA", price: 305.2, change: "-1.2%", rating: "Hold" },
  { symbol: "GOOGL", price: 127.8, change: "+0.3%", rating: "Buy" },
  { symbol: "AMZN", price: 105.4, change: "+0.1%", rating: "Sell" },
];

// --- Populate Holdings Table ---
const holdingsTable = document.getElementById("holdings-table");
holdingsData.forEach(item => {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${item.symbol}</td><td>${item.price}</td><td>${item.amount}</td>`;
  holdingsTable.appendChild(row);
});

// --- Populate Pending Trades ---
const pendingTradesList = document.getElementById("pending-trades-list");
pendingTradesData.forEach(trade => {
  const li = document.createElement("li");
  li.textContent = trade;
  pendingTradesList.appendChild(li);
});

// --- Populate Market Table ---
const marketTable = document.getElementById("market-table");
marketData.forEach(stock => {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${stock.symbol}</td><td>${stock.price}</td><td>${stock.change}</td><td>${stock.rating}</td>`;
  marketTable.appendChild(row);
});

// --- Placeholder Charts ---
const accountValueCtx = document.getElementById("accountValueChart").getContext("2d");
const stockValueCtx = document.getElementById("stockValueChart").getContext("2d");

const accountValueChart = new Chart(accountValueCtx, {
  type: "line",
  data: {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    datasets: [{
      label: "Account Value",
      data: [100000, 101200, 102500, 101800, 103000],
      borderColor: "lime",
      fill: false
    }]
  },
  options: { responsive: true }
});

const stockValueChart = new Chart(stockValueCtx, {
  type: "line",
  data: {
    labels: ["10:00", "11:00", "12:00", "13:00", "14:00"],
    datasets: [{
      label: "AAPL",
      data: [170, 171, 172, 172.5, 173],
      borderColor: "orange",
      fill: false
    }]
  },
  options: { responsive: true }
});