export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Méthode non autorisée."
        });
    }

    try {

        const { theme, mode } = req.body;

        if (!theme || theme.trim() === "") {
            return res.status(400).json({
                error: "Aucun sujet fourni."
            });
        }

        let prompt = "";

        switch (mode) {

            case "ideas":

                prompt = `
Tu es un expert YouTube.

Sujet :
${theme}

Mission :

- Génère 10 idées de vidéos originales.
- Classe les meilleures en premier.
- Explique en une phrase pourquoi chaque idée peut fonctionner.

Répond uniquement en français.
`;

                break;

            case "script":

                prompt = `
Tu es un scénariste YouTube professionnel.

Écris un script complet sur :

${theme}

Structure :

🪝 Hook

🎬 Introduction

📚 Développement

🔥 Moment fort

🎯 Conclusion

📢 Appel à l'action

Le script doit être naturel et captivant.
`;

                break;

            case "hook":

                prompt = `
Tu es expert en rétention d'audience.

Sujet :

${theme}

Crée 15 hooks très puissants.

Ils doivent immédiatement attirer l'attention.

Chaque hook doit être différent.
`;

                break;

            case "title":

                prompt = `
Tu es expert SEO YouTube.

Sujet :

${theme}

Crée 20 titres.

Les titres doivent :

- donner envie de cliquer
- être courts
- être modernes
- être optimisés pour YouTube

Numérote-les.
`;

                break;

            case "description":

                prompt = `
Tu es expert YouTube.

Sujet :

${theme}

Crée :

- une description professionnelle

- un appel à l'action

- des hashtags

- des emojis
`;

                break;

            case "calendar":

                prompt = `
Tu es coach YouTube.

Sujet :

${theme}

Prépare un calendrier de publication sur 30 jours.

Pour chaque jour indique :

Jour

Titre de la vidéo

Objectif

Format

Présente le résultat proprement.
`;

                break;

            case "complete":

                prompt = `
Tu es le meilleur coach YouTube au monde.

Sujet :

${theme}

Prépare un dossier complet.

======================

# 1. Dix idées de vidéos

======================

# 2. Vingt titres

======================

# 3. Quinze hooks

======================

# 4. Script complet

======================

# 5. Description YouTube

======================

# 6. Hashtags

======================

# 7. Calendrier de publication

Tout doit être très professionnel.

Utilise des emojis.

Sépare bien chaque partie.
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

                    temperature: 0.8,

                    messages: [

                        {

                            role: "system",

                            content:
                                "Tu es Empire AI, un assistant spécialisé dans la création de contenu YouTube, TikTok et Instagram."

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

                error: data.error?.message || "Erreur API"

            });

        }

        return res.status(200).json({

            result: data.choices[0].message.content

        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({

            error: "Erreur serveur"

        });

    }

}
