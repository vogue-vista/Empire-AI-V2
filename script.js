let mode = "ideas";

const menus = document.querySelectorAll(".menu");

menus.forEach(button => {

    button.addEventListener("click", () => {

        menus.forEach(b => b.classList.remove("active"));

        button.classList.add("active");

        mode = button.dataset.mode;

    });

});

async function generate() {

    const theme = document.getElementById("theme").value;
    const result = document.getElementById("result");

    if(theme.trim()==""){

        result.innerHTML="⚠️ Écris un sujet.";

        return;

    }

    result.innerHTML="🤖 Empire AI réfléchit...";

    try{

        const response = await fetch("/api/generate",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                theme,
                mode
            })

        });

        const data = await response.json();

        result.innerHTML=data.result || data.error;

    }catch(e){

        result.innerHTML="❌ Impossible de contacter l'IA.";

    }

}
