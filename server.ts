import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Proxy route for key request
  app.get('/api/video-key', async (req, res) => {
    const { url, token, parentId, childId, videoId } = req.query;
    if (!url || !token) return res.status(400).send('Missing url or token');

    try {
        const urlObj = new URL(url as string);
        const parts = urlObj.pathname.split('/').filter(Boolean);
        const videoKey = parts[0]; 
        const keyName = parts[parts.length - 1];
        
        // Constructing URL. If parentId/childId/videoId are needed in the query, add them here.
        // For now, keeping the key request logic based on the requirements.
        let apiPencilUrl = `https://api.penpencil.co/v1/videos/get-hls-key?videoKey=${videoKey}&key=${keyName}&authorization=${token}`;
        if (parentId) apiPencilUrl += `&parentId=${parentId}`;
        if (childId) apiPencilUrl += `&childId=${childId}`;
        if (videoId) apiPencilUrl += `&videoId=${videoId}`;
        
        const response = await axios.get(apiPencilUrl, {
            responseType: 'arraybuffer'
        });
        res.set(response.headers);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching key from PenPencil:', error);
        res.status(500).send('Error fetching key from PenPencil');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
