# MISSION CONTROL: Project "Kisan Saathi" (GenAI Agritech PWA)

## Domain Knowledge & Business Logic

**The Problem:**
35% of Indian crop yields are lost to pests and disease. Farmers typically rely on chemical vendors with conflicts of interest, which leads to soil degradation and unsustainable practices.

**The Solution:**
"Kisan Saathi" is a mobile-first web app designed as an AI-powered farming companion for smallholder Indian farmers. A farmer snaps a photo of a diseased crop (e.g., a tomato leaf with Early Blight) to receive expert agronomist guidance.

**The AI Engine:**
Powered by Google Genkit + Gemini APIs. The AI will act as an expert agronomist. It analyzes the given image and outputs a strict JSON response containing:
- Disease Name
- Severity
- Organic Remediation Plan
- Chemical Remediation Plan

**Cost Constraint (BYOK):**
This application operates on a "Bring Your Own Key" (BYOK) model to ensure zero backend server costs. Users will enter their personal Gemini API key in the UI, which will be securely saved locally to the browser's `localStorage`.
