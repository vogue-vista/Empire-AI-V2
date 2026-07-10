const validCodes = [
    "EMPIRE-4921",
    "EMPIRE-7730",
    "EMPIRE-1189",
    "EMPIRE-5502",
    "EMPIRE-9044",
    "EMPIRE-6617",
    "EMPIRE-2208",
    "EMPIRE-8893",
    "EMPIRE-3470",
    "EMPIRE-7156",
    "EMPIRE-5032"
];

document.getElementById("unlockBtn").addEventListener("click", () => {

    const code = document.getElementById("accessCode").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    if(validCodes.includes(code)){
        window.location.href = "app.html";
    } else {
        errorMsg.textContent = "❌ Code invalide. Vérifie ton accès.";
    }
});
