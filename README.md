# Shubham Verma · Portfolio

Personal site: production ML & GenAI systems for industrial machines.

Plain HTML, CSS and JavaScript with no build step. Open `index.html` or serve the folder:

```sh
python3 -m http.server
```

- **Blog posts:** add entries to the `POSTS` list in `script.js` (newest first). The section shows a "coming soon" state while it is empty.
- **Case studies:** edit the `CASES` object in `script.js`.
- **Audience views** (Recruiter, Developer, Client, Visitor): edit `AUDIENCES` in `script.js`. Link to one directly with `?for=developer`.

## Publishing changes

The site deploys to GitHub Pages on every push to `main`. Pages lets browsers cache files for 10 minutes, so after changing `styles.css` or `script.js`, bump the `?v=` date on their links in `index.html`. Otherwise returning visitors may keep the old file for a few minutes.
