# VideoDrop — Simple, Fast, Secure Video Downloader

A modern, responsive YouTube video metadata analyzer and authorized downloader web application built with React, Vite, Tailwind CSS, TypeScript, and Express.

Designed with a premium SaaS interface, strict accessibility (WCAG AA), zero-slop typography, dark mode persistence, and legal compliance safeguards.

---

## 1. Overview & Core Features

- **Intuitive Video Analysis**: Paste any supported YouTube URL (`watch?v=...`, `youtu.be/...`, shorts, embeds).
- **Public & Authorized Metadata Retrieval**: Integrated with YouTube's public oEmbed API for real creator names, titles, and thumbnails, with automatic fallback to high-fidelity mock fixtures for offline testing.
- **Multi-Format Extraction**:
  - **Video (MP4)**: 1080p Full HD, 720p HD, 480p, and 360p with estimated file sizes, bitrate, and codecs.
  - **Audio (MP3 / M4A)**: High-resolution MP3 (320 kbps) and AAC-LC M4A (128 kbps).
- **Real Backend Download Progress**: Progress bar driven by backend polling (`/api/download/status/:jobId`), followed by a prominent `Download MP4` action that serves an actual file.
- **DRM & Legal Compliance**: Does not bypass DRM, encryption, or private video authentication. Clear notices for restricted media.
- **Security & Privacy**:
  - Sliding-window IP rate limiting (60 requests/minute).
  - Strict input validation and URL sanitization on both client and server.
  - Automated volatile file cleanup after 15 minutes.
  - Zero permanent database storage of submitted user URLs.
- **Obsidian Dark & Light Modes**: Default `#0B0F14` canvas, `#121821` cards, with instant toggle and `localStorage` persistence.

---

## 2. Project Architecture

```
youtube-downloader/
├── src/
│   ├── assets/              # Generated visual assets
│   ├── components/
│   │   ├── Navbar.tsx             # 3-Zone Top Bar with mobile menu
│   │   ├── Hero.tsx               # Hero banner with balance text & samples
│   │   ├── UrlInput.tsx           # Accessible URL input with clipboard paste
│   │   ├── VideoResult.tsx        # Video metadata display card
│   │   ├── VideoThumbnail.tsx     # Resilient image with duration stamp
│   │   ├── FormatSelector.tsx     # Segmented video/audio tabs and format rows
│   │   ├── DownloadProgressModal.tsx # Real backend progress & download trigger
│   │   ├── ProgressBar.tsx        # Animated progress bar
│   │   ├── LoadingSkeleton.tsx    # Multi-line skeleton with analysis steps
│   │   ├── ErrorMessage.tsx       # Domain-specific error banners
│   │   ├── HowItWorks.tsx         # 3-step workflow
│   │   ├── FeatureCard.tsx        # 6 core feature highlights
│   │   ├── FAQ.tsx                # Accessible accordion FAQ
│   │   ├── Footer.tsx             # Quiet footer with compliance trigger
│   │   ├── ThemeToggle.tsx        # Dark/light theme switch
│   │   └── ComplianceModal.tsx    # Legal terms, DMCA, and API documentation
│   ├── hooks/
│   │   ├── useTheme.ts            # Persistent dark/light mode hook
│   │   └── useVideoDownloader.ts  # Download job state & polling orchestrator
│   ├── services/
│   │   ├── api.ts                 # Base API config
│   │   ├── videoService.ts        # Client video service abstraction
│   │   └── mockProvider.ts        # Mock provider fixture dataset
│   ├── utils/
│   │   ├── formatters.ts          # Duration, views, and file size formatters
│   │   └── validators.ts          # YouTube URL parsing and validation
│   ├── types/
│   │   └── index.ts               # Shared TypeScript interfaces
│   ├── App.tsx                    # Root application component
│   ├── main.tsx                   # React DOM entry point
│   └── index.css                  # Tailwind CSS v4 styling & CSS variables
├── server/
│   ├── controllers/
│   │   └── videoController.ts     # Express controller for analyze & download
│   ├── middleware/
│   │   └── rateLimiter.ts         # Sliding-window IP rate limiter
│   ├── routes/
│   │   └── videoRoutes.ts         # API route definitions (/api/*)
│   └── services/
│       ├── videoService.ts        # Server-side oEmbed & format engine
│       └── downloadJobManager.ts  # Job queue, progress updater & file generator
├── server.ts                      # Full-stack server (Express + Vite middlewares)
├── .env.example                   # Environment configuration template
├── package.json                   # Dependencies and npm scripts
└── README.md
```

---

## 3. Installation & Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Setup Steps

1. Clone or download the repository:
   ```bash
   cd react-example
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 4. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the full-stack server (`server.ts`) with Express and Vite middleware on port 3000. |
| `npm run build` | Compiles client assets into the production `dist/` directory. |
| `npm run start` | Starts the production server serving built static assets from `dist/`. |
| `npm run lint` | Runs TypeScript type verification (`tsc --noEmit`). |

---

## 5. API Endpoints

All API endpoints are prefixed with `/api`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/analyze` | Validates YouTube URL and returns video metadata, thumbnail, duration, and authorized formats. |
| `POST` | `/api/download` | Initiates a download preparation job on the backend. |
| `GET` | `/api/download/status/:jobId` | Polls progress (0–100%) and retrieval status for an active job. |
| `GET` | `/api/download/file/:jobId` | Serves the prepared media file with `Content-Disposition: attachment`. |
| `GET` | `/api/health` | Health check endpoint returning uptime and service status. |

---

## 6. Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port on which the Express server listens. |
| `NODE_ENV` | `development` | Set to `production` for static file serving. |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Sliding window duration in milliseconds (default: 1 min). |
| `RATE_LIMIT_MAX_REQUESTS`| `60` | Max requests permitted per IP within the window. |
| `VIDEO_PROVIDER_MODE` | `mock` | `mock` or `authorized_live`. |

---

## 7. Security & Compliance Principles

1. **No Client-Side Secrets**: API keys, credentials, and internal worker IDs are strictly isolated to the server environment.
2. **Abuse Mitigation**: Sliding window rate-limiting restricts spamming and automated abuse.
3. **Data Minimization**: Analyzed URLs are processed in transient memory; user links are not stored in any database.
4. **No Circumvention**: In accordance with YouTube's Terms of Service and applicable intellectual property laws, the system does not bypass DRM or private access controls.

---

## 8. Deploying to Netlify

VideoDrop comes pre-configured with `netlify.toml` and `public/_redirects` for instant deployment to Netlify.

### Option A: Deploy via GitHub / GitLab / Bitbucket (Recommended)

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Netlify](https://app.netlify.com/) and click **"Add new site"** > **"Import an existing project"**.
3. Select your repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Deploy VideoDrop"**.
6. Your site will be live on an SSL-enabled `.netlify.app` subdomain within 60 seconds!

### Option B: Deploy via Netlify CLI

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```
2. Build the production package:
   ```bash
   npm run build
   ```
3. Deploy directly:
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Option C: Drag and Drop (Manual)

1. Run `npm run build` in your local terminal.
2. Open [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the generated `dist` folder directly onto the page.

### How Netlify Routing Works
- **SPA Fallback**: Handled via `netlify.toml` and `public/_redirects` (`/*  /index.html  200`).
- **Client-Side Metadata Retrieval**: When deployed on static Netlify hosting, VideoDrop automatically connects to YouTube's official CORS-enabled oEmbed endpoint to retrieve live creator data, thumbnails, and durations, while providing in-browser media stream compilation with full progress reporting.

