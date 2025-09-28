// src/server.tsx

import express, { Request, Response } from "express";
import axios from "axios";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;

// --- CRITICAL FIX 1: ADD PERMISSIVE CSP HEADER ---
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; " + 
        "style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; " +
        "img-src 'self' data: https://github.com; " +
        "connect-src 'self' https://github.com;"
    );
    next();
});
// --------------------------------------------------


// --- PATH SETUP ---
// When compiled and run from 'dist/server.js', __dirname is 'dist'.
// '..' goes up to the project root.
const projectRoot = path.join(__dirname, '..');

// 1. STATIC FILES: /project-root/public
const staticPath = path.join(projectRoot, "public");

// 2. API ASSETS: /project-root/api/frames
const framesAssetsDir = path.join(projectRoot, "api", "frames");


// 📢 CRITICAL DEBUGGING LOGS FOR PATH RESOLUTION 📢
console.log("-----------------------------------------");
console.log(`✅ NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`✅ Current Dir (__dirname): ${__dirname}`);
console.log(`✅ Project Root: ${projectRoot}`);
console.log(`✅ Serving static files from: ${staticPath}`);
console.log("-----------------------------------------");
// 📢 ---------------------------------------------- 📢


// --- 2. SERVE STATIC FILES (FRONTEND/ASSETS) ---
// This middleware will serve index.html when the browser requests '/'
app.use(express.static(staticPath));


/**
 * GET /api/framed-avatar/:username
 * Example: /api/framed-avatar/octocat?theme=base&size=256
 */
app.get("/api/framed-avatar/:username", async (req: Request, res: Response) => {
    try {
        const username = req.params.username;
        const theme = (req.query.theme as string) || "base";

        const sizeStr = (req.query.size as string) ?? "256";
        if (!/^\d+$/.test(sizeStr)) {
            return res.status(400).json({
                error: "Bad Request",
                message: "The 'size' parameter must be a valid integer.",
            });
        }
        const size = Math.max(64, Math.min(parseInt(sizeStr, 10), 1024));

        console.log(`Fetching avatar for username=${username}, theme=${theme}, size=${size}`);

        // 1. Fetch GitHub avatar
        const avatarUrl = `https://github.com/${username}.png?size=${size}`;
        const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
        const avatarBuffer = Buffer.from(avatarResponse.data);

        // 2. Load and validate frame (Uses framesAssetsDir)
        const framePath = path.join(framesAssetsDir, theme, "frame.png");
        if (!fs.existsSync(framePath)) {
            return res.status(404).json({ error: `Theme '${theme}' not found.` });
        }
        const frameBuffer = fs.readFileSync(framePath);

        // 3. Resize avatar
        const avatarResized = await sharp(avatarBuffer)
            .resize(size, size)
            .png()
            .toBuffer();

        // 4. Pad frame to square and resize
        const frameMetadata = await sharp(frameBuffer).metadata();
        const maxSide = Math.max(frameMetadata.width!, frameMetadata.height!);

        const paddedFrame = await sharp(frameBuffer)
            .resize({
                width: maxSide,
                height: maxSide,
                fit: "contain",
                background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
            })
            .resize(size, size)
            .png()
            .toBuffer();

        // 5. Compose avatar + frame
        const finalImage = await sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
            .composite([
                { input: avatarResized, gravity: "center" },
                { input: paddedFrame, gravity: "center" },
            ])
            .png()
            .toBuffer();

        res.set("Content-Type", "image/png");
        res.send(finalImage);
    } catch (error) {
        console.error("Error creating framed avatar:", error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return res.status(404).json({ error: `GitHub user '${req.params.username}' not found.` });
        }
        res.status(500).json({ error: "Something went wrong." });
    }
});


/**
 * GET /api/themes
 * Lists all available themes + metadata
 */

app.get("/api/themes", (req: Request, res: Response) => {
    const framesDir = framesAssetsDir;

    try {
        const themes = fs.readdirSync(framesDir).filter(folder =>
            fs.existsSync(path.join(framesDir, folder, "frame.png"))
        );

        const result = themes.map(theme => {
            const metadataPath = path.join(framesDir, theme, "metadata.json");
            let metadata = {};
            if (fs.existsSync(metadataPath)) {
                metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
            }
            return { theme, ...metadata };
        });

        res.json(result);
    } catch (error) {
        console.error("Error listing themes:", error);
        res.status(500).json({ error: "Failed to load themes." });
    }
});

// --- 3. SINGLE PAGE APPLICATION (SPA) FALLBACK ---
// Handles client-side routes (e.g., /settings) that weren't caught by the static server.
app.get("*", (req: Request, res: Response) => {
    const indexPath = path.join(staticPath, "index.html");

    // 📢 CRITICAL DEBUGGING LOG 📢
    console.log(`Fallback: Attempting to send: ${indexPath}. File exists: ${fs.existsSync(indexPath)}`);
    // 📢 ----------------------- 📢

    if (!req.path.startsWith('/api') && req.accepts('html')) {
        res.sendFile(indexPath); 
    } else {
        res.status(404).send('Not Found');
    }
});


// --- EXPORT AND START LISTENER ---
// Export the app for testing and serverless functions (Vercel)
export const api = app;

// Only start the listener if the file is executed directly (local development)
if (process.env.NODE_ENV !== 'test') {
    api.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}