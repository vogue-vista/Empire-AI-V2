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
${context}
`;
                break;

            case "complete":
                prompt = `
Tu es Empire AI.

${context}

Génère un pack complet :
- 10 idées de vidéos
- 20 titres
- 20 hooks
- Script complet
- Plans de caméra
- Description
- Hashtags
- Calendrier résumé 30 jours

Répond uniquement en français.
`;
                break;

            case "viral":
                prompt = `
Tu es un expert viral.

${context}

Contenu à analyser :
${contenu}

Analyse :
1. Potentiel viral
2. Angles puissants
3. Formats recommandés
4. Erreurs à éviter
5. Score sur 10

Répond uniquement en français.
`;
                break;

            default:
                prompt = `
Tu es Empire AI.

${context}

Génère un contenu utile.
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
                        { role: "system", content: "Tu es Empire AI." },
                        { role: "user", content: prompt }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error?.message || "Erreur API Groq." },
                { status: response.status }
            );
        }

        let result = data.choices[0].message.content;

        if (mode === "planner") {
            result = result.replace(/```json/g, "").replace(/```/g, "").trim();
        }

        return NextResponse.json({ result });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}
