"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function extractBloodPressure(formData: FormData) {
    try {
        const file = formData.get("image") as File;
        if (!file) throw new Error("No file uploaded");

        const arrayBuffer = await file.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");

        // Using gemini-2.5-flash-lite as it currently offers the best free-tier availability.
        const modelName = "gemini-2.5-flash-lite";
        const model = genAI.getGenerativeModel({ 
            model: modelName, 
            generationConfig: { 
                responseMimeType: "application/json" 
            }
        });

        const prompt = `
            Analyze this blood pressure monitor screen. 
            Extract:
            1. Systolic (SYS)
            2. Diastolic (DIA)
            3. Pulse (Heart Rate)
            
            Return a JSON object: {"systolic": number, "diastolic": number, "pulse": number}
        `;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Image, mimeType: file.type || "image/jpeg" } },
        ]);

        const response = await result.response;
        const text = response.text();
        return JSON.parse(text);

    } catch (error: any) {
        console.error("API ERROR:", error.message || error);
        
        // Specific check for the quota error you received earlier
        if (error.message?.includes("429") || error.message?.includes("limit: 0")) {
            return { 
                error: "Your API project has 0 quota for this model. Please check your Google AI Studio project or link a billing account to activate the standard free tier." 
            };
        }
        
        return { error: error.message || "Failed to extract data" };
    }
}