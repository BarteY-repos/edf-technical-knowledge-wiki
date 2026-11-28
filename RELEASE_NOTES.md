# EDF Technical Knowledge Wiki — beta RC2 release notes

**Candidate date:** 28 November 2026

**Release branch:** `release/knowledge-hub-integrated-beta` (local review copy)

**Public baseline:** `5ad880ecd27b82df37756819f59172fdc76c3155`

## RC2: reconciliation since the first candidate

**Reader-facing content revision:** The Knowledge Hub source information is
integrated under ordinary technical section titles throughout the wiki.
Editorial snapshot-date headings and labels were removed from 218 article
headings and their navigation/search counterparts. Canonical fact anchors,
article links and build-specific evidence labels were retained; the original
source revision identities remain available in the provenance notes.

- Reconciled all **1,993 newly identified fact records** from the 25 November
  Knowledge Hub source revision (`5b589ca`): EDF4.1 **365**, EDF5 **400**,
  EDF6 **1,228**. This is editorial/source coverage, **not** retail runtime
  verification, a claim of new discoveries, or a redistribution license.
- Restored the cumulative **148-step editorial review** over the public
  baseline. The site remains **598 HTML files**, including **594 article
  pages**, with **595 search/catalog records** (the extra record is the home
  index). Existing article URLs are preserved.
- Revisited the three cross-generation community pages most affected by the
  changed source: save-data encryption, headers and offsets; settings menu
  dispatchers and layout/callback boundaries; radar scale, colors, bounds
  and per-edition marker behavior.
- Corrected two historical inferences whose text is no longer retained in the
  November source: an EDF4.1 Nephila DLC `0.01` value and EDF5 talk-SGO
  trailing-field semantics. Both retain explicit provenance boundaries.
- Aligned homepage credits with the source trail and updated the Materials
  Used notice to describe the reconciliation scope accurately.
- Clarified the text-reuse policy: expanded Knowledge Hub source records are
  explicitly marked as retaining the compiler's original wording, whereas
  unrelated authors' research is attributed and independently explained
  unless the individual license or permission supports verbatim reuse.
  No contributor was incorrectly described as having prohibited such reuse.

## RC2 verification and remaining gates

**Static checks:** HTML/fragment/link and search-index validation; source
record coverage; JavaScript syntax; whitespace checks; SHA256 release
manifest after regeneration. The exact local test receipt is in
`BETA_SMOKE_CHECKLIST.md`.

**Not accepted yet:** A fresh desktop and 390-pixel mobile real-browser
smoke test on the RC2 artifact. The test host can serve HTTP, but this
execution environment has no installed Chromium browser binary and thus
cannot claim a Playwright PASS. Human attribution/reuse review and explicit
owner approval for any public push or hosting change also remain required.

**Source-wording review:** A targeted comparison of 203 longer source-credited
records across 31 articles found 188 exact and 15 near-exact carryovers from
the older Megawiki archive. This establishes retained wording from the
compiled Knowledge Hub corpus, not 203 verbatim copies of the independent
authors' original documents. Originals for all 197 hajisensai-attributed
records were located; eight English matching-word runs remain flagged for
targeted editorial review, many involving field lists or technical terms.
The other contributor permission scope is not inferred from citations.

**Known research/editorial limitations:** An audit found 74 removed fact IDs
whose earlier historical source text still appears in the wiki, plus 16
probable successor IDs. They are not automatically deleted. The changed
and removed crosswalk corpus also contains 629 added source rows from 24
topics without a dedicated crosswalk article. This does not establish that
their subject matter is missing from the broader wiki, but prevents a
claim of complete crosswalk text parity. See the reconciliation audit
before making a stronger claim. Unchecked source-only and gameplay
interpretations remain labeled with their evidence scope.

**Release disposition: NO-GO for publication pending browser acceptance,
final source/reuse review and explicit owner authorization.** These gates
are independent of the completed record-level reconciliation. No public
`main` push is implied by preparing this candidate.

---

## Historical RC1 notes (20 November 2026)

**Candidate date:** 20 November 2026

The first public-beta candidate packages the complete static EDF 4.1 / 5 /
6 technical reference in a deployment-oriented form. It retains **594**
article URLs, **595** catalog/full-text records and the dedicated Materials
Used page. Content was frozen from the reconciled **R209 v10** offline site;
no new game-file research claims were added for RC1.

## Highlights

- Direct HTML article URLs and cross-linked format, shader, mission,
  collision, navigation, scripting and engine reference content.
- Full-text search, topic/game filters, in-page anchors, research notes
  and dark/light display.
- Central source/contributor acknowledgments and explicit native,
  source-derived, illustrative and unresolved evidence boundaries.
- Recent technical refinements include EDF6 shader register/constant maps,
  EDF5/EDF6 Humanoid climb ABI, and complete original EDF4.1 SK map
  LOW/HIGH HKT/NVMD structural and map-RMPA graph comparisons.

## Offline checks already passed

- 598 HTML files, exactly one primary heading per page, unique IDs and
  valid language/viewport metadata.
- 13,436 internal resource/link references and 6,848 fragment references,
  with no missing target or duplicate ID.
- 594 article pages and 595 catalog/search identities.
- Local JavaScript syntax; deterministic package integrity and SHA256
  manifest. Prior simulated search/controller suites are historical
  checks, not fresh real-browser acceptance.

## Not yet claimed

- Real desktop/mobile web-browser acceptance of this RC.
- Retail EDF runtime correctness of every described interpretation.
- Exhaustive verification of every source and external web link.
- A license or permission to redistribute externally authored original
  datasets, binaries, images or tool source.

## Release disposition

**Review candidate — not live.** Publication remains conditional on the
short smoke checklist, final credits/reuse review and explicit owner
approval for the public repository or host.
