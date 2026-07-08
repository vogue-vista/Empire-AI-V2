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

Sujet : ${theme}

Plateforme : ${platform}

Public cible : ${audience}

Objectif : ${goal}

Durée : ${duration}

Style : ${style}

`;

        let prompt = "";

        switch (mode) {

            case "ideas":

                prompt = `

Tu es un expert des réseaux sociaux.

${context}

Donne 10 idées de vidéos.

Pour chaque idée indique :

- Un titre
- Pourquoi elle peut devenir virale
- Une note sur 10

Répond uniquement en français.

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

Ajoute aussi des plans de caméra.

Répond uniquement en français.

`;

                break;

            case "hook":

                prompt = `

Tu es un expert YouTube.

${context}

Crée 20 hooks très puissants.

Répond uniquement en français.

`;

                break;

            case "title":

                prompt = `

Tu es un expert SEO.

${context}

Crée 20 titres très cliquables.

Répond uniquement en français.

`;

                break;

            case "description":

                prompt = `

Tu es un expert YouTube.

${context}

Crée :

- une description optimisée

- une liste de hashtags

- un appel à l'action

Répond uniquement en français.

`;

                break;

            case "planner":

                prompt = `

Tu es une API.

Tu dois répondre UNIQUEMENT avec un JSON valide.

Tu ne dois écrire AUCUNE explication.

Tu ne dois PAS écrire de markdown.

Tu ne dois PAS écrire de texte avant ou après.

Le format attendu est exactement :

[
{
"jour":1,
"titre":"...",
"heure":"18:00",
"objectif":"..."
}
]

Crée exactement 30 objets.

Chaque objet représente une journée.

Les titres doivent être variés.

Utilise les informations suivantes :

${context}

`;

                break;

            case "complete":

                prompt = `

Tu es Empire AI.

${context}

Prépare :

1. Dix idées

2. Vingt titres

3. Vingt hooks

4. Un script

5. Les plans de caméra

6. Une description

7. Les hashtags

8. Un calendrier

Répond uniquement en français.

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

                    temperature: 0.7,

                    max_tokens: 3000,

                    messages: [

                        {

                            role: "system",

                            content:

                            "Tu es Empire AI, un assistant spécialisé dans la création de contenu."

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

            console.error(data);

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

        let result = data.choices[0].message.content;

        /* ==========================================
           Nettoyage de la réponse JSON
        ========================================== */

        if (mode === "planner") {

            result = result.trim();

            if (result.startsWith("```json")) {

                result = result
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            }

            else if (result.startsWith("```")) {

                result = result
                    .replace(/```/g, "")
                    .trim();

            }

        }

        return res.status(200).json({

            result

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            error: "Impossible de contacter l'IA."

        });

    }

}
