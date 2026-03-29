# Style Rules: Kisan Saathi

## Vibe & Aesthetic
- **Core Theme:** "Dark Minimalist" (`#0a0a0a` background).
- **Materiality:** "Glassmorphism" UI cards (translucent, blurred backgrounds with subtle borders).
- **Target Audience UX:** Extremely accessible elements, relying on large tap targets suitable for rural users in varying lighting conditions. Keep interactive elements visually distinct but cohesive within the dark theme.

## Tech Stack Rules
- **CSS Framework:** Tailwind CSS
- **Icons:** `lucide-react`
- **Animations:** `framer-motion` for smooth micro-animations, loading states, and transitions that make the app feel alive and premium.

## Implementation Guidelines
- **Color Palette:**
  - Background: Strict `#0a0a0a`.
  - Cards/Containers: Translucent glass effect (e.g., `bg-white/5 backdrop-blur-md border border-white/10`).
  - Text: High contrast white/off-white (e.g., `text-zinc-100`, `text-zinc-400` for secondary text).
  - Accents: Vibrant but harmonious (e.g., vivid emerald, neon moss) fitting the agritech domain theme.
- **Typography:**
  - Modern sans-serif via `next/font` (e.g., Inter or Outfit).
  - Large, readable sizes for critical numbers or alerts (e.g., Severity %).
- **Layout & Structure:**
  - Strict App Router patterns (Next.js 14+).
  - Mobile-first approach strictly adhered to.
  - Ensure interactive elements are highly visible for users.
