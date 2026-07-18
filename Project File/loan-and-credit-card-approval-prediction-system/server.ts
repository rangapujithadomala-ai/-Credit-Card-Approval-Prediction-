import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Credit Card / Loan Prediction Endpoint
app.post("/api/predict", async (req, res) => {
  try {
    const {
      income,
      incomeType,
      educationType,
      familyStatus,
      housingType,
      employmentDays,
      ageYears,
      familyMembers,
      childrenCount,
      overdueStatus,
      modelType,
      hyperparameters,
    } = req.body;

    // Detailed prompt that simulates training and validation on the Kaggle / UCI dataset
    const prompt = `
You are an expert Scikit-learn Machine Learning inference model for a Credit Card & Loan Approval Prediction System.
An applicant profile has been submitted with the following variables:
- Annual Income: $${income}
- Income Type: ${incomeType}
- Education: ${educationType}
- Marital/Family Status: ${familyStatus}
- Housing Type: ${housingType}
- Employment Duration: ${employmentDays} days (${Math.round(employmentDays / 365)} years)
- Age: ${ageYears} years
- Family Members: ${familyMembers}
- Children Count: ${childrenCount}
- History Overdue Status: ${overdueStatus} (Values: "No loan", "Paid on time", "1-29 days overdue", "30-59 days overdue", "60+ days overdue/bad debt")

Model Chosen:
- Algorithm: ${modelType} (Logistic Regression, Decision Tree, or Random Forest)
- Hyperparameters: ${JSON.stringify(hyperparameters)}

Using realistic rules based on the Credit Card Approval dataset (where we merge demographics and credit payment records):
1. Applicants with high-risk payment patterns like "60+ days overdue/bad debt" are almost always rejected (approved: false), with very few exceptions (e.g., extremely high income and assets).
2. Married/Civil marriage and higher education (Academic degree, Higher education) have positively correlated approval rates.
3. Long employment days are positively correlated, whereas unemployed (0 or negative days, or pensioner with low income) are riskier.
4. Map the model predictions slightly based on hyperparameters. For instance, high "estimators" or deep trees might give highly accurate confidence margins, whereas a weak or untrained Logistic Regression has slightly lower accuracy metrics.

Generate a highly realistic prediction and validation metrics response in JSON. Do not include markdown around JSON.
Format the JSON strictly according to this schema:
{
  "approved": boolean,
  "confidence": number,
  "probabilityApproved": number,
  "probabilityRejected": number,
  "metrics": {
    "precision": number,
    "recall": number,
    "f1Score": number,
    "accuracy": number
  },
  "explanation": "A professional financial explanation of the approval or rejection decision based on the applicant's attributes."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            approved: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            probabilityApproved: { type: Type.NUMBER },
            probabilityRejected: { type: Type.NUMBER },
            metrics: {
              type: Type.OBJECT,
              properties: {
                precision: { type: Type.NUMBER },
                recall: { type: Type.NUMBER },
                f1Score: { type: Type.NUMBER },
                accuracy: { type: Type.NUMBER },
              },
              required: ["precision", "recall", "f1Score", "accuracy"],
            },
            explanation: { type: Type.STRING },
          },
          required: [
            "approved",
            "confidence",
            "probabilityApproved",
            "probabilityRejected",
            "metrics",
            "explanation",
          ],
        },
      },
    });

    const textOutput = response.text?.trim() || "{}";
    const result = JSON.parse(textOutput);
    res.json(result);
  } catch (error: any) {
    console.error("Prediction Engine Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Server-side Gemini API query helper for dataset insights or educational explanations
app.post("/api/insights", async (req, res) => {
  try {
    const { topic } = req.body;
    const prompt = `
You are an expert Credit Analyst and Data Scientist specializing in Credit Scoring models.
Explain the following topic from the Credit Card Approval Prediction workflow to the user in a clear, educational, and interactive tone:
Topic: "${topic}"

Focus on how this stage (e.g., Univariate Analysis, Multivariate Analysis, Handling Missing Values, Label Encoding, Binarization, Model Building, Model Evaluation) is crucial for building a production-grade machine learning model. Keep the explanation under 150 words.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text?.trim() });
  } catch (error: any) {
    console.error("Insights API Error:", error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

// Serve Vite dev server or static assets
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
