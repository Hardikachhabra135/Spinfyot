<div align="center">
  <img src="public/assets/logo/spinfyot-logo-transparent.png" alt="Spinfyot Logo" width="300" />
  
  <h3>Guiding your global education journey with precision and care.</h3>
</div>

---

**Spinfyot** is a premium, high-performance web application designed for an international study-abroad consultancy. Built with a focus on deep aesthetics, fluid animations, and a seamless user experience.

## ? Key Features

- **Premium UI/UX:** A deep space/dark-mode inspired design system with glowing accents, glassmorphism, and a highly polished aesthetic.
- **Fluid Animations:** Powered by `framer-motion` for buttery smooth parallax scrolling, majestic flight animations, and orchestrated page transitions.
- **Smooth Scrolling:** Integrated with `@studio-freight/lenis` for a luxurious, physics-based scroll experience across all devices.
- **Responsive Architecture:** Fully responsive layouts utilizing CSS Grid and Flexbox via Tailwind CSS.
- **Dynamic Content:** A dedicated bento-box footer, beautifully structured testimonial carousels with student avatars, and dynamic service pages.
- **Modern Tech Stack:** Fast development and optimized builds powered by React and Vite.

## ??? Tech Stack

- **Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Scroll Engine:** [Lenis](https://lenis.studiofreight.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/)

## ?? Project Structure

The project follows a highly modular, component-driven architecture:

```text
src/
+-- assets/        # Static assets (images, logos)
+-- components/    # Reusable React components
�   +-- layout/    # Global layout wrappers (Header, Footer)
�   +-- sections/  # Major page sections (Hero, Services, AboutUs, Testimonials)
�   +-- ui/        # Micro-components (Buttons, Modals, FoldText)
+-- data/          # Local JSON/JS data files (Services, Testimonials)
+-- hooks/         # Custom React hooks
+-- pages/         # Route components (Home, Blog, Contact, ServiceDetail)
+-- styles/        # Global CSS and Tailwind configuration
```

## ?? Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iamritikarsh/SPINFYOT.git
   cd SPINFYOT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## ⏱️ Uptime Monitoring

Spinfyot includes a built-in lightweight uptime monitor for the production environment. It continuously pings the deployed Frontend, Admin Panel, and Backend API Health endpoints to ensure they are online and responding correctly.

**How it works:**
- The monitor script (`BACKEND/scripts/uptimeMonitor.js`) pings the services at a configured interval (default: 5 minutes).
- If a service fails to respond with a successful HTTP status code, it retries after 30 seconds to prevent false positives.
- If it fails again, it automatically sends an email alert to the configured admin email address.
- When the service recovers, a recovery email is sent.

**How to configure & run:**
1. Navigate to the `BACKEND` directory and ensure your `.env` has the monitoring variables set:
   ```env
   MONITOR_INTERVAL_MS=300000
   MONITOR_ALERT_EMAIL=admin@example.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```
2. Start the monitor in the background (e.g., using PM2 on a server):
   ```bash
   cd BACKEND
   node scripts/uptimeMonitor.js
   ```
   *Note: If you are using a free tier hosting service that sleeps (like Render free tier), run this script on a separate always-on machine (or locally) to keep the servers awake and monitored.*

## ?? Design Philosophy

Spinfyot completely avoids "cheap" elements like harsh borders or excessive emojis. Instead, it relies on:
- High-contrast typography
- Deep, seamless blending background gradients (`#050B14` to `#000000`)
- Advanced SVG animations (e.g., looping airplane flight paths)
- Premium Specular buttons with dynamic hover states

---
<div align="center">
  <em>Built with precision and care.</em>
</div>
