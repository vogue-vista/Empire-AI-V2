let currentMode = "planner";
let calendrierData = [];

/* BOUTONS MENU */

const menuButtons = document.querySelectorAll(".menu");
const generateBtn = document.getElementById("generateBtn");

menuButtons.forEach(button => {
    button.addEventListener("click", () => {

        if (!button.dataset.mode) return;

        menuButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentMode = button.dataset.mode;
        changerInterfaceMode(currentMode);
    });
});

/* CHANGER INTERFACE SELON MODE */

function changerInterfaceMode(mode){

    const headerTitle = document.getElementById("headerTitle");
    const headerSubtitle = document.getElementById("headerSubtitle");
    const formTitle = document.getElementById("formTitle");
    const resultTitle = document.getElementById("resultTitle");
    const viralField = document.getElementById("viralContentField");

    if(mode === "planner"){
        headerTitle.textContent = "Empire AI – Planificateur IA";
        headerSubtitle.textContent = "Remplis les informations ci‑dessous et laisse Empire AI générer ton calendrier de contenu.";
        formTitle.textContent = "🎯 Paramètres du projet";
        resultTitle.textContent = "📄 Résultat généré";
        viralField.style.display = "none";
        generateBtn.textContent = "🚀 Générer le calendrier";
    }
    else if(mode === "complete"){
        headerTitle.textContent = "Empire AI – Génération complète";
        headerSubtitle.textContent = "Empire AI va générer un pack complet : idées, titres, hooks, script, description, hashtags.";
        formTitle.textContent = "🎯 Paramètres de la vidéo";
        resultTitle.textContent = "📄 Pack complet généré";
        viralField.style.display = "none";
        generateBtn.textContent = "🚀 Générer le pack complet";
    }
    else if(mode === "viral"){
        headerTitle.textContent = "Empire AI – Analyse virale";
        headerSubtitle.textContent = "Colle ton texte, ton script ou ton titre pour analyser son potentiel viral.";
        formTitle.textContent = "🔥 Analyse virale du contenu";
        resultTitle.textContent = "📊 Analyse virale";
        viralField.style.display = "block";
        generateBtn.textContent = "🚀 Analyser la viralité";
    }
}

/* GENERATION IA */

generateBtn.addEventListener("click", generate);

async function generate(){

    const theme = document.getElementById("theme").value.trim();
    const platform = document.getElementById("platform").value;
    const audience = document.getElementById("audience").value;
    const goal = document.getElementById("goal").value;
    const duration = document.getElementById("duration").value;
    const style = document.getElementById("style").value;
    const viralContent = document.getElementById("viralContent").value.trim();

    const result = document.getElementById("result");

    if(currentMode !== "viral" && theme === ""){
        alert("Entre un sujet.");
        return;
    }

    if(currentMode === "viral" && viralContent === ""){
        alert("Colle un texte, un script ou un titre à analyser.");
        return;
    }

    generateBtn.disabled = true;
    generateBtn.innerHTML = "⏳ Génération...";
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
                mode:currentMode,
                contenu:viralContent
            })
        });

        const data = await response.json();

        if(data.error){
            result.innerHTML = "❌ " + data.error;
        }
        else{

            if(currentMode === "planner"){
                try{
                    afficherCalendrier(JSON.parse(data.result));
                }
                catch{
                    result.innerHTML = "Le calendrier n'a pas pu être généré.";
                }
            }
            else{
                result.innerHTML = data.result;
            }
        }

    }
    catch{
        result.innerHTML = "Impossible de contacter l'IA.";
    }

    generateBtn.disabled = false;
    changerInterfaceMode(currentMode);
}

/* CALENDRIER */

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

/* POPUP JOUR */

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

document.getElementById("popupCloseBtn").addEventListener("click",()=>{
    document.getElementById("dayPopup").style.display="none";
});

document.getElementById("dayPopup").addEventListener("click",(e)=>{
    if(e.target.id === "dayPopup"){
        e.target.style.display = "none";
    }
});

/* POPUP PRO */

const proBtn = document.getElementById("proBtn");
const proPopup = document.getElementById("proPopup");
const proCloseBtn = document.getElementById("proCloseBtn");

proBtn.addEventListener("click",()=>{
    proPopup.style.display = "flex";
});

proCloseBtn.addEventListener("click",()=>{
    proPopup.style.display = "none";
});

proPopup.addEventListener("click",(e)=>{
    if(e.target.id === "proPopup"){
        e.target.style.display = "none";
    }
});

/* COPIER */

document.getElementById("copyBtn").addEventListener("click",()=>{
    navigator.clipboard.writeText(
        document.getElementById("result").innerText
    );
    alert("Texte copié.");
});

/* EFFACER */

document.getElementById("clearBtn").addEventListener("click",()=>{
    document.getElementById("result").innerHTML = "";
});

/* ENTRÉE POUR GÉNÉRER */

document.getElementById("theme").addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
        e.preventDefault();
        generate();
    }
});

/* INIT */

changerInterfaceMode(currentMode);
