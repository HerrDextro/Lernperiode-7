document.addEventListener("DOMContentLoaded", () => {

    const tradeButton = document.querySelector(".trade-btn");
    const dialog = document.getElementById("trade-popup");
    const closeBtn = document.getElementById("close-popup");
    const tradeForm = document.getElementById("trade-form"); // Grab the form

    // --- Modal Control ---
    tradeButton.addEventListener("click", () => {
        dialog.showModal();
    });

    closeBtn.addEventListener("click", () => {
        dialog.close();
    });

    // close on click (better ux)
    dialog.addEventListener("click", e => {
        const rect = dialog.getBoundingClientRect();
        // Check if click is outside the dialog box
        const outside = 
            e.clientX < rect.left || 
            e.clientX > rect.right || 
            e.clientY < rect.top || 
            e.clientY > rect.bottom;

        if (outside) dialog.close();
    });
    
    //New
    tradeForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Stop the default form submission
        
        // Get values from the form inputs
        const tradeType = document.getElementById("trade-type").value; // 'buy' or 'sell'
        const stockSymbol = document.getElementById("stock-symbol").value.toUpperCase().trim();
        const quantity = document.getElementById("quantity").value; // comes as a string

        // Call the function defined in portfolio.js
        // It returns true if the trade was successfully requested/queued
        const success = requestTrade(tradeType, stockSymbol, quantity); 
        
        if (success) {
            alert(`Trade Request: ${tradeType.toUpperCase()} ${quantity} of ${stockSymbol} submitted and pending!`);
            dialog.close(); // Close the modal on success
            tradeForm.reset(); // Clear the form
        }
        // If it failed, requestTrade already showed an alert.
    });
});