# Demo contract

Open `https://event-payload-spillway.sociobot.in/demo` or `/?demo=1`.

The demo seeds a `render.complete` webhook with a data-URI image attachment.
It runs the spill before the page is shown as ready.
The result displays the encrypted reference, inline byte count, avoided percentage, and restore action.

The yellow banner says `Demo — sample data, nothing is saved`.
`Reset demo` restores all sample input values and reruns the seed.
`Start for real` returns to the landing page.

The demo uses a fresh `MemoryStore` and fresh Web Crypto keys per run.
It uses no localStorage, sessionStorage, IndexedDB, OPFS, cookies, or backend tenant.
No real storage namespace is read or written; any real application namespace remains isolated.
Refreshing discards demo data.
