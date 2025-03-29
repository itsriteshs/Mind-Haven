require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
    try {
        console.log('Received request:', req.body.entries);
        const entriesText = req.body.entries;
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a supportive mental health professional. Analyze the journal entries chronologically and speak directly to the user about their progress. Focus on their journey from their first entry to their most recent, highlighting improvements and offering personalized advice. Use a warm, encouraging tone and address the user directly using 'you' and 'your'."
                    },
                    {
                        role: "user",
                        content: `Here are the journal entries in chronological order from oldest to newest. Please analyze the progression and provide direct, personal feedback:\n\n${entriesText}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        console.log('OpenAI Response:', data);
        res.json({ analysis: data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to analyze entries' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 