document.getElementById("summarizeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const videoUrl = document.getElementById("videoUrl").value.trim();
    const resultDiv = document.getElementById("summaryResult");
    resultDiv.innerHTML = "⏳ Summarizing...";
    try {
        const res = await fetch("http://localhost:3000/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoUrl }),
        });
        const data = await res.json();
        if (data.summary) {
            resultDiv.innerHTML = `<h3>✅ Summary:</h3><p>${data.summary}</p>`;
        } 
        else {
            resultDiv.innerHTML = "⚠️ No summary returned. Check the video URL or try again.";
        }
    } 
    catch (err) {
        console.error("❌ Error:", err);
        resultDiv.innerHTML = "❌ Something went wrong. Please try again.";
    }
});