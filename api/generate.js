export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Méthode non autorisée."
        });
    }

    try {

        const {
            theme,
            platform,
            audience,
            goal,
            duration,
            style,
            mode
        } = req.body;

        if (!theme || theme.trim() === "") {
            return res.status(400).json({
                error: "Le sujet est obligatoire."
            });
        }

        const context = `

SUJET :
${theme}

PLATEFORME :
${platform}

PUBLIC CIBLE :
${audience}

OBJECTIF :
${goal}

DURÉE :
${duration}

STYLE :
${style}

`;

        let prompt = "";

        switch (mode) {

            case "ideas":

                prompt = `
Tu es un expert des réseaux sociaux.

${context}

Donne 10 idées de vidéos.

Pour chaque idée indique :

- Titre
- Pourquoi elle peut fonctionner
- Niveau de viralité sur 10

Répond en français.
`;

                break;

            case "script":

                prompt = `
Tu es un scénariste professionnel.

${context}

Écris un script complet.

Structure :

🪝 Hook

🎬 Introduction

📖 Développement

🔥 Moment fort

🎯 Conclusion

📢 Appel à l'action

Ajoute également les plans de caméra.

Répond uniquement en français.
`;

                break;

            case "hook":

                prompt = `
Tu es expert en rétention d'audience.

${context}

Crée 20 hooks très puissants.

Répond uniquement en français.
`;

                break;

            case "title":

                prompt = `
Tu es expert SEO.

${context}

Crée 20 titres optimisés.

Répond uniquement en français.
`;

                break;

            case "description":

                prompt = `
Tu es expert YouTube.

${context}

Crée :

Une description.

Des hashtags.

Un appel à l'action.

Des emojis.

Répond uniquement en français.
`;

                break;

            case "planner":

                prompt = `
Tu es un expert YouTube.

${context}

Crée un calendrier de contenu sur 30 jours.

IMPORTANT :

Chaque ligne doit respecter EXACTEMENT ce format.

Jour 1 | Titre | Heure | Objectif

Jour 2 | Titre | Heure | Objectif

Jour 3 | Titre | Heure | Objectif

...

Jour 30 | Titre | Heure | Objectif

Exemple :

Jour 1 | Survivre 100 jours sur Minecraft Hardcore | 18:00 | Plus de vues

Jour 2 | Le plus gros piège Minecraft | 17:00 | Plus d'abonnés

Jour 3 | Les 10 erreurs des débutants | 19:00 | Plus de vues

Ne fais PAS de tableau.

Ne fais PAS de markdown.

Une ligne = une journée.
`;

                break;

            case "complete":

                prompt = `
Tu es Empire AI.

${context}

Prépare un dossier complet contenant :

1. Dix idées

2. Vingt titres

3. Vingt hooks

4. Un script complet

5. Les plans de caméra

6. Une description

7. Les hashtags

8. Un calendrier de publication

Utilise des emojis.

Sépare clairement chaque partie.
`;

                break;

            default:

                prompt = context;

        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",

                headers: {

                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    model: "llama-3.1-8b-instant",

                    temperature: 0.8,

                    max_tokens: 3000,

                    messages: [

                        {
                            role: "system",
                            content:
                                "Tu es Empire AI, expert en création de contenu."
                        },

                        {
                            role: "user",
                            content: prompt
                        }

                    ]

                })

            }

        );        const data = await response.json();

        if (!response.ok) {

            console.log(data);

            return res.status(response.status).json({

                error: data.error?.message || "Erreur de l'API."

            });

        }

        if (
            !data.choices ||
            !data.choices[0] ||
            !data.choices[0].message
        ) {

            return res.status(500).json({

                error: "Réponse invalide de l'IA."

            });

        }

        return res.status(200).json({

            result: data.choices[0].message.content

        });

    }

    catch(error){

        console.error(error);

        return res.status(500).json({

            error:"Impossible de contacter l'IA."

        });

    }

}
