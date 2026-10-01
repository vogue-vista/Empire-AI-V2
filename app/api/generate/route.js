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
