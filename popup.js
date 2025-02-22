const apiKey = "AIzaSyDL0qbrR1GOJsH-EC_a12wXDV6cViwLRQ8";

document.getElementById("generate-btn").addEventListener("click", async () => {
    document.getElementById("response").innerText = "📸 Mengambil Screenshot...";
    
    
    chrome.tabs.captureVisibleTab(null, { format: "png" }, async (imageUri) => {
        document.getElementById("response").innerText = "🔄 Memproses Gambar...";
        
        
        const extractedText = await extractTextFromImage(imageUri);
        if (!extractedText) {
            document.getElementById("response").innerText = "❌ Gagal membaca teks dari gambar!";
            return;
        }

        document.getElementById("response").innerText = "🤖 Menjawab dengan AI...";
        
       
        const answer = await getAiResponse(extractedText);
        document.getElementById("response").innerText = "✅ Jawaban: " + answer;
    });
});

async function extractTextFromImage(imageUri) {
    const base64Data = imageUri.replace(/^data:image\/(png|jpeg);base64,/, "");

    const formData = new FormData();
    formData.append("base64Image", "data:image/png;base64," + base64Data);
    formData.append("apikey", "K85779120688957");

    try {
        const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
            method: "POST",
            body: formData
        });

        const data = await ocrResponse.json();
        return data.ParsedResults?.[0]?.ParsedText || "";
    } catch (error) {
        console.error("OCR Error:", error);
        return "";
    }
}

async function getAiResponse(text) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text }] }] })
    });
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "❌ AI tidak memberikan jawaban.";
}

document.getElementById("close-popup").addEventListener("click", () => {
    document.querySelector(".container").style.display = "none";
});
