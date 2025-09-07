# GitHub Avatar Frame API

A free and open-source API that allows you to frame your GitHub profile picture with creative themes! Easily embed styled avatars in your README files, portfolios, or social media.

---

## 🌐 Live API

Access the API at:  
**https://frame-api.vercel.app**

---

## 📂 Usage

### ✅ Frame URL format

`https://frame-api.vercel.app/api/frame/{theme}/{username}`

- `{theme}` – The frame theme (e.g., `code`)
- `{username}` – Your GitHub username

**Example:**

![Code Avatar](https://frame-api.vercel.app/api/frame/code/octocat)

---

### ✅ List of Available Themes

Fetch all available themes dynamically:

`https://frame-api.vercel.app/api/themes`


**Example response:**

```json
{
  "themes": [
    {
      "id": "code",
      "name": "Code Frame",
      "description": "Tech-inspired frame with brackets and lines"
    }
  ]
}
```

### ✅ Collage Example (Optional)

Combine multiple avatars into one frame:

[https://frame-api.vercel.app/api/collage/community?users=octocat,mojombo,torvalds](https://frame-api.vercel.app/api/collage/community?users=octocat,mojombo,torvalds)

### 🖼 Example Themes
-----------------

Theme Description codeTech-inspired - frame with brackets and linesopen-source Showcase, open-source contributions collaboration Highlight teamwork and partnerships hackathon Event badges with futuristic designs beginner Soft pastel frame for learnersproSleek minimalistic professional frame community, Group-oriented connecting elementsevents Calendar and schedule designs, funComic-style vibrant, framedark-modeNeon dark overlays for modern aesthetics

> Note: Only the code theme is included by default. Others can be added by the community following the

[CONTRIBUTING.md](./CONTRIBUTING.md)

📖 How to Use in README

Embed an avatar with a frame:

![My Avatar](https://frame-api.vercel.app/api/frame/code/octocat)

*   Replace code with your desired theme
    
*   Replace octocat with your GitHub username

*   🤝 Contribute
    
*   We welcome new themes, improvements, and ideas! See [CONTRIBUTING.md](./CONTRIBUTING.md) to learn how to add themes and submit pull requests.
    
*   **Contribution Flow:**
    
*   Use the working base theme (code) to test the API.
    
*   Add new frames or themes in public/frames/.
    
*   Submit a pull request for review.


###  ⚙ Tech Stack
    
*   **Node.js & Express.js (TypeScript)** – API backend
    
*   **Sharp** – Image processing
    
*   **Vercel** – Serverless deployment
    
*   **MongoDB (optional)** – For caching or metadata in the future
    
*   **TypeScript** – Type safety and better development experience

### ✅ Key Features of This README:

*   **Highlights the working base** (code theme) so users can see the API in action.
    
*   **Explains URL format** and shows example usage.
    
*   **Dynamic themes endpoint** explained.
    
*   **Collage feature** included as optional.
    
*   **Encourages contribution** with clear steps.
    
*   **Professional open-source structure** matching GSSoC projects.


---

If you want, I can **now create a ready-to-use `metadata.json` template and a starter theme folder** that fits this TypeScript + Node + Sharp structure so contributors know exactly how to add new themes.  

Do you want me to do that next?
