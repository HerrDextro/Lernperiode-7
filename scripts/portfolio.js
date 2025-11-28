// Global State - Exposed to other scripts
var accountValue = 110000;
var cashBalance = 110000;
var annualReturn = 0;
var holdings = [];
var pendingTrades = []; // Store objects now, not strings
var currentMarketData = {}; // Filled by api.js
const STARTING_VALUE = 100000;
const TRADE_DELAY = 10 * 1000; // Testing: 10 seconds. Change back to 10 * 60 * 1000 for 10 min



function calculateAccountValue() {
    let holdingsValue = holdings.reduce((total, item) => total + (item.price * item.amount), 0);
    return cashBalance + holdingsValue;
}

function calculateAnnualReturn() {
    return ((accountValue - STARTING_VALUE) / STARTING_VALUE) * 100;
}

// Trade logic below
function requestTrade(action, symbol, amount) {
    const amt = parseInt(amount);
    if (isNaN(amt) || amt <= 0) {
        alert("Please enter a valid amount.");
        return false;
    }
    
    // requires api to run first
    const currentPrice = currentMarketData[symbol] ? currentMarketData[symbol].price : null;

    if (!currentPrice) {
        alert(`Could not find current price for ${symbol}. Please check market table.`);
        return false;
    }

    const trade = {
        action: action,
        symbol: symbol,
        amount: amt,
        price: currentPrice,
        requestTime: Date.now(),
        executeTime: Date.now() + TRADE_DELAY,
        status: "Pending"
    };

    const cost = amt * currentPrice;

    if (action === "buy") {
        if (cashBalance >= cost) {
            pendingTrades.push(trade);
            //NEW
            setTimeout(processTradeQueue, TRADE_DELAY); 
            renderPortfolio();
            return true;
        } else {
            alert(`Insufficient cash balance. Needed: $${cost.toFixed(2)}`);
            return false;
        }
    } else if (action === "sell") {
        const existingHolding = holdings.find(h => h.symbol === symbol); 
        if (existingHolding && existingHolding.amount >= amt) {
            pendingTrades.push(trade);
            // (fixed) New: Immediately process the queue
            setTimeout(processTradeQueue, TRADE_DELAY);
            renderPortfolio();
            return true;
        } else {
            alert(`Insufficient holdings. You only own ${existingHolding ? existingHolding.amount : 0} of ${symbol}.`);
            return false;
        }
    }
    return false;
}

// NEW
function processTradeQueue() {
    const now = Date.now();
    const tradesToExecute = pendingTrades.filter(t => t.executeTime <= now && t.status === "Pending");
    
    tradesToExecute.forEach(trade => {
        const { action, symbol, amount, price } = trade;

        if (action === "buy") {
            cashBalance -= amount * price;
            const existingHolding = holdings.find(h => h.symbol === symbol);
            if (existingHolding) {
                existingHolding.amount += amount;
                // Don't update price here, use average cost basis in real life, but for now just leave it. Gemini said
            } else {
                holdings.push({ symbol: symbol, price: price, amount: amount });
            }
        } else if (action === "sell") {
            cashBalance += amount * price;
            const existingHolding = holdings.find(h => h.symbol === symbol);
            if (existingHolding) {
                existingHolding.amount -= amount;  
                if (existingHolding.amount === 0) {
                    holdings.splice(holdings.indexOf(existingHolding), 1);
                }
            }
        }
        trade.status = "Executed"; 
    });


    pendingTrades = pendingTrades.filter(t => t.status !== "Executed");
    
    accountValue = calculateAccountValue();
    annualReturn = calculateAnnualReturn();
    renderPortfolio();
}

// Rendering
function renderPortfolio() {
    renderOverview();
    PopulateHoldingsTable();
    PopulatePendingTrades();
    // PopulateAccountValueChart(); // Only call this on DOMContentLoaded or when neede to recreate chart
}

function renderOverview() {
    accountValue = calculateAccountValue();
    annualReturn = calculateAnnualReturn();
    const overview = document.querySelector("#portfolio-overview .overview-box"); 
    if (overview) {
        overview.innerHTML = `
            <p>Account Value: $${accountValue.toFixed(2)}</p>
            <p>Cash: $${cashBalance.toFixed(2)}</p>
            <p class="annual-return ${annualReturn >= 0 ? 'positive' : 'negative'}">
                Annual Return: ${annualReturn.toFixed(2)}%
            </p>
        `;
    }
}


function PopulateHoldingsTable() {
    const holdingsBody = document.getElementById("holdings-table");
    if (!holdingsBody) return;
    
    holdingsBody.innerHTML = ""; // Clear existing rows

    if (holdings.length === 0) {
        holdingsBody.innerHTML = '<tr><td colspan="3">No holdings available</td></tr>';
        return;
    }

    holdings.forEach(item => {
        const row = document.createElement("tr");
        const marketPrice = currentMarketData[item.symbol] ? currentMarketData[item.symbol].price : item.price;
        const value = item.amount * marketPrice;

        row.innerHTML = `
            <td>${item.symbol}</td>
            <td>$${marketPrice.toFixed(2)}</td>
            <td>${item.amount}</td>
        `;
        // IMPROVEMENT: Added total value
        // row.innerHTML += `<td>$${value.toFixed(2)}</td>`; 
        holdingsBody.appendChild(row);
    });
}

function PopulatePendingTrades() {
    const pendingTradesList = document.getElementById("pending-trades-list");
    if (!pendingTradesList) return;
    
    pendingTradesList.innerHTML = ""; // Clear existing items

    if (pendingTrades.length === 0) {
        pendingTradesList.innerHTML = '<li>No pending trades</li>';
        return;
    }
    
    pendingTrades.forEach(trade => {
        const li = document.createElement("li");
        const remainingTime = Math.max(0, trade.executeTime - Date.now());
        const remainingSeconds = Math.ceil(remainingTime / 1000);
        
        li.textContent = `${trade.action.toUpperCase()} ${trade.amount} of ${trade.symbol} @ $${trade.price.toFixed(2)} (Execute in ${remainingSeconds}s)`;
        pendingTradesList.appendChild(li);
    });
}


// Local Storage logic plus history chart
function createAccountHistory() {
    const history = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Only look for keys that look like dates ("YYYY-MM-DD")
        if (key && key.match(/^\d{4}-\d{2}-\d{2}$/)) { 
            const value = localStorage.getItem(key);
            history.push({ date: key, value: parseFloat(value) });
        }
    }

    history.sort((a,b) => new Date(a.date) - new Date(b.date));
    return history;
}


function saveDailyAccountValue() {
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const currentAccountValue = calculateAccountValue();
    
    localStorage.setItem(today, currentAccountValue);
}

function PopulateAccountValueChart() {
    const history = createAccountHistory();
    if (history.length === 0) {
        console.log("No account value history available");
        // IMPROVEMENT: Display an initialization message on the chart canvas
        return;
    }
    const ctx = document.getElementById('accountValueChart').getContext('2d');
    
    if (window.accountChartInstance) {
        window.accountChartInstance.destroy();
    }
    
    window.accountChartInstance = new Chart(ctx, { 
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

//gemini 
// --- Initial Setup ---
document.addEventListener("DOMContentLoaded", () => {
    // Initial render and chart setup
    renderPortfolio();
    PopulateAccountValueChart();
    
    // Start hourly save timer
    setInterval(saveDailyAccountValue, 1000 * 60 * 60); 
    
    // Improvement: Set up a timer to continuously check and process the queue
    setInterval(processTradeQueue, 5000); // Check every 5 seconds
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