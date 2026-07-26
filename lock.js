const validCodes = [
    "EMPIRE-4444",
    "EMPIRE-3333",
    "EMPIRE-2222",
    "EMPIRE-1111",
    "EMPIRE-0000",
    "EMPIRE-6789",
    "EMPIRE-4567",
    "EMPIRE-3456",
    "EMPIRE-2345",
    "EMPIRE-1234",
    "EMPIRE-5032"
];

// Si le verrou est désactivé → bypass total
if (!window.LOCK_ENABLED) {
    window.location.href = "app.html";
}

document.getElementById("unlockBtn").addEventListener("click", () => {

    const code = document.getElementById("accessCode").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    if(validCodes.includes(code)){
        window.location.href = "app.html";
    } else {
        errorMsg.textContent = "❌ Code invalide. Vérifie ton accès.";
    }
});
