const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { YoutubeTranscript } = require("youtube-transcript");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;
app.post("/summarize", async (req, res) => {
    const { videoUrl } = req.body;
    const videoId = extractVideoId(videoUrl);
    if (!videoId) 
        return res.status(400).json({ error: "Invalid YouTube URL" });
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        const transcriptText = transcript.map(t => t.text).join(" ");
        const prompt = `Summarize the following YouTube transcript:\n\n${transcriptText}`;
        const summary = await callGeminiAPI(prompt);
        if (!summary) throw new Error("No summary returned");
        res.json({ summary });
    } 
    catch (err) {
        console.error("❌ Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

function extractVideoId(url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
}

async function callGeminiAPI(prompt) {
    const apiKey = "AIzaSyCDhOhrPPTPUQ8OHQXAI1qB5VAeB3iJpE0"; 
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCDhOhrPPTPUQ8OHQXAI1qB5VAeB3iJpE0`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
        }),
    });
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text;
}

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});