export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Méthode non autorisée."
        });
    }

    try {

        const { theme, mode } = req.body;

        let prompt = "";

        switch (mode) {

            case "ideas":
                prompt = `
Tu es un expert YouTube.

Donne 10 idées de vidéos originales sur le sujet suivant :

${theme}

Pour chaque idée ajoute une courte explication.
`;
                break;

            case "script":
                prompt = `
Tu es un scénariste YouTube.

Écris un script complet sur :

${theme}

Le script doit contenir :

- Hook
- Introduction
- Développement
- Conclusion
- Appel à l'action
`;
                break;

            case "hook":
                prompt = `
Tu es expert en rétention d'audience.

Crée 15 hooks ultra accrocheurs sur :

${theme}

Les hooks doivent donner envie de continuer la vidéo.
`;
                break;

            case "title":
                prompt = `
Tu es expert SEO YouTube.

Génère 20 titres extrêmement accrocheurs sur :

${theme}

Les titres doivent donner envie de cliquer.
`;
                break;

            case "description":
                prompt = `
Écris une description YouTube professionnelle sur :

${theme}

Ajoute :

- des emojis
- un appel à l'action
- des hashtags
`;
                break;

            case "calendar":
                prompt = `
Tu es un coach créateur de contenu.

Crée un calendrier de publication sur 30 jours concernant :

${theme}

Présente le résultat sous forme de tableau.
`;
                break;

            default:

                prompt = theme;

        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    model: "llama-3.1-8b-instant",

                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]

                })

            }
        );

        const data = await response.json();

        if (data.error) {

            return res.status(500).json({
                error: data.error.message
            });

        }

        return res.status(200).json({

            result: data.choices[0].message.content

        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({

            error: "Erreur IA"

        });

    }

}
