<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7ed77867-c04b-4fe3-8518-80a80d5da993

## Deployment

This project is ready to be deployed to **Vercel** or **Cloudflare Pages**.

### Deploying to Vercel (Recommended)

1.  **Push to GitHub**: Push your code to a GitHub repository.
2.  **Import to Vercel**: 
    - Log in to your [Vercel Dashboard](https://vercel.com).
    - Click **Add New** > **Project**.
    - Import your repository.
3.  **Configure Build Settings**:
    - Vercel automatically detects **Vite**.
    - Build Command: `npm run build`
    - Output Directory: `dist`
4.  **Add Environment Variables**:
    - Add `GEMINI_API_KEY` with your Google Gemini API key.
5.  **Deploy**: Click **Deploy**.

### Deploying to Cloudflare Pages

1.  **Push to GitHub**: Push your code to a GitHub repository.
2.  **Connect to Cloudflare**: 
    - Log in to your Cloudflare Dashboard.
    - Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
    - Select your repository.
3.  **Configure Build Settings**:
    - **Framework preset**: `Vite`
    - **Build command**: `npm run build`
    - **Build output directory**: `dist`
4.  **Add Environment Variables**:
    - Under the "Environment variables" section, add:
      - `GEMINI_API_KEY`: Your Google Gemini API key.
5.  **Deploy**: Click **Save and Deploy**.

Cloudflare will automatically deploy your site and handle routing (including refreshes) using the included `_redirects` file.
