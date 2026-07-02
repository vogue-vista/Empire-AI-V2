async function generate() {

    const theme = document.getElementById("theme").value;
    const result = document.getElementById("result");

    if (theme.trim() === "") {
        result.innerHTML = "⚠️ Écris d'abord un sujet.";
        return;
    }

    result.innerHTML = "🤖 Empire AI réfléchit...";

    try {

        const response = await fetch("/api/generate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                theme: theme
            })

        });

        const data = await response.json();

        if (data.result) {

            result.innerHTML = data.result;

        } else {

            result.innerHTML = "❌ " + (data.error || "Une erreur est survenue.");

        }

    } catch (error) {

        result.innerHTML = "❌ Impossible de contacter l'IA.";

    }

}
