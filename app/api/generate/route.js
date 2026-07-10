import { NextResponse } from "next/server";

export async function POST(req) {

    try {
        const body = await req.json();

        const {
            theme,
            platform,
            audience,
            goal,
            duration,
            style,
            mode,
            contenu
        } = body;

        if (mode !== "viral" && (!theme || theme.trim() === "")) {
            return NextResponse.json({ error: "Le sujet est obligatoire." }, { status: 400 });
        }

        if (mode === "viral" && (!contenu || contenu.trim() === "")) {
            return NextResponse.json({ error: "Le contenu à analyser est obligatoire." }, { status: 400 });
        }

        const context = `
Sujet : ${theme || "(non défini)"}
Plateforme : ${platform}
Public cible : ${audience}
Objectif : ${goal}
Durée : ${duration}
Style : ${style}
`;

        let prompt = "";

        switch (mode) {

            case "planner":
                prompt = `
Tu es une API.
Tu dois répondre UNIQUEMENT avec un JSON valide.
Tu ne dois écrire AUCUNE explication.
Tu ne dois PAS écrire de markdown.

Format attendu :
[
  {
    "jour": 1,
    "titre": "Titre de la vidéo",
    "heure": "18:00",
    "objectif": "Objectif du jour"
  }
]

Crée exactement 30 objets.

Contexte :
${context}
`;
                break;

            case "complete":
                prompt = `
Tu es Empire AI, un assistant spécialisé dans la création de contenu.

Contexte :
${context}

Prépare un pack complet :

1. Dix idées de vidéos (titre + explication)
2. Vingt titres très cliquables
3. Vingt hooks très puissants
4. Un script complet structuré :
   - 🪝 Hook
   - 🎬 Introduction
   - 📖 Développement
   - 🔥 Moment fort
   - 🎯 Conclusion
   - 📢 Appel à l'action
5. Les plans de caméra
6. Une description optimisée
7. Une liste de hashtags
8. Un calendrier résumé sur 30 jours (texte, pas JSON)

Répond uniquement en français.
Mets des titres clairs pour chaque section.
`;
                break;

            case "viral":
                prompt = `
Tu es un expert des contenus viraux sur ${platform}.

Contexte :
${context}

Voici le contenu à analyser :
${contenu}

Analyse le potentiel viral de ce contenu et propose :

1. Une analyse détaillée (pourquoi ce contenu peut être viral ou non)
2. Les angles de contenu les plus puissants
3. Les formats recommandés (shorts, long format, série, etc.)
4. Les erreurs à éviter
5. Un score de viralité sur 10 avec explication

Répond uniquement en français.
`;
                break;

            case "single":
                prompt = `
Tu es Empire AI, un assistant spécialisé dans la création de contenu.

Contexte :
${context}

Génère UNE SEULE idée complète de vidéo, avec la structure suivante :

Titre :
Hook :
Description :
Script complet :
Plans de caméra :
CTA :

Répond uniquement en français.
Mets des titres clairs pour chaque partie.
`;
                break;

            default:
                prompt = `
Tu es Empire AI.

Contexte :
${context}

Génère un contenu utile en fonction de ces informations.
Répond uniquement en français.
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
                    temperature: 0.7,
                    max_tokens: 3000,
                    messages: [
                        {
                            role: "system",
                            content: "Tu es Empire AI, un assistant spécialisé dans la création de contenu."
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
            console.error(data);
            return NextResponse.json(
                { error: data.error?.message || "Erreur de l'API." },
                { status: response.status }
            );
        }

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            return NextResponse.json(
                { error: "Réponse invalide de l'IA." },
                { status: 500 }
            );
        }

        let result = data.choices[0].message.content;

        if (mode === "planner") {
            result = result.trim();
            result = result.replace(/```json/g, "").replace(/```/g, "").trim();
        }

        return NextResponse.json({ result });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { error: "Impossible de contacter l'IA." },
            { status: 500 }
        );
    }
}
