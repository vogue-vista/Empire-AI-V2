export default async function handler(req, res) {

    // =========================
    // MÉTHODE HTTP
    // =========================
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Méthode non autorisée."
        });
    }

    try {
        // =========================
        // RÉCUPÉRATION DES DONNÉES
        // =========================
        const {
            theme,
            platform,
            audience,
            goal,
            duration,
            style,
            mode
        } = req.body;

        if (!theme || theme.trim() === "") {
            return res.status(400).json({
                error: "Le sujet est obligatoire."
            });
        }

        const context = `
Sujet : ${theme}
Plateforme : ${platform}
Public cible : ${audience}
Objectif : ${goal}
Durée : ${duration}
Style : ${style}
`;

        // =========================
        // CONSTRUCTION DU PROMPT
        // =========================
        let prompt = "";

        switch (mode) {

            // -------------------------
            // PLANIFICATEUR IA (JSON)
            // -------------------------
            case "planner":
                prompt = `
Tu es une API.
Tu dois répondre UNIQUEMENT avec un JSON valide.
Tu ne dois écrire AUCUNE explication.
Tu ne dois PAS écrire de markdown.
Tu ne dois PAS écrire de texte avant ou après.

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
Chaque objet représente une journée.

Les titres doivent être variés et cohérents avec :
${context}

Les heures doivent être au format HH:MM (ex : "18:00").
Les objectifs doivent être variés (engagement, vues, abonnés, ventes, etc.).
`;
                break;

            // -------------------------
            // GÉNÉRATION COMPLÈTE
            // -------------------------
            case "complete":
                prompt = `
Tu es Empire AI, un assistant spécialisé dans la création de contenu.

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

            // -------------------------
            // ANALYSE VIRALE
            // -------------------------
            case "viral":
                prompt = `
Tu es un expert des contenus viraux sur ${platform}.

${context}

Analyse le potentiel viral du sujet et propose :

1. Une analyse détaillée (pourquoi ce sujet peut être viral ou non)
2. Les angles de contenu les plus puissants
3. Les formats recommandés (shorts, long format, série, etc.)
4. Les erreurs à éviter
5. Un score de viralité sur 10 avec explication

Répond uniquement en français.
`;
                break;

            // -------------------------
            // PAR DÉFAUT
            // -------------------------
            default:
                prompt = `
Tu es Empire AI.

${context}

Génère un contenu utile en fonction de ces informations.
Répond uniquement en français.
`;
        }

        // =========================
        // APPEL À L'API GROQ
        // =========================
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

        // =========================
        // GESTION DES ERREURS API
        // =========================
        if (!response.ok) {
            console.error(data);
            return res.status(response.status).json({
                error: data.error?.message || "Erreur de l'API."
            });
        }

        if (
            !data.choices ||
            !data.choices[0] ||
            !data.choices[0].message
        ) {
            return res.status(500).json({
                error: "Réponse invalide de l'IA."
            });
        }

        let result = data.choices[0].message.content;

        // =========================
        // NETTOYAGE JSON (PLANNER)
        // =========================
        if (mode === "planner") {

            result = result.trim();

            if (result.startsWith("```json")) {
                result = result
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();
            }
            else if (result.startsWith("```")) {
                result = result
                    .replace(/```/g, "")
                    .trim();
            }
        }

        // =========================
        // RÉPONSE FINALE
        // =========================
        return res.status(200).json({
            result
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Impossible de contacter l'IA."
        });
    }
}
