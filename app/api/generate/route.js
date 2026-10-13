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

    const prompt = `
Sujet : ${theme || ""}
Plateforme : ${platform || ""}
Public cible : ${audience || ""}
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
          model: "llama3-8b-8192",
          temperature: 0.7,
          max_tokens: 2000,
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
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("GROQ ERROR:", data);

      return NextResponse.json(
        {
          error: data.error?.message || "Erreur Groq",
          details: data
        },
        {
          status: response.status
        }
      );
    }

    return NextResponse.json({
      result: data.choices?.[0]?.message?.content || ""
    });

  } catch (error) {
    console.error("ERROR:", error);

    return NextResponse.json(
      {
        error: error.message
      },
      {
        status: 500
      }
    );
  }
}
