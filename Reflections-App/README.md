# Reflections App

Two deployments:

- **Public onboarding** → `https://lab4-proof.onrender.com`
- **Founders PAW** (private, JADE/HERMES/EVE/ZEUS) → `https://reflections-app.onrender.com`

## 🤖 AI-Powered PR Reviews

This repository includes automated AI code reviews powered by **GitHub Models** and **OpenAI**! Every pull request gets automatically reviewed by AI that checks for:

- 🔒 Security vulnerabilities and auth issues
- ⚡ Performance bottlenecks
- 🎯 React/Next.js best practices
- 🧪 Testing recommendations
- 📐 Architecture improvements

### Quick Setup for AI Reviews

1. **Push to GitHub**: Make sure this repo is on GitHub with Actions enabled
2. **Add API Key** (Optional): For OpenAI fallback, add `OPENAI_API_KEY` to repository secrets
3. **Create a PR**: The AI reviewer will automatically comment with feedback!

The workflows are already configured in `.github/workflows/` - just push and create PRs! 🚀

---

## Setup
1. Copy `env.example` → `.env.local` and fill values.
2. Install deps: `npm i`
3. Dev: `npm run dev`

### Env flags

| var | public | founders |
|-----|--------|----------|
| `NEXT_PUBLIC_APP_TIER` | `public` | `founders` |
| `NEXT_PUBLIC_AUTH_BASE` | your API base | same |
| `NEXT_PUBLIC_USE_COOKIE_REFRESH` | `true` (recommended) | `true` |
| `SIGNUPS_DISABLED` | `false` | `true` (optional) |

### Auth API (expected)
- `POST /auth/register` → `{ email, password, ... }` → may return tokens
- `POST /auth/login` → `{ email, password }` → `{ accessToken, refreshToken?, user }`
- `POST /auth/refresh` → `{ refreshToken }` or cookie → `{ accessToken, refreshToken?, user? }`
- `POST /auth/logout` → clears cookie or accepts `{ refreshToken }`

### Founders-only guard
The `middleware.ts` checks JWT, requires `roles: ["founder"]` for the Founders app.
Admin can seed founders by updating `users.roles`.

### UI
- Mobile: companions sidebar is **off-canvas** drawer
- Desktop: fixed ~320px sidebar
- Accessibility: Esc-to-close, ARIA attrs, backdrop

### Packages added
`clsx`, `zustand`

---

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (for running the React app)
- Git (for version control and AI review workflows)

### Your live FastAPI backend: 
https://hive-api-2le8.onrender.com

### Steps

1. **Clone or Create the Repository:**
   ```bash
   git clone https://github.com/kaizencycle/Reflections-app.git
   cd Reflections-app 
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Application:**
   The application will automatically connect to your live backend.
   ```bash
   npm start
   ```
   The app will open in your browser, usually at http://localhost:3000.

---

## 🔄 Development Workflow with AI Reviews

### Creating Feature Branches
```bash
# Create and switch to a new feature branch
git checkout -b feat/your-feature-name

# Make your changes in Cursor
# ... edit files ...

# Stage and commit changes
git add .
git commit -m "feat: add your feature description"

# Push to GitHub
git push -u origin feat/your-feature-name
```

### Getting AI Reviews
1. **Open a Pull Request** on GitHub
2. **Wait ~1-2 minutes** for the AI reviewer to analyze your code
3. **Review the feedback** posted as a comment on your PR
4. **Make improvements** based on AI suggestions
5. **Push updates** to get re-reviewed automatically

### Pre-commit Hook (Optional)
A pre-commit hook is already set up to run basic checks locally:
- Warns about console.log statements
- Checks for large files
- Counts TODO/FIXME comments
- Validates package.json changes

---

## 🛠️ AI Review Configuration

### GitHub Models (Default)
- Uses GitHub's built-in AI models
- No external API key required
- Configured in `.github/workflows/ai-pr-review.yml`

### OpenAI Fallback
- Uses OpenAI GPT-4o-mini for reviews
- Requires `OPENAI_API_KEY` in repository secrets
- Configured in `.github/workflows/ai-pr-review-openai.yml`

### Customizing Reviews
Edit the prompt in either workflow file to customize what the AI focuses on:
- Security concerns
- Performance optimization
- Code style preferences
- Testing requirements

---

## 📁 Project Structure
```
reflections-app/
├── .github/workflows/     # AI review workflows
├── src/                   # React source code
├── components/            # React components
├── stores/               # State management
├── config/               # Configuration files
└── public/               # Static assets
```

---

## 🚀 Next Steps

1. **Push this repo to GitHub** to enable AI reviews
2. **Create your first feature branch** and make some changes
3. **Open a PR** and watch the AI reviewer in action!
4. **Customize the AI prompts** in the workflow files to match your team's standards

Happy coding with your AI pair programmer! 🤖✨

## 🧪 Testing AI Reviews

This change was made to test the AI PR review functionality. The AI should analyze this diff and provide feedback on the documentation update.

