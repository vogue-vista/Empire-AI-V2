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

    if (mode !== "viral" && (!theme || theme.trim() === "")) {
      return res.status(400).json({
        error: "Le sujet est obligatoire."
      });
    }

    if (mode === "viral" && (!contenu || contenu.trim() === "")) {
      return res.status(400).json({
        error: "Le contenu à analyser est obligatoire."
      });
    }

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

Prépare :

1. 10 idées de vidéos
2. 20 titres accrocheurs
3. 20 hooks puissants
4. Un script complet
5. Les plans caméra
6. Une description optimisée
7. Une liste de hashtags
8. Un calendrier sur 30 jours

Réponds uniquement en français.
`;
        break;

      case "viral":
        prompt = `
Tu es un expert du contenu viral.

${context}

Contenu
