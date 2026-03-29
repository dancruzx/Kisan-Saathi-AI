<div align="center">
<pre>
██╗ ██╗██╗███████╗ █████╗ ███╗ ██╗ ███████╗ █████╗ ████████╗██╗
██║ ██╔╝██║██╔════╝██╔══██╗████╗ ██║ ██╔════╝██╔══██╗╚══██╔══╝██║
█████╔╝ ██║███████╗███████║██╔██╗ ██║ █████╗ ███████║ ██║ ██║
██╔═██╗ ██║╚════██║██╔══██║██║╚██╗██║ ██╔══╝ ██╔══██║ ██║ ╚═╝
██║ ██╗██║███████║██║ ██║██║ ╚████║ ███████╗██║ ██║ ██║ ██╗
╚═╝ ╚═╝╚═╝╚══════╝╚═╝ ╚═╝╚═╝ ╚═══╝ ╚══════╝╚═╝ ╚═╝ ╚═╝ ╚═╝
</pre>

# Kisan Saathi AI 🌱

### Your AI Agronomist for the Next Generation of Farming.
**A Generative Reasoning Engine designed to secure the harvest for 150 million smallholder farmers.**

---

<p align="center">
  <img src="https://i.imgur.com/YOUR_APP_DEMO_GIF.gif" alt="Kisan Saathi App Demo" width="300px">
  <br/>
  <em>(Replace this link with a screen recording/GIF of the app in action!)</em>
</p>

</div>

---

## 🔴 The Problem: The Silent Yield Killer

In India, **30-35% of annual crop yields are lost** to pests, weeds, and diseases. For a smallholder farmer, this is not just a statistic; it's a catastrophic financial loss. They lack immediate access to expert agronomists and are often forced to rely on guesswork or advice from chemical vendors who have a clear conflict of interest. This leads to misdiagnosis, over-application of incorrect pesticides, soil degradation, and debt.

## 🟢 The Solution: A Generative Reasoning Engine in Their Pocket

Kisan Saathi is not just another image classifier. It is a **hyper-contextual, voice-first AI agronomist** designed for the hostile, low-bandwidth conditions of rural India. It fuses cutting-edge multimodal AI with real-world environmental data to deliver advice that is not just accurate, but also timely, safe, and cost-effective.

## ✨ Why Kisan Saathi Wins: Core Features

### 1. 🧠 Multimodal Diagnosis (Vision + Voice)
Farmers don't type; they talk. Our "Shazam for Plants" interface allows users to snap a photo while simultaneously providing verbal context in their regional language (e.g., *"My tomato leaves are turning yellow and curling up"*). This fusion of visual and linguistic data provides the AI with unparalleled diagnostic context.

### 2. 🌩️ Contextual Generative Reasoning (The "Mic Drop" Feature)
Our system is **weather-aware**. In the half-second it takes to analyze a crop, it pings satellite weather data for the user's exact GPS coordinates. The AI then dynamically generates advice based on the forecast.
> **Example:** *"I've detected Early Blight. However, heavy rain is expected in your district tomorrow. **Wait 48 hours before applying Copper Fungicide** to prevent chemical runoff and wasted money."*

### 3. 🤖 Voice-First Conversational AI (The "Diagnosis Debrief")
After the initial diagnosis, the farmer can tap a button to "Discuss with AI Agronomist." This opens a context-aware chat interface where they can ask follow-up questions via voice about budgets, alternative solutions, and application techniques, ensuring the digital divide is closed by voice.

### 4. 🌦️ Synthetic Data Hardening (Built for the Real World)
Standard AI datasets contain perfect "lab-condition" photos. Indian fields are muddy, dark, and rainy. We use **Generative AI (Latent Diffusion/GANs)** to synthesize thousands of "edge-case" training images—diseased crops in extreme rain, low-light, and soil-glare conditions—to ensure our vision models achieve **>95% accuracy in the field, not just in theory.** *(See `/research/synthetic-data-samples`)*.

---

## 🛠️ Architecture & Tech Stack

Kisan Saathi operates on a **Stateless Edge-to-Cloud Architecture**, engineered for zero-cost scalability, rural bandwidth constraints, and graceful degradation.

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **UI Design** | 🎨 Google Stitch | AI-powered generation of our premium React/Tailwind UI components. |
| **Frontend** | ⚛️ Next.js 14 (PWA) | A mobile-first Progressive Web App for instant access without app stores. |
| **UX/Animation** | ✨ Framer Motion | Fluid, native-feel animations for an exceptional user experience. |
| **AI Middleware** | 🧠 Google Genkit | Orchestrates AI flows and enforces structured, type-safe JSON outputs with Zod. |
| **AI Models**| 🤖 Gemini 3.1 & Llama 3 | A resilient, multi-model backend with a high-speed Groq fallback to handle API quotas. |
| **Data Layer** | 🛰️ Open-Meteo API | Real-time, zero-auth weather data for contextual reasoning. |
| **Deployment**| 🚀 Vercel | Instant, zero-cost deployment on a global serverless edge network. |

*(For a detailed breakdown of agent roles and error-handling, please see our `ARCHITECTURE.md` file.)*

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18.0 or later)
*   `yarn` or `npm`
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/kisan-saathi.git
cd kisan-saathi
```

### 2. Install Dependencies
```bash
yarn install
# or
npm install
```

### 3. Configure Your API Key (BYOK Model)
This app uses a "Bring Your Own Key" model. You will need a Google AI Studio API key.
When you run the app for the first time, click the Settings ⚙️ icon in the top-right corner. A modal will pop up. Paste your API key there. It will be saved securely to your browser's localStorage and will never be exposed.

### 4. Run the Development Server
```bash
yarn dev
# or
npm run dev
```
Open `http://localhost:3000` in your browser (preferably on a mobile device to test the camera).

---

## 🚀 Deploying on Vercel

The easiest way to deploy Kisan Saathi is via the Vercel Platform.

1.  **Push your code** to a GitHub, GitLab, or Bitbucket repository.
2.  **Import the repository** into [Vercel](https://vercel.com/new).
3.  **Configure Environment Variables**: Add your `GOOGLE_GENAI_API_KEY` to your Vercel project environment settings.
4.  **Deploy**: Click Deploy! Vercel will automatically build and deploy your Next.js application.

---

## 🗺️ Future Roadmap

*   **Soil Health Analysis:** Visual analysis of soil color and texture from an image.
*   **Yield Prediction:** Forecasting potential yield based on crop health over time.
*   **E-Commerce Integration:** A trusted marketplace for AI-recommended, authentic fertilizers and seeds.

---

## 📝 Licensing

This project is licensed under the MIT License.
