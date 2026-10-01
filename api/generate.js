module.exports = async function handler(req, res) {
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
    } = req.body || {};

    let prompt = "";

    switch (mode) {
      case "planner":
        prompt = `
Crée un calendrier de contenu de 30 jours.

Sujet : ${theme}
Plateforme : ${platform}
Public : ${audience}
Objectif : ${goal}

Réponds en JSON.
`;
        break;

      case "viral":
        prompt = `
Analyse ce contenu :

${contenu}

Donne :
- les points forts
- les points faibles
- une note sur 10
- des améliorations
`;
        break;

      default:
        prompt = `
Sujet : ${theme}
Plateforme : ${platform}
Public : ${audience}
Objectif : ${goal}
Durée : ${duration}
Style : ${style}

Crée du contenu complet et détaillé.
`;
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "
