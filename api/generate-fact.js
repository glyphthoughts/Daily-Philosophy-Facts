export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { dateString } = await req.json();
  
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          role: "system",
          parts: [{
            text: "You are a philosophy fact generator. Generate only fascinating, educational philosophy facts. Keep responses under 40 words. Focus on historical events, biographical details, and interesting trivia about philosophers and philosophical movements. Be accurate and engaging."
          }]
        },
        contents: [{
          role: "user", 
          parts: [{
            text: `Generate one fascinating philosophy fact for ${dateString}. Example: "Aristotle tutored Alexander the Great when he was just 13 years old, shaping one of history's greatest conquerors."`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      text: data.candidates[0].content.parts[0].text.replace(/"/g, ''),
      author: "Philosophy History",
      isError: false
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      text: "Unable to connect to philosophy database. Please check your internet connection and try again.",
      author: "Connection Error", 
      isError: true
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
