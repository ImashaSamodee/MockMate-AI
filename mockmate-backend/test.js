require('dotenv').config();

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
        } else {
            console.log("✅ ඔයාගේ API Key එකට වැඩ කරන Models ටික මෙන්න:");
            const supportedModels = data.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name);
            console.log(supportedModels);
        }
    } catch (error) {
        console.error("Network Error:", error);
    }
}

checkModels();