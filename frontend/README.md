# POS Awesome — React Frontend

Standalone React + Vite POS UI. Runs entirely in the browser with mock data; no Frappe backend required to try it out.

## Quick start

```bash
cd frontend
npm install
npm run dev
```

Opens at http://localhost:5173.

## Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** for styling
- **lucide-react** for icons
- State via `useReducer` (no external state lib)

## File map

```
frontend/
├── index.html
├── package.json / vite.config.js / tailwind.config.js / postcss.config.js
└── src/
    ├── main.jsx                Vite entry
    ├── App.jsx                 top-level layout + dialog state
    ├── index.css               Tailwind directives + print rules
    ├── data/mockData.js        items, customers, payment modes, tax rate
    ├── utils/format.js         currency + date helpers
    ├── hooks/usePOS.js         single reducer with all cart logic
    └── components/
        ├── Navbar.jsx
        ├── OpeningDialog.jsx   open shift (login screen)
        ├── ClosingDialog.jsx   close shift + reconciliation
        ├── ItemsGrid.jsx       search/barcode/category, grid & list views
        ├── Cart.jsx            line items, qty, discounts, totals
        ├── CustomerDialog.jsx  select / create customer
        ├── PaymentScreen.jsx   multi-mode payment + change calc
        ├── DraftsDialog.jsx    held invoices
        ├── ReturnsDialog.jsx   pick an invoice to return
        ├── Receipt.jsx         print-only DOM
        └── Modal.jsx           shared dialog shell
```

## Features

- Open / close shift with cash reconciliation
- Item grid with search, barcode scan input, category filter, grid/list views
- Cart with qty +/-, per-line discount, invoice discount, notes
- Customer picker with quick-add
- Hold / restore drafts
- Multi-mode payment (Cash, Card, UPI, Wallet) with quick-cash buttons and change calc
- Returns against past invoices (loads as negative-qty lines)
- Print-friendly receipt
- Keyboard shortcuts: `Ctrl+S` open payment, `Ctrl+D` remove top item

## Wiring to the real Frappe backend

The mock data layer is isolated to `src/data/mockData.js`. To connect to the Frappe API instead:

1. Replace `mockData.js` exports with `fetch`/`frappe.call(...)` calls to the whitelisted endpoints in `backend/posawesome/posawesome/api/posapp.py` (see the main README for the endpoint list).
2. Build with `npm run build` (outputs to `dist/`).
3. Copy `dist/` into `backend/posawesome/public/js/` and wire it into `backend/posawesome/hooks.py → app_include_js`.

## Production build

```bash
npm run build
npm run preview   # serve dist/ locally
```
