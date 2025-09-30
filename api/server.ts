import express from "express";
import axios from "axios";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ESM replacements for __filename & __dirname
// __dirname will now point to the 'api' directory on Vercel.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// --- UNIVERSAL PORT CONFIGURATION ---
// Vercel provides process.env.PORT, otherwise default to 3000 for local use.
const PORT = process.env.PORT || 3000; 
// ------------------------------------

// Health check route
app.get("/", (_req, res) => {
  res.send("API is running");
});

/**
 * GET /api/framed-avatar/:username
 * Generates an image with a user's GitHub avatar framed by a theme image.
 */
app.get("/api/framed-avatar/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const theme = (req.query.theme as string) || "base";
    const size = Math.max(64, Math.min(Number(req.query.size ?? 256), 1024));

    // Define avatar size and offset for the frame
    const AVATAR_SCALE_FACTOR = 0.8; 
    const avatarSize = Math.floor(size * AVATAR_SCALE_FACTOR);
    const offset = Math.floor((size - avatarSize) / 2);
    
    // Calculate a corner radius for the avatar (e.g., 10% of avatar size)
    const cornerRadius = Math.floor(avatarSize * 0.1); 

    console.log(`Fetching avatar for user=${username}, theme=${theme}, size=${size}`);

    // Fetch GitHub avatar
  	// Added explicit casting to ensure Vercel's TypeScript compilation is happy
    const avatarUrl = `https://github.com/${username}.png?size=${size}`;
    const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" } as any);
    const avatarBuffer = Buffer.from(avatarResponse.data);

    // --- File Path Corrected to public/frames ---
    // path.join(__dirname, "..") goes to the project root.
    // We then explicitly step into the 'public' folder.
    const themePath = path.join(__dirname, "..", "public", "frames", theme, "frame.png");
    
    if (!fs.existsSync(themePath)) {
      // Returning 404 instead of crashing if the theme is not found
      return res.status(404).json({ error: `Theme '${theme}' not found. Checked path: ${themePath}. Ensure 'frames' is in the 'public' directory.` });
    }
    const frameBuffer = fs.readFileSync(themePath);
    // --- End File Path Correction ---

    // 1. Resize the Avatar to the smaller, square size
    const rawAvatar = await sharp(avatarBuffer).resize(avatarSize, avatarSize).png().toBuffer();
    
    // 2. Create an SVG mask for a rounded rectangle (squircle)
    const roundedSvg = `
      <svg width="${avatarSize}" height="${avatarSize}">
        <rect 
          x="0" y="0" 
          width="${avatarSize}" height="${avatarSize}" 
          rx="${cornerRadius}" ry="${cornerRadius}" 
          fill="white" 
        />
      </svg>
    `;
    const roundedMaskBuffer = Buffer.from(roundedSvg);
    
    // 3. Apply the rounded corner mask to the avatar
    const roundedAvatar = await sharp(rawAvatar)
      .composite([{ 
        input: roundedMaskBuffer, 
        blend: 'dest-in' // Uses the mask's alpha channel to create transparency
      }])
      .png()
      .toBuffer();

    // 4. Resize the Frame to the full size
    const frameResized = await sharp(frameBuffer).resize(size, size).png().toBuffer();

    // 5. Create a blank canvas the full size with a transparent background
    const canvas = sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background is key
        }
    }).png();

    // 6. Composite the rounded avatar and the full-sized frame
    const finalImage = await canvas
      .composite([
        // Place the rounded avatar, offset to be centered
        { 
            input: roundedAvatar, 
            left: offset, 
            top: offset 
        },
        // Overlay the full-sized frame on top
        { 
            input: frameResized, 
            gravity: "center" 
        }
      ])
      .toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.send(finalImage);
  } catch (error: unknown) {
  	// Safely check if the error is an instance of Error
    const err = error instanceof Error ? error : new Error(String(error)); 
    
    console.error("Fatal error during image generation:", err.stack || err.message || err);
    // Ensure any internal crash is logged and results in a 500
    res.status(500).json({ error: "Internal server error during image processing." });
  }
});

/**
 * GET /api/themes
 * Lists available themes by reading the frames directory inside the public folder.
 */
app.get("/api/themes", (req, res) => {
  // --- File Path Corrected to public/frames ---
  const framesDir = path.join(__dirname, "..", "public", "frames");
  
  if (!fs.existsSync(framesDir)) {
      // If the directory doesn't exist, it means the required files were not moved or bundled.
      return res.status(500).json({ error: "Frames directory not found. Please ensure 'frames' folder is inside the 'public' folder and deployment configuration is correct." });
  }
  
  const themes = fs.readdirSync(framesDir).filter(folder =>
    fs.existsSync(path.join(framesDir, folder, "frame.png"))
  );

  const result = themes.map(theme => {
    const metadataPath = path.join(framesDir, theme, "metadata.json");
    let metadata = {};
    if (fs.existsSync(metadataPath)) {
      try {
        metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
      } catch (e) {
        console.error(`Error parsing metadata for theme ${theme}:`, e);
      }
    }
    return { theme, ...metadata };
  });

  res.json(result);
});

// For Vercel, this listener is mostly ignored, but it is necessary for local Express development.
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
