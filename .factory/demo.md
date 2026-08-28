# Demo contract

Open `https://event-payload-spillway.sociobot.in/demo` or `/?demo=1`.

The demo seeds a `render.complete` webhook with a valid PNG data-URI attachment derived from the project's original spillway art.
It runs the spill before the page is shown as ready.
The sample's database row stays below 10% of its original serialized size.
The result displays the encrypted reference, inline byte count, avoided percentage, and restore action.

The yellow banner says `Demo — sample data, nothing is saved`.
`Reset demo` restores all sample input values and reruns the seed.
`Leave demo` returns to the landing page.

The demo uses a fresh `MemoryStore` and fresh Web Crypto keys per run.
It writes no payload data to localStorage, sessionStorage, IndexedDB, OPFS, cookies, CacheStorage, or a backend tenant.
No real storage namespace is read or written; any real application namespace remains isolated.
Refreshing discards demo data.
