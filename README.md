# EDF Technical Knowledge Wiki

An **unofficial, community-maintained technical reference** for **Earth Defense Force 4.1, EDF 5 and EDF 6**. This is a **public beta**: useful information is available now, while some native behavior and file formats remain unverified or incomplete.

**[Browse the wiki](https://bartey-repos.github.io/edf-technical-knowledge-wiki/)** · [All articles](https://bartey-repos.github.io/edf-technical-knowledge-wiki/all-articles.html) · [Materials Used / credits](https://bartey-repos.github.io/edf-technical-knowledge-wiki/materials-used.html)

## What's inside

- **594 directly linked technical articles**, with a searchable catalog and filters by game, topic and evidence type.
- Notes on file formats, runtime structures, memory/register maps, shaders, missions, collision, navigation, scripting and engine behavior.
- Explicit distinctions between observed behavior, source-based findings, examples and unresolved questions.

This reference is **not affiliated with or endorsed by** the game's developers or publishers. See [Materials Used](materials-used.html) for source and contributor acknowledgments. Linked research and third-party material are not automatically licensed for redistribution.

## Read locally

This is a static HTML/CSS/JavaScript site; no build step or backend is needed. Serve the repository directory over HTTP, for example:

```powershell
py -m http.server 8000
```

Then open `http://localhost:8000/`. Opening `index.html` directly as a `file://` URL may break JSON-backed search.

## Beta status and feedback

The site is an evolving reference, **not** a claim that all EDF engine behavior has been independently verified in-game. See [beta notes](RELEASE_NOTES.md) and the [test checklist](BETA_SMOKE_CHECKLIST.md) for RC1 provenance, limitations and checks. Corrections and reproducible technical findings are welcome through [GitHub Issues](https://github.com/BarteY-repos/edf-technical-knowledge-wiki/issues).

**License:** No project license has been selected or granted at this time. Please do not assume permission to reuse this repository's content or any credited third-party material.
