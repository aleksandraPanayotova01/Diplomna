(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const closeAlertBtns = document.querySelectorAll(".closeAlertBtn");

        closeAlertBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                const alertBox = this.parentElement; // Closest .alert element
                alertBox.style.display = "none";
            });
        });
    });
})();
