/* ========================================================= */
/* MODE ACTIF */
/* ========================================================= */

let currentMode = "planner";
let calendrierData = [];

/* Boutons du menu */
const menuButtons = document.querySelectorAll(".menu");

menuButtons.forEach(button => {
    button.addEventListener("click", () => {

        menuButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentMode = button.dataset.mode;
    });
});

/* ========================================================= */
/* GENERATION IA */
/* ========================================================= */

async function generate(){

    const theme = document.getElementById("theme").value.trim();
    const platform = document.getElementById("platform").value;
    const audience = document.getElementById("audience").value;
    const goal = document.getElementById("goal").value;
    const duration = document.getElementById("duration").value;
    const style = document.getElementById("style").value;

    const result = document.getElementById("result");
    const button = document.getElementById("generateBtn");

    if(theme === ""){
        alert("Entre un sujet.");
        return;
    }

    button.disabled = true;
    button.innerHTML = "⏳ Génération...";
    result.innerHTML = "<div class='loader'></div><p>Empire AI génère ton contenu...</p>";

    try{

        const response = await fetch("/api/generate",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify({
                theme,
                platform,
                audience,
                goal,
                duration,
                style,
                mode:currentMode
            })
        });

        const data = await response.json();

        if(data.error){
            result.innerHTML = "❌ " + data.error;
        }
        else{

            /* Mode Planificateur IA */
            if(currentMode === "planner"){
                try{
                    afficherCalendrier(JSON.parse(data.result));
                }
                catch{
                    result.innerHTML = "Le calendrier n'a pas pu être généré.";
                }
            }

            /* Autres modes */
            else{
                result.innerHTML = data.result;
            }
        }

    }
    catch{
        result.innerHTML = "Impossible de contacter l'IA.";
    }

    button.disabled = false;
    button.innerHTML = "🚀 Générer";
}

/* ========================================================= */
/* CALENDRIER IA */
/* ========================================================= */

function afficherCalendrier(calendrier){

    calendrierData = calendrier;

    const result = document.getElementById("result");

    let html = "";
    html += "<h2>📅 Calendrier de publication</h2>";
    html += "<div class='calendar'>";

    calendrier.forEach(jour => {

        html += `
        <div class="day" onclick="ouvrirJour(${jour.jour})">
            <h3>Jour ${jour.jour}</h3>
            <p>${jour.titre}</p>
        </div>
        `;
    });

    html += "</div>";

    result.innerHTML = html;
}

/* ========================================================= */
/* FENÊTRE DE DÉTAIL NOTION */
/* ========================================================= */

function ouvrirJour(jourNumero){

    const popup = document.getElementById("dayPopup");
    const titleEl = document.getElementById("popupTitle");
    const videoTitleEl = document.getElementById("popupVideoTitle");
    const hourEl = document.getElementById("popupHour");
    const goalEl = document.getElementById("popupGoal");

    const jourData = calendrierData.find(j => j.jour === jourNumero);

    if(!jourData){
        alert("Données introuvables pour ce jour.");
        return;
    }

    titleEl.textContent = `Jour ${jourData.jour}`;
    videoTitleEl.textContent = jourData.titre || "Non défini";
    hourEl.textContent = jourData.heure || "Non définie";
    goalEl.textContent = jourData.objectif || "Non défini";

    popup.style.display = "flex";
}

/* Fermer la popup */
document.getElementById("popupCloseBtn").addEventListener("click",()=>{
    document.getElementById("dayPopup").style.display="none";
});

/* Fermer en cliquant en dehors */
document.getElementById("dayPopup").addEventListener("click",(e)=>{
    if(e.target.id === "dayPopup"){
        e.target.style.display = "none";
    }
});

/* ========================================================= */
/* COPIER */
/* ========================================================= */

document.getElementById("copyBtn").addEventListener("click",()=>{
    navigator.clipboard.writeText(
        document.getElementById("result").innerText
    );
    alert("Texte copié.");
});

/* ========================================================= */
/* EFFACER */
/* ========================================================= */

document.getElementById("clearBtn").addEventListener("click",()=>{
    document.getElementById("result").innerHTML = "";
});

/* ========================================================= */
/* TOUCHE ENTRÉE */
/* ========================================================= */

document.getElementById("theme").addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
        e.preventDefault();
        generate();
    }
});

/* ========================================================= */
/* POPUP PAIEMENT */
/* ========================================================= */

function ouvrirPaiement(){
    alert(
        "Pour activer Empire AI Pro :\n\n" +
        "💳 Envoie un virement Interac de 10$ à : paiement@empireai.ca\n" +
        "Question : Empire\n" +
        "Réponse : AI\n\n" +
        "Ton accès sera activé manuellement."
    );
}
