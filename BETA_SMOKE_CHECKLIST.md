# Beta RC2 — final acceptance checklist

**Candidate:** 28 November 2026; local review branch only.

### Preflight receipt (static checks, 28 November 2026)

| Check | Result | Scope |
| --- | --- | --- |
| Reconciled new source fact IDs | PASS | 1,993 / 1,993; EDF4.1 365, EDF5 400, EDF6 1,228 |
| HTML, local links, fragments, search identity | PASS | 598 HTML; 594 articles; 595 index entries; no missing local targets |
| JavaScript syntax and patch whitespace | PASS | `node --check assets/site.js`, `git diff --check` |
| SHA256 release manifest | PASS after regeneration | `sha256sum -c SHA256SUMS.txt` |
| Local HTTP server | PASS | Python `http.server`, ordinary 127.0.0.1 request |
| Chromium/Playwright desktop + 390 px | BLOCKED | Chromium launcher exists, browser binary absent (`/usr/lib/chromium/chromium`) |
| Human credits/reuse and owner authorization | PENDING | Must be completed separately |

The HTTP server preflight is **not** a replacement for an actual browser.
Keep every untested browser checkbox below unchecked until a person or
usable browser environment runs the exact RC2 files.

Run this against the actual **HTTP(S) preview URL**, not a `file://` tab.
Record the date, browser/version, device/viewport and failing URL or query.

## Release blockers — must pass before public beta

- [ ] Open homepage: heading, main content, local CSS and no broken assets.
- [ ] Desktop navigation: sidebar topics, documentation, and at least one
      deep article link load directly and after refresh.
- [ ] Search: enter `MAPB +0x20`, `CMPL`, `humanoid_climb_setting`,
      `safe120` and `SK_SANGAKU02`; check relevance, results and direct
      article navigation. Confirm a no-match query is handled clearly.
- [ ] Search filters: EDF 4.1 / EDF 5 / EDF 6 and topic/evidence filters;
      clear query/filters and confirm normal article view returns.
- [ ] Anchor and refresh: follow a cross-article `#fragment`, reload, use
      browser back/forward; landing section remains identifiable.
- [ ] Narrow viewport (around 390 px): menu toggle, search field, readable
      article body, wide technical table horizontal scrolling and no clipped
      content/overlapping controls.
- [ ] Keyboard: Tab/Shift+Tab visible focus, Enter on navigation/results,
      Escape closing the mobile topic drawer; verify skip link.
- [ ] Dark/light toggle: readable tables, code blocks, links, headings and
      evidence notes in both themes.
- [ ] `all-articles.html` and `materials-used.html` load from the root and
      have working internal links; `404.html` provides a useful fallback.
- [ ] Browser console/network: no fatal JavaScript error, failed local JSON
      request, unexpected third-party script/analytics or mixed-content block.

## Content and governance — must review before public beta

- [ ] Confirm the homepage lists source contributors correctly and says the
      site is unofficial; review `materials-used.html` for attribution.
- [ ] Confirm the Knowledge Hub original-wording labels are visible and
      distinguish its compiled records from independently credited originals.
- [ ] Inspect the targeted third-party expression matches (including
      `heli-flight-input`, `heli-fire-rider`, and `mode-save-keys-format`);
      remove unlicensed copied prose if found, without removing technical
      facts. An absent blanket permission is not a contributor prohibition.
- [ ] Confirm no original retail game assets, source ZIPs, private Havok SDK
      material or protected contributor images were bundled.
- [ ] Confirm known open questions and evidence limits are not advertised as
      proven runtime behavior; sample-check at least one native and one
      source-only article.
- [ ] Approve the destination/visibility and the actual publish operation.

## Accepted beta limitations — do not block release by themselves

- [ ] Record outstanding research/census coverage as known limitations.
- [ ] Record the external Miraheze comparison as pending where access failed.
- [ ] Record that direct `file://` dynamic search is not the deployment
      contract. The web preview is the acceptance target.
- [ ] Record untested EDF gameplay/native-runtime cases without claiming PASS.

**Decision:** `GO` only if every release blocker passes and publication is
explicitly authorized. Otherwise `NO-GO` with the specific failing item.
