import axios from "axios";
import sharp from "sharp";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // Get username from query parameter
    const username = req.query.username;
    const theme = req.query.theme || "base";
    const size = Math.max(64, Math.min(Number(req.query.size || 256), 1024));

    // Validate username
    if (!username || typeof username !== "string" || username.trim() === "") {
      return res.status(400).json({ error: "Username is required" });
    }

    // Validate theme
    if (!theme || typeof theme !== "string" || theme.trim() === "") {
      return res.status(400).json({ error: "Theme is required" });
    }

    // Validate size
    if (isNaN(size) || size < 64 || size > 1024) {
      return res
        .status(400)
        .json({ error: "Size must be between 64 and 1024" });
    }

    console.log(
      `Fetching avatar for username=${username}, theme=${theme}, size=${size}`
    );

    // Fetch GitHub avatar
    const avatarUrl = `https://github.com/${username}.png?size=${size}`;
    let avatarResponse;

    try {
      avatarResponse = await axios.get(avatarUrl, {
        responseType: "arraybuffer",
        timeout: 10000,
        validateStatus: (status) => status === 200,
      });
    } catch (axiosError) {
      if (axiosError.response?.status === 404) {
        return res.status(404).json({ error: "GitHub user not found" });
      }
      throw axiosError;
    }

    const avatarBuffer = Buffer.from(avatarResponse.data);

    // Locate theme frame - use proper path resolution
    const ASSET_BASE_PATH = path.join(__dirname, "..");
    const themePath = path.join(
      ASSET_BASE_PATH,
      "public",
      "frames",
      theme,
      "frame.png"
    );
    if (!fs.existsSync(themePath)) {
      return res.status(404).json({ error: `Theme '${theme}' not found` });
    }
    const frameBuffer = fs.readFileSync(themePath);

    // Resize and overlay
    const avatarResized = await sharp(avatarBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    const frameResized = await sharp(frameBuffer)
      .resize(size, size)
      .png()
      .toBuffer();

    const finalImage = await sharp(avatarResized)
      .composite([{ input: frameResized, gravity: "center" }])
      .png()
      .toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(finalImage);
  } catch (error) {
    console.error("Error processing avatar:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}
