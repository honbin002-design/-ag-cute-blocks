# AG Cute Blocks — Netlify permanent isolation rule

Effective: 2026-09-24
Authority: user directive / permanent project rule

Netlify previously exhausted its free operational quota during TEST activity. Therefore Netlify is permanently excluded from the AG Cute Blocks formal/PROD architecture.

Mandatory rules:
- PROD / formal release MUST have zero dependency on Netlify.
- Do not use Netlify for PROD hosting, deployment, fallback, runtime dependency, storage, API, build pipeline, validation, or release gate.
- Do not use Netlify for routine TEST development or validation because its quota is too limited.
- Existing historical Netlify TEST sites are legacy artifacts only. Their existence must not define or constrain the formal architecture.
- Do not trigger Netlify deploy-site or automatic deployment attempts unless the user explicitly authorizes a one-off future action.
- GitHub remains source/version truth for development; Google Drive remains the project-controlled data/file location where applicable.
- Use zero-cost/non-Netlify isolated validation paths for ongoing development.
- PROD remains untouched while TEST work proceeds.

This supersedes the earlier temporary quota-hold wording. Netlify is not a candidate for the formal release architecture.
