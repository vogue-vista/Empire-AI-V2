// Remplace entièrement ton fichier script.js

let currentMode = "ideas";

const menuButtons = document.querySelectorAll(".menu");

menuButtons.forEach(button => {

    button.addEventListener("click", () => {

        menuButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentMode = button.dataset.mode;

    });

});

async function generate() {

    const theme = document.getElementById("theme").value.trim();

    const platform = document.getElementById("platform").value;

    const audience = document.getElementById("audience").value;

    const goal = document.getElementById("goal").value;

    const duration = document.getElementById("duration").value;

    const style = document.getElementById("style").value;

    const result = document.getElementById("result");

    const button = document.getElementById("generateBtn");

    if(theme===""){

        alert("Entre un sujet.");

        return;

    }

    button.disabled=true;

    button.innerHTML="⏳ Génération...";

    result.innerHTML="L'IA travaille...";

    try{

        const response=await fetch("/api/generate",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

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

        const data=await response.json();

        if(data.error){

            result.innerHTML="❌ "+data.error;

        }

        else{

            if(currentMode==="planner"){

                afficherCalendrier(data.result);

            }

            else{

                result.innerHTML=data.result;

            }

        }

    }

    catch{

        result.innerHTML="Impossible de contacter l'IA.";

    }

    button.disabled=false;

    button.innerHTML="🚀 Générer";

}

/*==============================*/
/* CALENDRIER */
/*==============================*/

function afficherCalendrier(texte){

    const result=document.getElementById("result");

    const lignes=texte.split("\n").filter(l=>l.trim()!="");

    let html="";

    html+="<h2>📅 Planificateur IA</h2>";

    html+="<div class='calendar'>";

    lignes.forEach(ligne=>{

        html+=`

        <div class="day">

            ${ligne}

        </div>

        `;

    });

    html+="</div>";

    result.innerHTML=html;

}

/*==============================*/
/* COPIER */
/*==============================*/

document.getElementById("copyBtn").addEventListener("click",()=>{

    navigator.clipboard.writeText(

        document.getElementById("result").innerText

    );

    alert("Copié !");

});

/*==============================*/
/* EFFACER */
/*==============================*/

document.getElementById("clearBtn").addEventListener("click",()=>{

    document.getElementById("result").innerHTML="";

});

/*==============================*/
/* ENTREE */
/*==============================*/

document.getElementById("theme").addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        e.preventDefault();

        generate();

    }

});
