# AG Cute Blocks V0.5.97 validation marker

This file intentionally records the post-sync validation point for V0.5.97.

- Bootstrap is the authoritative version owner.
- `index.html` was synchronized by the release-chain workflow to V0.5.97.
- This commit exists to trigger the normal push validation suite again after the bot-generated index sync commit, because GitHub does not recursively trigger ordinary Actions workflows from a GITHUB_TOKEN bot commit.
- No gameplay code is changed by this marker.
- Previously passing V0.5.93–V0.5.96 functionality is not being reworked.

Validation target: static/CI convergence of the current V0.5.97 release chain without modifying gameplay behavior.
