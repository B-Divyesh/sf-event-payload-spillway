# Copy audit — polish 5

Counting uses whitespace-delimited words. Hyphenated terms and API names count as one. Code samples are excluded.

## First screen

| Copy | Words | Result |
| --- | ---: | --- |
| Move oversized webhook fields out of your database | 8 | Headline, verb first |
| For self-hosting developers whose webhook or automation events sometimes carry large base64, media, or JSON values. | 16 | Audience and situation |
| This is an npm library. | 5 | Delivery form |
| Try it with sample data | 5 | Primary action |
| Opens a seeded sample with the spill result already shown. | 10 | Action result |
| Demo data stays in this tab | 6 | Privacy fact |
| Works offline after first visit | 5 | Offline fact |
| Free and MIT licensed | 4 | Price/license fact |

All eight items are visible before scrolling at 390×844 and 1440×900. The desktop secondary action says `Install from source`. The first screen contains no banned word.

## Catalog description

“Move selected oversized webhook fields into encrypted S3-compatible storage before they reach database rows.” is verb-first, 108 characters, and contains no banned word.

## Landing sentences

| ID | Words | Sentence | Claim evidence, if applicable |
| --- | ---: | --- | --- |
| L1 | 5 | Offline: the demo still works. | `offline-demo` |
| L2 | 7 | Site files are cached on this device. | `offline-demo` |
| L3 | 16 | For self-hosting developers whose webhook or automation events sometimes carry large base64, media, or JSON values. | — |
| L4 | 5 | This is an npm library. | `package-formats` |
| L5 | 10 | Opens a seeded sample with the spill result already shown. | `demo-seed` |
| L6 | 18 | Technical cutaway showing a large coral JSON block diverted from a conveyor into a locked teal storage reservoir. | Alt text |
| L7 | 9 | A selected large field moves to encrypted object storage. | `s3-compatibility` |
| L8 | 9 | Use the dedicated Demo for a seeded, isolated sample. | `demo-seed`, `demo-privacy` |
| L9 | 8 | Change the attachment, JSON Pointer, or byte limit. | — |
| L10 | 9 | Show the sample event to create a signed reference. | `reference-shape` |
| L11 | 6 | Only configured JSON Pointers are considered. | `allowlist` |
| L12 | 9 | An AES-256-GCM envelope is written through an S3-compatible adapter. | `crypto-format`, `s3-compatibility` |
| L13 | 10 | The reference records size, digest, field, redacted preview, and expiry. | `reference-shape` |
| L14 | 15 | Choose allowed fields, an inline limit, storage, encryption and signing keys, and a retention window. | `required-config` |
| L14a | 5 | Not yet published to npm. | `registry-availability` |
| L14b | 8 | Build its npm tarball from the source repository. | `package-formats` |
| L15 | 9 | Count encrypted and expired bytes for the configured prefix. | `retention` |
| L16 | 7 | Dry runs show expired candidates without deleting. | `retention` |
| L17 | 8 | Reclaim excludes objects marked with a legal hold. | `retention` |
| L18 | 3 | Verify signatures first. | `proxy-order` |
| L19 | 14 | The proxy requires a callback for untouched request bytes before it parses an event. | `proxy-order` |
| L20 | 6 | The Demo uses temporary browser memory. | `demo-privacy` |
| L21 | 6 | It sends no payload or telemetry. | `demo-privacy`, `no-telemetry` |
| L22 | 11 | Spillway is not a queue, CDN, malware scanner, or legal-retention service. | Scope statement |
| L23 | 7 | You configure production storage, keys, and retention. | Operator guidance |
| L24 | 7 | Encrypted overflow control for selected webhook fields. | `crypto-format`, `allowlist` |
| L25 | 5 | This is not valid JSON. | Error copy |
| L26 | 7 | Fix the highlighted payload and try again. | Error recovery |
| L27 | 11 | Enter a JSON Pointer that starts with /, such as /result/attachment. | Error recovery |
| L28 | 8 | Choose a byte limit of at least 128. | Error recovery |
| L29 | 9 | 1 oversized allowed field moved to an encrypted object. | `demo-seed` |
| L30 | 7 | Database row uses [inline] of [raw] bytes. | `inline-reduction` |
| L31 | 6 | No allowed field crossed the limit. | Boundary behavior |
| L32 | 4 | The event stays inline. | Boundary behavior |
| L33 | 4 | The spill decision failed. | Error copy |
| L34 | 5 | Check the configuration and retry. | Error recovery |
| L35 | 8 | Restored 1 field locally; recovered value is [size]. | `retrieval` |
| L36 | 3 | Restore failed: [error]. | Error copy |
| L37 | 2 | Restore failed. | Error copy |
| L38 | 4 | Run the sample again. | Error recovery |

Landing prose totals 310 words across 40 sentences: 7.8 words per sentence. No sentence exceeds 22 words. No banned marketing word appears.

## Headings, controls, and terminology

All controls name their result: `Try it with sample data`, `Install from source`, `Show spill result`, `Copy source install steps`, `Copy configuration`, `Copy proxy example`, `Restore original`, `Reset sample`, `Reset demo`, and `Leave demo`.

| Concept | Required term |
| --- | --- |
| Interactive try-out | Demo |
| Form inside the demo | Payload playground |
| Result panel | Spill result |
| Object left in the event | Signed reference |
| Object storage output | Encrypted object |
| Configured field selector | JSON Pointer |
| Distribution before registry publication | Source tarball |

## README wording recheck

| Copy | Words | Result |
| --- | ---: | --- |
| Version 0.1.0 is not yet published to the npm registry. | 10 | `registry-availability` checks the public npm registry. |
| Build its npm tarball from the source checkout. | 8 | Gives the current installation path. |
| Package tests build and install the source tarball in a fresh project. | 12 | Names the observable verification. |
| They run this example with ESM and Node 20. | 9 | Names the runtime and module format. |

There are no remaining wording flags from reviews 1, 2, 3, 4, or 5.
