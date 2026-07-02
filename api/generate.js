export default async function handler(req, res) {

  try {

    const { theme } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `Donne une idée de vidéo YouTube sur : ${theme}`
          }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json({
      result: data.choices?.[0]?.message?.content || "Erreur IA"
    });

  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }

}
