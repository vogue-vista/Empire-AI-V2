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
      mode,
      contenu
    } = req.body;

    const context = `
Sujet : ${theme || "(non défini)"}
Plateforme : ${platform || ""}
Public cible : ${audience || ""}
Objectif : ${goal || ""}
Durée : ${duration || ""}
Style : ${style || ""}
`;

    let prompt = "";

    switch (mode) {
      case "planner":
        prompt = `
Tu es une API.

Réponds uniquement avec un JSON valide.

Format :

[
  {
    "jour": 1,
    "titre": "Titre",
    "heure": "18:00",
    "objectif": "Objectif"
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

Prépare :

1. 10 idées de vidéos
2. 20 titres
3. 20 hooks
4. Un script complet
5. Les plans caméra
6. Une description
7. Des hashtags
8. Un calendrier sur 30 jours

Réponds en français.
`;
        break;

      case "viral":
        prompt = `
Tu es un expert du contenu viral.

${context}

Contenu :

${contenu}

Analyse :
- Forces
- Faiblesses
- Score sur 10
- Améliorations
`;
        break;

      default:
        prompt = `
${context}

Génère du contenu utile.
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
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
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
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("GROQ ERROR :", data);

      return res.status(response.status).json({
        error: data.error?.message || "Erreur Groq"
      });
    }

    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || ""
    });
  } catch (error) {
    console.error("ERROR :", error);

    return res.status(500).json({
      error: error.message || "Impossible de contacter l'IA"
    });
  }
}
