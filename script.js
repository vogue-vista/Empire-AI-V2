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

    if(theme === ""){

        alert("Entre un sujet.");

        return;

    }

    button.disabled = true;

    button.innerHTML = "⏳ Génération...";

    result.innerHTML = "L'IA travaille...";

    try{

        const response = await fetch("/api/generate",{

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

        const data = await response.json();

        if(data.error){

            result.innerHTML = "❌ " + data.error;

        }else{

            result.innerHTML = data.result;

        }

    }catch(error){

        result.innerHTML = "Impossible de contacter l'IA.";

    }

    button.disabled = false;

    button.innerHTML = "🚀 Générer";

}

/* ========================= */
/* COPIER */
/* ========================= */

document.getElementById("copyBtn").addEventListener("click",()=>{

    const text = document.getElementById("result").innerText;

    navigator.clipboard.writeText(text);

    alert("Texte copié !");

});

/* ========================= */
/* EFFACER */
/* ========================= */

document.getElementById("clearBtn").addEventListener("click",()=>{

    document.getElementById("result").innerHTML="";

});

/* ========================= */
/* RACCOURCI CLAVIER */
/* ========================= */

document.getElementById("theme").addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        e.preventDefault();

        generate();

    }

});
