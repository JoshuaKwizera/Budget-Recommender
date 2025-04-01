require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyCqJ_JAum_uosYDYLU6yYWl0ygjg5neDho"; // Use environment variable for security
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent"; // Corrected URL

app.post('/generate-recommendations', async (req, res) => {
    try {
        const { income, expenses } = req.body;

        console.log("Received:", { income, expenses });

        const promptText = `
            Analyze the following budget data:

            Income: ${JSON.stringify(income)}
            Expenses: ${JSON.stringify(expenses)}

            The expenses represent the user's planned spending.

            Provide specific, actionable recommendations for budget improvement, focusing primarily on expense adjustments.

            1.  **Overall Assessment:** Briefly summarize strengths and weaknesses, considering the user's fixed income.
            2.  **Recommendations (Expense Focused):**
                * Prioritize recommendations that adjust expenses.
                * For each recommendation, provide:
                    * The category of the expense.
                    * The recommended action: "reduce" or "remove".
                    * The amount to adjust by (e.g., 500000, "10%").
                    * A clear and concise explanation for the recommendation.
                * Avoid recommendations to "increase" or "decrease" income or savings, as these are often less flexible.
                * Focus on providing recommendations that are easily actionable.

            **Example Recommendation:**

            "Reduce the 'Clothes' expense by 500000. This category appears to be excessive and reducing it will free up funds for other needs."

            **The main purpose of the recommendations is to enable the users make the budget better and achievable**
            
            **Provide multiple recommendations, if applicable, using the format above.**
            `;

        const response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`, {
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { maxOutputTokens: 1000 }
        });

        console.log("Gemini API Response:", response.data);

        const recommendation = response.data.candidates?.[0]?.content.parts?.[0]?.text || "No recommendation available.";
        console.log(recommendation);

        res.json({ recommendation });
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));