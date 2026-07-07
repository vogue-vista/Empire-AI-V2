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

Pour chaque idée :

- Titre
- Pourquoi elle peut fonctionner
- Niveau de viralité (/10)

Répond en français.
`;

                break;

            case "script":

                prompt = `
Tu es un scénariste professionnel.

${context}

Écris un script complet.

Le script doit contenir :

🪝 Hook

🎬 Introduction

📖 Développement

🔥 Moment fort

🎯 Conclusion

📢 Appel à l'action

Ajoute également :

🎥 Les plans de caméra.

Sois naturel.
`;

                break;

            case "hook":

                prompt = `
Tu es expert en rétention d'audience.

${context}

Crée 20 hooks extrêmement puissants.

Ils doivent donner envie de regarder la vidéo.

Répond en français.
`;

                break;

            case "title":

                prompt = `
Tu es expert SEO.

${context}

Crée 20 titres.

Les titres doivent être :

- modernes
- courts
- très cliquables
- optimisés pour ${platform}

Numérote-les.
`;

                break;

            case "description":

                prompt = `
Tu es expert YouTube.

${context}

Crée :

📄 Une description optimisée.

🏷 Des hashtags.

📢 Un appel à l'action.

😊 Quelques emojis.

Répond en français.
`;

                break;

            case "planner":

                prompt = `
Tu es coach en création de contenu.

${context}

Prépare un calendrier de publication sur 30 jours.

Pour chaque publication indique :

📅 Jour

🎬 Sujet

🎯 Objectif

🕒 Heure idéale

🎥 Type de contenu

Présente le résultat sous forme de tableau.
`;

                break;

            case "complete":

                prompt = `
Tu es Empire AI.

${context}

Prépare un dossier complet.

=========================

1️⃣ 10 idées de vidéos

=========================

2️⃣ 20 titres

=========================

3️⃣ 20 hooks

=========================

4️⃣ Script complet

=========================

5️⃣ Plans de caméra

=========================

6️⃣ Description optimisée

=========================

7️⃣ Hashtags

=========================

8️⃣ Calendrier de publication

=========================

Tout doit être très professionnel.

Utilise des emojis.

Sépare clairement chaque section.
`;

                break;

            default:

                prompt = `
${context}

Aide le créateur de contenu.
`;

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
                                "Tu es Empire AI, un assistant professionnel spécialisé dans la création de contenu YouTube, TikTok, Instagram et les réseaux sociaux."
                        },

                        {
                            role: "user",
                            content: prompt
                        }

                    ]

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            console.log(data);

            return res.status(response.status).json({

                error: data.error?.message || "Erreur de l'API."

            });

        }

        return res.status(200).json({

            result: data.choices[0].message.content

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            error: "Impossible de contacter l'IA."

        });

    }

}
