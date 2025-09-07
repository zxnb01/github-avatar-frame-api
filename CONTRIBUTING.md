# Contributing to GitHub Avatar Frame API

Thank you for considering contributing to the GitHub Avatar Frame API! Whether you're a beginner or an experienced developer, your contributions are highly valued.

---

## 🚀 Getting Started

Before contributing, please ensure you have:

- A basic understanding of Git and GitHub.
- Familiarity with the project's structure and functionality.
- Reviewed the [README.md](./README.md) for an overview of the project.

---

## 🛠 How to Contribute

### 1. Fork the Repository

Click on the **Fork** button at the top right of this repository to create a copy under your GitHub account.

### 2. Clone Your Fork

Clone your forked repository to your local machine:

```bash
git clone [https://github.com/your-username/github-avatar-frame-api.git](https://github.com/your-username/github-avatar-frame-api.git)
cd github-avatar-frame-api
```

### 3\. Create a New Branch

Create a new branch for your changes:

Bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git checkout -b add-new-theme   `

### 4\. Add Your Theme

Add your theme by:

*   Creating a new folder inside public/frames/ for your theme's name.
    
*   Adding a frame.png (256x256 px, transparent background) inside your theme folder.
    
*   Optionally, adding a metadata.json to describe your theme.
    

### 5\. Commit Your Changes

Commit your changes with a clear message:

Bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git add .  git commit -m "Add 'future' theme with neon elements"   `

### 6\. Push to Your Fork

Push your changes to your forked repository:

Bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git push origin add-new-theme   `

### 7\. Create a Pull Request

Go to the original repository and click on New Pull Request. Provide a descriptive title and detailed explanation of your changes.

📚 Guidelines
-------------

*   Ensure your theme's frame.png is a transparent PNG, ideally 256x256 px.
    
*   Follow the naming convention: theme folder = {theme-name}, image = frame.png.
    
*   Optionally, include a metadata.json with the following structure:
    

JSON

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "name": "Future Frame",    "description": "A futuristic theme with neon elements."  }   `

*   Test your theme by accessing:
    

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   [https://frame-api.vercel.app/api/frame/](https://frame-api.vercel.app/api/frame/){your-theme}/{github-username}   `

🤝 Code of Conduct
------------------

By participating, you agree to adhere to our Code of Conduct.

📝 License
----------

This project is licensed under the MIT License.

### ✅ Key Features of This Template:

*   **Clear Step-by-Step Instructions**: Guides contributors through forking, cloning, creating branches, adding themes, committing, and creating pull requests.
    
*   **Detailed Guidelines**: Provides specific instructions on naming conventions, file formats, and optional metadata inclusion.
    
*   **Testing Instructions**: Encourages contributors to test their themes using the live API before submitting pull requests.
    
*   **Code of Conduct and License**: Links to the project's code of conduct and licensing information to ensure a respectful and legally compliant contribution process.
    

Feel free to adjust the content to better fit your project's specific requirements. If you need further assistance or additional templates (like README.md or CODE\_OF\_CONDUCT.md), don't hesitate to ask!