# Mher Resin Studio — Frontend

React + Vite + Tailwind CSS frontend for the resin art shop project.

## How to run in VS Code

1. Unzip this folder and open it in VS Code.
2. Terminal → New Terminal, then:
   ```
   npm install
   npm run dev
   ```
3. Open the link shown (usually http://localhost:5173).

## Customer pages

Home, Products (search + category filter), Product detail (colour/text
customisation, wishlist heart), Cart, Checkout (shipping form, UBL/JazzCash
payment accounts, a required payment screenshot upload, and a Remove button on
every item right there at checkout in addition to the Cart page), Track order, Account (order history +
invoices), Wishlist, Contact, About. No login/register.

## Admin panel — `/admin`

- **Dashboard** — sales stat cards with trend arrows, Daily/Monthly/Yearly
  sales chart, order-status donut chart.
- **Products** — sidebar "Products" expands into a category list; click a
  category to filter. **Click any product row** to open an edit popup:
  title, category, price, stock, description, and photo (upload a file,
  auto-resized). Works on the 12 sample catalogue products too — edits show
  up on the customer site immediately. **Every row has a Delete button**,
  including sample products (soft-deleted, restorable from a note under the
  table). The "Add a product" form also has a photo upload field.
- **Orders** — every order placed at checkout, with custom instructions, the
  customer's **payment screenshot** (click to view full-size), and a status
  dropdown. Manually check the screenshot against your bank/JazzCash record
  before moving an order past "Pending" — this is a manual-verification flow,
  not an automatic payment gateway.
- **Promo Codes** — create and remove discount codes.

No password protection yet — a banner on every admin page says so.

## Branding

- Brand mark: `src/components/BrandMark.jsx` — a hand-drawn SVG seal (laurel
  leaves, monogram, ornament) + wordmark ("Noor / Resin Atelier"). No image
  file needed — edit this one file to change the name or colours everywhere
  (Navbar, Footer, admin sidebar, Home hero).
- Colour theme: warm ivory, deep charcoal ink, brass gold, bronze — see
  `tailwind.config.js` (`navy`, `sky`, `sky-light`, `royal`, `steel`, `paper`, `line`)
- Social links (Footer): WhatsApp (0328 6420747), Instagram, TikTok,
  Facebook, Google Maps — edit `src/components/Footer.jsx` to change them

## Data / storage (all local for now, pre-backend)

- `src/data/products.js` — the 12 sample products
- `src/data/productOverrides.js` — admin edits to sample products (price,
  photo, stock, deleted flag, etc.)
- `src/data/adminProducts.js` — brand-new products added from the admin panel
- `src/data/mergedProducts.js` — combines all of the above into the one
  product list used everywhere
- `src/data/orders.js` — placed orders + status updates
- `src/data/promoCodes.js` — promo codes

Each file has a comment marking where the real backend API call goes once
it exists.

## Notes

- Cart, wishlist, and order state persist in the browser (`localStorage`).
- `public/_redirects` (included) makes direct links like `/admin` work
  correctly when deployed to Netlify.
- Extra libraries beyond plain React: `react-router-dom` (navigation),
  `recharts` (admin charts), `lucide-react` (icons) — all install
  automatically with `npm install`.
