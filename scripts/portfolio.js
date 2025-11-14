document.addEventListener("DOMContentLoaded", () => {



let accountValue = 100000;
let cashBalance = 100000;
let annualReturn = 0;
const holdings = [];
const pendingTrades = [];
const portfolio = document.getElementById("portfolio-overview");
const accountValueChart = document.getElementById("accountValueChart").getContext("2d");
/*const stockValueChart = document.getElementById("stockValueChart").getContext("stockValueChart");*/
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
saveDailyAccountValue();
setInterval(saveDailyAccountValue, 1000 * 60 * 60); // autosave every hour

renderPortfolio();
PopulateAccountValueChart();


function renderPortfolio() {
    //fist overwiew
    renderOverview();
    //then holdings
    PopulateHoldingsTable();
    //then pending trades
    PopulatePendingTrades();
    //then account value chart
    PopulateAccountValueChart();
}

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
            executeTrades(timestamp, trade);
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

function renderOverview() {
    accountValue = calculateAccountValue();
    annualReturn = calculateAnnualReturn();
    // Update overview box
    const overview = portfolio.querySelector(".overview-box"); //seems to remove the other boxes in the column
    overview.innerHTML = `
    <p>Account Value: $${accountValue.toFixed(2)}</p>
    <p>Cash: $${cashBalance.toFixed(2)}</p>
    <p>Annual Return: ${annualReturn.toFixed(2)}%</p>
`;
}


function PopulateHoldingsTable() {
    const holdingsTable = document.querySelector(".holdings-box");
if (!holdingsTable) return;
if (holdings.length === 0) {
    holdingsTable.innerHTML = "<tr><td>No holdings available</td></tr>";
    return;
}

}

function PopulatePendingTrades() {
// Populate Pending Trades
const pendingTradesList = document.querySelector(".pending-box");
if (pendingTrades.length === 0) {
    pendingTradesList.innerHTML = "<tr><td>No pending trades</td></tr>";
}
pendingTrades.forEach(trade => {
    const li = document.createElement("li");
    li.textContent = trade;
    pendingTradesList.appendChild(li);
});
}

//from here on account value history and calculation for the chart
//this one still needs some work (convert portfolio values to chart data)
function saveDailyDataToStorage(date, accountValue) {
    localStorage.setItem(date, accountValue);
    localStorage.setItem("holdings", JSON.stringify(holdings));
}
function getValueHistory() {
    return JSON.parse(localStorage.getItem("accountValues")) || [];
}
function getTradeHistory() {
    return JSON.parse(localStorage.getItem("holdings")) || [];
}

function createAccountHistory() {
    const history = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== "holdings") {
            const value = localStorage.getItem(key);
            history.push({ date: key, value: parseFloat(value) });
        }
    }

    history.sort((a,b) => new Date(a.date) - new Date(b.date));
    return history;
}
 //should create an array of objects with date and value for the graph maker

function PopulateAccountValueChart() {
    const history = createAccountHistory();
    if (history.length === 0) {
        console.log("No account value history available");
        return;
    }
    const ctx = document.getElementById('accountValueChart').getContext('2d');
    const accountChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: history.map(entry => entry.date),
            datasets: [{
                label: 'Account Value',
                data: history.map(entry => entry.value),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
}

//logic for saving daily data to local storage
function saveDailyAccountValue() {
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const accountValue = calculateAccountValue();
    
    if (!localStorage.getItem(today)) {
        localStorage.setItem(today, accountValue);
    }
}




});

/*
localStorage.setItem(key,value); // Adds data in key-value pair
localStorage.getItem(key);       // Gets the data for the given key
localStorage.removeItem(key);    // Removes the (key, value) pair data for the given key
localStorage.key(index);         // Gets the key based on the index position
localStorage.length;             // Returns the lenght of the storage list
localStorage.clear();            // Clears all the local storage associated with the origin.  

Idea: key: date, value: acount value
key: holdings, value: JSON.stringify(holdings array)
*/