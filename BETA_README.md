# EDF Technical Knowledge Wiki — public beta release candidate

**Build:** beta RC2, 28 November 2026 (RC1 was 20 November).

**Status:** static reconciliation prepared; browser acceptance and authorization pending; **not published by this package**.
**Scope:** unofficial English-language technical reference for EDF 4.1, EDF 5 and EDF 6.

## Contents

- `index.html`: homepage, navigation, topics and search interface.
- `articles/`: **594** directly addressable HTML articles.
- `all-articles.html`: complete article directory.
- `materials-used.html`: source and contributor acknowledgments.
- `assets/`: local stylesheet and JavaScript only.
- `data/`: **595** catalog and full-text search records, including the homepage.
- `BETA_SMOKE_CHECKLIST.md`, `RELEASE_NOTES.md`, `SHA256SUMS.txt`: RC2 review and integrity.

No original EDF game assets, executable binaries, private Havok output,
external source archives, browser analytics or external runtime packages are
included. Original resource names and source paths mentioned *inside articles*
are research references, not packaged files.

## How to preview

Host this directory on a static **HTTP(S)** server. Open its `index.html`.
Navigation and full-text search request `data/*.json`; opening the file
directly with `file://` may display the HTML but does **not** constitute
full search/navigation acceptance. Any static host supporting relative URLs
and JSON files can be evaluated; no backend, database or build tool is needed.

Do not publish before completing `BETA_SMOKE_CHECKLIST.md` in a real browser,
reviewing credits/reuse boundaries and obtaining explicit approval for the
chosen public destination. This is a **release candidate**, not a release
announcement or authorization for a GitHub push.

## What beta means here

Beta means a useful, navigable technical reference with known limitations.
It does **not** mean every format has been reversed, every native behavior
verified in-game, every external link rechecked or every research project
finished. Source-derived conclusions, direct native measurements, modified
runtime observations and open questions remain identified in the articles.

## Attribution and reuse

The project is unofficial and is not affiliated with the games' publishers
or developers. Read `materials-used.html` before quoting or reusing
individual findings. The presence of an external source link or
acknowledgment is **not** an assertion that its original files are licensed
for redistribution. No new public reuse license is granted by this RC.

Some expanded records reproduce the **EDF Knowledge Hub's compiled English
wording** and are clearly labeled as such in the reader. The owner relayed
permission to incorporate that research into a larger shared knowledge base;
this does not assert permission to republish the original materials of every
independent author cited by the Hub. Research from ktaro, hajisensai,
FevGrave, KittopiaCreator and other contributors is attributed and should be
explained independently unless a specific permission or license permits exact
reuse. Neither a blanket verbatim permission nor a blanket prohibition from
those contributors has been recorded.

## Known publication blockers

1. Real browser acceptance over a reachable HTTP(S) preview, on desktop and
   a narrow/mobile viewport; this environment has no Chromium browser binary.
2. Final human check of `materials-used.html`, the homepage contributors,
   source references and original-asset boundaries.
3. Explicit choice and authorization of the public hosting/repository target.

Known incomplete research, an inaccessible external Miraheze comparison and
unverified in-game behaviors remain documented **non-blocking beta
limitations**, not missing features that need to be invented before launch.
