export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: "Generate a single fascinating philosophical fact or quote. Keep it under 150 characters. Focus on ancient to modern philosophy."
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            const fact = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ fact });
        } else {
            return res.status(500).json({ error: 'No content generated' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to generate fact' });
    }
}
