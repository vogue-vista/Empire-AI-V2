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

    const prompt = `
Sujet : ${theme || ""}
Plateforme : ${platform || ""}
Public : ${audience || ""}
Objectif : ${goal || ""}
Durée : ${duration || ""}
Style : ${style || ""}
Mode : ${mode || ""}
Contenu : ${contenu || ""}
`;

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
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("GROQ ERROR:", data);

      return res.status(response.status).json({
        error: data.error?.message || "Erreur Groq"
      });
    }

    return res.status(200).json({
      result: data.choices[0].message.content
    });

  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      error: error.message
    });
  }
};
