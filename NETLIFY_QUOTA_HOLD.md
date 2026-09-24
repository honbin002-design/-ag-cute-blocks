# AG Cute Blocks — Netlify quota protection

Effective: 2026-09-24

User directive: Netlify quota is low. Do not use Netlify for routine development, validation, visual capture, or automatic deploy attempts.

Rules:
- No Netlify deploy-site calls for ongoing TEST development.
- No deploy solely to inspect version/runtime state.
- Prefer GitHub source validation and GitHub Actions/local-isolated test gates that do not consume Netlify deploy quota.
- Keep the existing Netlify site unchanged unless the user explicitly authorizes a future Netlify deployment.
- PROD remains untouched.
- V0.5.207 source work may continue in GitHub without publishing to Netlify.
