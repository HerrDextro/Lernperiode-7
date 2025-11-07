let accountValue = 100000;
let cashBalance = 100000;
let annualReturn = 0;
const holdings = [];
const pendingTrades = [];
const accountValueChart = document.getElementById("accountValueChart").getContext("2d");
const stockValueChart = document.getElementById("stockValueChart").getContext("2d");
const timestamp = Date.now();
const tradeDelay = 10 * 60 * 1000; // 10 minutes in milliseconds

//we need:
//account value calculated from holdings + cash
//cash balance
//annual return calculated from starting value and current account value
//function that updates pendingtrades from actions undertaken by trade action
//function thaz completes the trade (with like 10 min delay) and updates holdings and cash balance
//function that moves pending trades to holdings when executed
//function that handles the trade interface inputs ->not done!

function calculateAccountValue() {
    let holdingsValue = holdings.reduce((total, item) => total + (item.price * item.amount), 0);
    return cashBalance + holdingsValue;
}
function calculateAnnualReturn() {
    let startingValue = 100000; // assuming starting value is 100,000
    return ((accountValue - startingValue) / startingValue) * 100;
}

function requestTrade(trade) {
    const [action, amount, symbol, , price] = trade.split(" ");
    const amt = parseInt(amount);
    const prc = parseFloat(price.slice(1));
    if (action === "Buy") {
        const cost = amt * prc;
        if (cashBalance >= cost) {
            pendingTrades.push(trade);
            executeTrades(trade, timestamp);
        } else {
            alert("Insufficient cash balance!");
        }
    } else if (action === "Sell") {
        const existingHolding = holdings.find(h => h.symbol === symbol);    
        if (existingHolding && existingHolding.amount >= amt) {
            pendingTrades.push(trade);
            executeTrades(trade, timestamp);
        } else {
            alert("Insufficient holdings to sell!");
        }
    }
}

function executeTrades(requestTime, trade) {
    pendingTrades.forEach(trade => {
        setTimeout(() => {
            const [action, amount, symbol, , price] = trade.split(" ");
            const amt = parseInt(amount);
            const prc = parseFloat(price.slice(1));
            if (action === "Buy") {
                cashBalance -= amt * prc;
                const existingHolding = holdings.find(h => h.symbol === symbol);
                if (existingHolding) {
                    existingHolding.amount += amt;
                    existingHolding.price = prc; // update to latest price
                } else {
                    holdings.push({ symbol: symbol, price: prc, amount: amt });
                }
            } else if (action === "Sell") {
                cashBalance += amt * prc;
                const existingHolding = holdings.find(h => h.symbol === symbol);
                if (existingHolding) {
                    existingHolding.amount -= amt;  
                    if (existingHolding.amount === 0) {
                        holdings.splice(holdings.indexOf(existingHolding), 1);
                    }
                }
            }
            // Remove trade from pendingTrades
            const index = pendingTrades.indexOf(trade);
            if (index > -1) {
                pendingTrades.splice(index, 1);
            }
            // Recalculate account value and annual return
            accountValue = calculateAccountValue();
            annualReturn = calculateAnnualReturn();
        }, tradeDelay);
    });
}


function renderPortfolio() {
    //fist overwiew
    accountValue = calculateAccountValue();
    annualReturn = calculateAnnualReturn();
    //then holdings
    PopulateHoldingsTable();
    //then pending trades
    PopulatePendingTrades();
    //then account value chart
    PopulateAccountValueChart();
}
// Update overview box
const overview = document.getElementById("rounded-box overview-box");
overview.innerHTML = `
    <p>Account Value: $${accountValue.toFixed(2)}</p>
    <p>Cash: $${cashBalance.toFixed(2)}</p>
    <p>Annual Return: ${annualReturn.toFixed(2)}%</p>
    <button class="trade-btn">Trade</button>
`;

function PopulateHoldingsTable() {
    const holdingsTable = document.getElementById("holdings-table");
if (holdingsTable == null) {
    holdingsTable.innerHTML = "<tr><td>No holdings available</td></tr>"; 
}
else {
    holdings.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${item.symbol}</td><td>${item.price}</td><td>${item.amount}</td>`;
        appendChild(row);
        });
    }
}

function PopulatePendingTrades() {
// Populate Pending Trades
const pendingTradesList = document.getElementById("pending-trades-list");
pendingTrades.forEach(trade => {
    const li = document.createElement("li");
    li.textContent = trade;
    pendingTradesList.appendChild(li);
});
}

//this one still needs some work (convert portfolio values to chart data)
function PopulateAccountValueChart() {
const accountValueChartInstance = new Chart(accountValueChart, {
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
}