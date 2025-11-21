document.addEventListener("DOMContentLoaded", () => {

  const tradeButton = document.querySelector(".trade-btn");
  const dialog = document.getElementById("trade-popup");
  const closeBtn = document.getElementById("close-popup");

  tradeButton.addEventListener("click", () => {
    dialog.showModal();
  });

  closeBtn.addEventListener("click", () => {
    dialog.close();
  });

  // close on click (better ux)
  dialog.addEventListener("click", e => {
    const rect = dialog.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!inside) dialog.close();
  });
})