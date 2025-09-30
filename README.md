<!-- GSSoC banner and project insights -->
<h1 align="center">
  GitHub Avatar Frame API
</h1>

<p align="center">
  <b>This project is now OFFICIALLY accepted for:</b>
</p>

<div align="center">
  <img src="public/assets/gssoc.png" alt="GSSOC" width="80%">
</div>

**📊 Project Insights**

<table align="center">
    <thead align="center">
        <tr>
            <td><b>🌟 Stars</b></td>
            <td><b>🍴 Forks</b></td>
            <td><b>🐛 Issues</b></td>
            <td><b>🔔 Open PRs</b></td>
            <td><b>🔕 Closed PRs</b></td>
            <td><b>🛠️ Languages</b></td>
            <td><b>👥 Contributors</b></td>
        </tr>
     </thead>
    <tbody>
         <tr>
            <td><img alt="Stars" src="https://img.shields.io/github/stars/TechQuanta/github-avatar-frame-api?style=flat&logo=github"/></td>
            <td><img alt="Forks" src="https://img.shields.io/github/forks/TechQuanta/github-avatar-frame-api?style=flat&logo=github"/></td>
            <td><img alt="Issues" src="https://img.shields.io/github/issues/TechQuanta/github-avatar-frame-api?style=flat&logo=github"/></td>
            <td><img alt="Open PRs" src="https://img.shields.io/github/issues-pr/TechQuanta/github-avatar-frame-api?style=flat&logo=github"/></td>
            <td><img alt="Closed PRs" src="https://img.shields.io/github/issues-pr-closed/TechQuanta/github-avatar-frame-api?style=flat&color=critical&logo=github"/></td>
            <td><img alt="Languages Count" src="https://img.shields.io/github/languages/count/TechQuanta/github-avatar-frame-api?style=flat&color=green&logo=github"></td>
            <td><img alt="Contributors Count" src="https://img.shields.io/github/contributors/TechQuanta/github-avatar-frame-api?style=flat&color=blue&logo=github"/></td>
        </tr>
    </tbody>
</table>

# 🎨 GitHub Avatar Frame API

A free and open-source API that lets you frame your GitHub profile picture with creative themes. Use it in your README files, portfolios, or social media to showcase styled avatars.

**🌐 Live API:** https://frame-api.vercel.app

## Example:
<div align=center>
<a href="https://github-avatar-frame-api.vercel.app">
  <img src="https://github-avatar-frame-api.vercel.app/api/framed-avatar/octocat?theme=neon&size=256" alt="avatar-api">
</a>

</div>



## 🚀 Project Purpose

This project is a base skeleton API that currently includes only the `code` theme. Contributors can:

- Add new frame themes 🎨
- Propose new features ⚡
- Improve documentation and examples ✍️

The goal is to build a creative, community-driven way to style GitHub avatars.

## 🛠 Run Locally

### Fork the Repository
Click on the **Fork** button at the top right of this repository to create a copy under your GitHub account.

### Clone Your Fork
```bash
git clone https://github.com/TechQuanta/github-avatar-frame-api.git
cd github-avatar-frame-api
```

### Install Dependencies
```bash
npm install
```

### Start the Development Server
```bash
npm run dev
```

Now open: http://localhost:3000

## 📂 Usage

### Frame URL Format
```
https://frame-api.vercel.app/api/frame/{theme}/{username}
```

- `{theme}` → The frame theme (e.g., `code`)
- `{username}` → Your GitHub username

**Example:**
```
https://frame-api.vercel.app/api/frame/code/octocat
```

### List Available Themes
Check all available themes dynamically:
```
https://frame-api.vercel.app/api/themes
```

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

### How to Use in README
Embed a framed avatar in your README:
```markdown
![My Avatar](https://frame-api.vercel.app/api/frame/code/your-username)
```

Replace `your-username` with your actual GitHub username.

## 🤝 Contributing

We welcome contributions of all kinds:

- **New themes** in `public/frames/`
- **New features** for the API
- **Documentation** updates
- **Bug fixes** and improvements

### Quick Start for Contributors:
1. 🍴 Fork the repository
2. 🌿 Create a new branch for your feature
3. 🎨 Add your theme or improvement
4. 🧪 Test your changes locally
5. 📝 Submit a pull request

### Ways to Contribute:
- 🎨 **Design new themes** - Create unique frames for different use cases
- 🐛 **Fix bugs** - Help improve stability and performance  
- ✨ **Add features** - Implement new functionality like animated frames
- 📚 **Improve docs** - Help others understand and use the project
- 🧪 **Write tests** - Ensure code quality and reliability

👉 See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution steps.
👉 All contributors must follow our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## ⚙ Tech Stack

- **Node.js & Express.js (TypeScript)** → API backend
- **Sharp** → Image processing
- **Vercel** → Serverless deployment
- **MongoDB** (optional) → Future caching/metadata
- **TypeScript** → Type safety and better development

## 🔗 Links

- **Live API:** https://frame-api.vercel.app
- **Contributing Guidelines:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Code of Conduct:** [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **Issues:** [GitHub Issues](https://github.com/TechQuanta/github-avatar-frame-api/issues)

## 🌟 Show Your Support

If you find this project useful, please consider:
- ⭐ **Star this repository** - It helps others discover the project
- 🐛 **Report bugs** or suggest features in [Issues](https://github.com/TechQuanta/github-avatar-frame-api/issues)
- 🤝 **Contribute** new themes and improvements
- 📢 **Share** it with the developer community

## 📜 License

This project is licensed under the MIT License.
