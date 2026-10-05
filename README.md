# VideoDrop

VideoDrop is a React and TypeScript YouTube metadata viewer and provider-powered downloader. Netlify Functions serve the API in production; the local Express server uses the same handlers.

## Downloader setup (required for real downloads)

Set `VIDEO_DOWNLOADER_URL` in the site's Netlify environment to the HTTPS root endpoint of a self-hosted Cobalt instance, or an instance whose owner explicitly permits this integration. Redeploy after configuring it. Do not expose this setting through a `VITE_` variable.

The instance must support Cobalt's current `POST /` JSON API, allow server-to-server requests without an interactive challenge or authentication, support YouTube, and return a `tunnel` or `redirect` response. Use an instance intended for this integration, not a protected public endpoint. This adapter does not provision or host Cobalt, supply account credentials, or defeat provider access controls. Cobalt's official setup and API references are in `imputnet/cobalt` under `docs/run-an-instance.md` and `docs/api.md`.

Without this setting, analysis remains available, but download requests return a clear configuration error. The app never substitutes fabricated media files. An actual provider endpoint was not included with this project, so configuring and testing a live instance is a deployment prerequisite.

## Download behavior

Paste a YouTube watch, short, live, embed, or `youtu.be` link, or an 11-character video ID. The site retrieves live title and creator information from YouTube oEmbed where available. Missing metadata does not block a download attempt. Unknown duration, file size, view count, and upload date are not invented.

Choose best available MP4 video, a requested resolution from 144p to 4320p, or MP3 audio from 8 to 320 kbps. These are requested output preferences rather than an extracted inventory of available streams. The provider and source determine actual quality, container, and size. In particular, selecting a higher bitrate does not improve the original audio quality.

The API waits for the provider to return a media link and then displays a download action. Files transfer directly from the provider rather than through Netlify's function response. Browsers may open cross-origin media in a new tab instead of honoring the download filename; use the browser's Save option in that case. Provider links may expire, requiring a new request.

VideoDrop adds no download-count quota, artificial format locks, or confirmation gate. Private videos, DRM, authentication requirements, removed media, provider rate limits, and unavailable source formats can still prevent downloads. Download only content you have permission to save. No service can guarantee access to every video.

## API

| Method | Path | Behavior |
| --- | --- | --- |
| POST | `/api/analyze` | Accepts `{ "url": "YouTube link or ID" }`; returns metadata and requested output choices. |
| POST | `/api/download` | Accepts `videoId`, `videoTitle`, and `formatId`; returns a ready download descriptor or a genuine provider error. |
| GET | `/api/health` | Returns API health and whether a downloader endpoint is configured; does not verify provider connectivity. |

Format IDs are `video-max`, `video-1080` (and the other listed resolutions), or `audio-320` (and the other listed bitrates). Format type, container, and quality are resolved by the server rather than trusted from the client.

Requests are stateless: no persistent job queue, media cache, download history, or database is needed. Submitted links are sent to YouTube and the configured provider; provider and hosting-platform logging policies apply. API responses are not cached. Input validation, payload limits, HTTPS link checks, and timeouts remain enabled.

## Development

Use Node.js 22 and install the dependencies with `bun install` using the committed lockfile. Start the Netlify development server with:

```sh
netlify dev --port 8889
```

For local Express-only development, use `npm run dev`. Configure the downloader environment variable in your shell before starting the server. Run `npm run lint` for TypeScript validation.

Netlify serves the frontend from `dist` and deploys the function in `netlify/functions/video-api.mts` at `/api/*`. The API paths return JSON errors rather than silently falling back to the SPA or a mock provider.
