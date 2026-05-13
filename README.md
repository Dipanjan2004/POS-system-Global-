# POS Awesome (Core Build)

A stripped-down Point of Sale application for **ERPNext v14**, reorganised into two clean folders:

```
POS-Awesome/
├── frontend/    React 18 + Vite + Tailwind SPA (runs standalone with mock data)
└── backend/     Frappe / ERPNext Python app (custom doctypes, API, hooks)
```

This is the *core POS only* version: every optional feature (loyalty, coupons, offers, M-Pesa, referrals, delivery charges, sales-order conversion, payment reconciliation, credit sales) has been removed so the sales flow is easier to read, maintain, and extend.

The React frontend ships with mock data and runs without any server — `cd frontend && npm install && npm run dev` opens a working POS at http://localhost:5173. See `frontend/README.md` for details.

---

## 1. What this app does

It replaces ERPNext's built-in POS page with a faster, friendlier touch / keyboard interface that lives at `/app/posapp`. The full session looks like:

1. Cashier signs in and opens a **POS Opening Shift** (counts cash drawer).
2. Items are searched (text, barcode, batch no., serial no.) and added to a cart-style invoice.
3. Customer is selected or created on the fly.
4. Cashier collects payment (any number of payment modes), receipt is printed.
5. The **Sales Invoice** is submitted (synchronously or via a background job).
6. At end of day the cashier opens a **POS Closing Shift**, reconciles taxes and cash, and submits.
7. Returns can be done at any time against an existing invoice.

---

## 2. Architecture in 30 seconds

```
┌────────────────────────────────────────────────────────────┐
│  Browser  http://localhost:5173  (or /app/posapp)          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 18 + Vite + Tailwind SPA                      │  │
│  │  App.jsx ─┬─ ItemsGrid.jsx        (search / add)     │  │
│  │           ├─ Cart.jsx             (line items)       │  │
│  │           ├─ CustomerDialog.jsx   (select / create)  │  │
│  │           ├─ PaymentScreen.jsx    (multi-mode pay)   │  │
│  │           ├─ OpeningDialog.jsx                       │  │
│  │           ├─ ClosingDialog.jsx                       │  │
│  │           ├─ DraftsDialog.jsx / ReturnsDialog.jsx    │  │
│  │           └─ Receipt.jsx          (print-only DOM)   │  │
│  │  State: a single useReducer in hooks/usePOS.js       │  │
│  └──────────────────────────────────────────────────────┘  │
│              │ frappe.call(...)                            │
└──────────────┼─────────────────────────────────────────────┘
               ▼
┌────────────────────────────────────────────────────────────┐
│  backend/  — Frappe / ERPNext server (Python)              │
│   posawesome/posawesome/api/posapp.py   ← whitelisted API  │
│   posawesome/posawesome/api/invoice.py  ← Sales Invoice    │
│   posawesome/posawesome/api/customer.py    hooks           │
│                                                            │
│   Custom doctypes:                                         │
│     POS Opening Shift / Detail                             │
│     POS Closing Shift / Detail / Taxes                     │
│     Sales Invoice Reference (child)                        │
│                                                            │
│   Reuses ERPNext core: Sales Invoice, Customer, Item,      │
│   Item Price, Batch, Serial No, Payment Entry, etc.        │
└────────────────────────────────────────────────────────────┘
```

The frontend is a standalone Vite project that renders the entire POS UI from mock data. The backend is a Frappe app that, when running, exposes the same endpoints the frontend would call once you wire them up.

---

## 3. Directory map (every file that ships)

```
POS-Awesome/
├── README.md                ← you are here
├── license.txt              GPLv3
│
├── frontend/                              ← React 18 + Vite SPA
│   ├── package.json / vite.config.js
│   ├── tailwind.config.js / postcss.config.js
│   ├── index.html                          Vite entry HTML
│   ├── README.md                           frontend-specific docs
│   └── src/
│       ├── main.jsx                        React entry
│       ├── App.jsx                         shell: opening dialog / items+cart / payment
│       ├── index.css                       Tailwind + @media print rules
│       ├── data/mockData.js                items, customers, payment modes, tax rate
│       ├── utils/format.js                 currency + date helpers
│       ├── hooks/usePOS.js                 single reducer with all cart logic
│       └── components/
│           ├── Navbar.jsx
│           ├── OpeningDialog.jsx           open shift screen
│           ├── ClosingDialog.jsx           close shift + cash reconciliation
│           ├── ItemsGrid.jsx               search, barcode, category, grid/list view
│           ├── Cart.jsx                    line items, qty, discounts, totals
│           ├── CustomerDialog.jsx          select / quick-add customer
│           ├── PaymentScreen.jsx           multi-mode payment + change calc
│           ├── DraftsDialog.jsx            held invoices
│           ├── ReturnsDialog.jsx           pick an invoice to return
│           ├── Receipt.jsx                 print-only receipt DOM
│           └── Modal.jsx                   shared dialog shell
│
└── backend/                               ← Frappe / ERPNext Python app
    ├── setup.py                            Python packaging metadata
    ├── requirements.txt                    Python deps (just "frappe")
    ├── MANIFEST.in                         Python sdist manifest
    └── posawesome/                         ← the Frappe app folder
        ├── __init__.py                     app version
        ├── hooks.py                        *** Frappe wiring ***
        ├── modules.txt                     single module: "POSAwesome"
        ├── patches.txt                     DB migrations (empty)
        ├── uninstall.py                    cleanup on uninstall
        │
        ├── config/
        │   ├── desktop.py                  desk sidebar item
        │   ├── docs.py                     docs config
        │   └── pos_awesome.py              workspace menu items
        │
        ├── fixtures/
        │   ├── custom_field.json           custom fields added to ERPNext
        │   └── property_setter.json        property overrides
        │
        ├── templates/                      (empty placeholder)
        ├── translations/pt.csv             Portuguese strings
        │
        └── posawesome/                     ← the module folder
            ├── api/                        *** Python API layer ***
            │   ├── posapp.py               ~1400 LoC: every whitelisted endpoint
            │   ├── invoice.py              Sales Invoice doc_events
            │   ├── customer.py             Customer doc_events (no-ops in core build)
            │   ├── status_updater.py       base class for shift status
            │   ├── taxes.py                custom tax calculation helper
            │   ├── company.js              client-script for Company
            │   ├── invoice.js              client-script for Sales Invoice
            │   └── pos_profile.js          client-script for POS Profile
            │
            ├── doctype/                    *** custom doctypes ***
            │   ├── pos_opening_shift/        parent: opens the till
            │   ├── pos_opening_shift_detail/ child: cash/card balances on open
            │   ├── pos_closing_shift/        parent: closes the till + reconciles
            │   ├── pos_closing_shift_detail/ child: per-mode totals
            │   ├── pos_closing_shift_taxes/  child: per-tax totals
            │   └── sales_invoice_reference/  child: invoice link rows
            │
            ├── page/posapp/                *** the Frappe page host ***
            │   ├── posapp.json               page metadata
            │   ├── posapp.js                 page bootstrap
            │   └── onscan.js                 bundled barcode scanner
            │
            └── workspace/pos_awesome/      sidebar workspace definition
```

### Files most worth understanding

| File | Why it matters |
|---|---|
| `backend/posawesome/hooks.py` | The contract with Frappe. Declares doctype client scripts, **doc_events** (Sales Invoice `validate` / `before_submit` / `before_cancel`), and custom fields exported as fixtures. |
| `backend/posawesome/posawesome/api/posapp.py` | The whole backend API surface. Every frontend call into Frappe lands here. |
| `frontend/src/App.jsx` | The frontend orchestrator. Reading top-to-bottom shows the entire UI state machine in ~120 lines. |
| `frontend/src/hooks/usePOS.js` | One `useReducer` that holds the entire POS state (shift, cart, drafts, submitted invoices). |

---

## 4. Request flow for a single sale

```
[ItemsGrid.jsx]
    user searches / scans barcode / clicks an item card
    ──► dispatch({type:'ADD_ITEM', payload: item})  (mock mode)
    ──► OR frappe.call('posawesome.posawesome.api.posapp.get_items_from_barcode')
            └─► returns {item_code, rate, currency, ...}     (real backend)
    Cart.jsx re-renders with the new line

[Cart.jsx]
    user adjusts qty / discount, picks customer (CustomerDialog)
    when total is final, click PAY
    ──► App.jsx switches view from 'items' → 'payment'

[PaymentScreen.jsx]
    cashier enters cash/card amounts
    click SUBMIT
    ──► dispatch({type:'SUBMIT_INVOICE', payload: invoice})  (mock mode)
    ──► OR frappe.call('posawesome.posawesome.api.posapp.submit_invoice', invoice, data)
            ├─ apply auto-batch if configured
            ├─ save with posa_is_printed = 1
            └─ submit() now OR enqueue submit_in_background_job
                  └─ doc_events fire:
                      invoice.validate  → validate_shift, set_patient
                      (before_submit / before_cancel are no-ops in core build)

window.print() renders Receipt.jsx via the @media print rule in index.css
```

---

## 5. Install / run

### Option A — Standalone frontend only (no backend)

Quickest way to see the UI. Mock data, runs in any browser.

```bash
cd frontend
npm install
npm run dev          # opens http://localhost:5173
```

### Option B — Full Frappe + ERPNext install

Prereqs: a working **Frappe + ERPNext v14** bench (Linux / macOS / WSL2).

```bash
# 1. build the React frontend
cd frontend
npm install
npm run build        # outputs to frontend/dist/

# 2. copy the build into the Frappe app's public dir so bench can serve it
mkdir -p ../backend/posawesome/public/js
cp -r dist/* ../backend/posawesome/public/js/

# 3. install the backend app into your bench
cd /path/to/your/bench
bench get-app posawesome /path/to/POS-Awesome/backend
bench setup requirements
bench --site <your-site> install-app posawesome
bench build --app posawesome
bench --site <your-site> migrate
bench restart
```

Open `http://<your-site>/app/posapp` while logged in as a user that has a **POS Profile** attached. Frappe will prompt you to open a shift; do so and you're in.

---

## 6. Configuration knobs (POS Profile fields)

These are added as custom fields by `fixtures/custom_field.json`. Set them on each POS Profile.

| Field | Effect |
|---|---|
| `posa_allow_delete` | Cashier can delete draft invoices |
| `posa_allow_user_to_edit_rate` | Allow editing line-item rate |
| `posa_allow_user_to_edit_item_discount` | Allow per-line discount |
| `posa_allow_user_to_edit_additional_discount` | Allow invoice-level discount |
| `posa_max_discount_allowed` | Cap on discount % |
| `posa_display_items_in_stock` | Filter out 0-stock items |
| `posa_allow_partial_payment` | Allow underpaid invoice |
| `posa_allow_return` | Show RETURN button |
| `posa_allow_submissions_in_background_job` | Enqueue submit() instead of running synchronously (faster perceived UX) |
| `posa_auto_set_batch` | Pick batch automatically using FIFO |
| `posa_search_serial_no` / `posa_search_batch_no` | Add Serial No / Batch No to the item-search input |
| `posa_cash_mode_of_payment` | Which MoP is treated as "cash" for change calculations |
| `posa_default_card_view` | Show items as cards (with images) instead of a list |
| `posa_show_template_items` / `posa_hide_variants_items` | Template/variant visibility |
| `posa_apply_customer_discount` | Auto-apply per-customer discount % |
| `posa_use_server_cache` + `posa_server_cache_duration` | Cache `get_items` response in Redis for N minutes |
| `pose_use_limit_search` + `posa_search_limit` | Cap item search results |
| `posa_tax_inclusive` | Show tax-inclusive prices |
| `posa_hide_closing_shift` | Hide Close Shift button (for restricted roles) |
| `posa_allow_print_last_invoice` | Show "Print Last Invoice" menu item |

Customer-level: `posa_discount` (percent) is auto-applied when `posa_apply_customer_discount` is on the profile.

---

## 7. Custom doctypes

### POS Opening Shift
Header for a cashier's session. Stores user, POS profile, company, opening balances (in child table `POS Opening Shift Detail`), and `status` (Draft / Open / Closed). Every Sales Invoice the cashier submits gets stamped with `posa_pos_opening_shift = <this name>`.

### POS Closing Shift
Closes a session. Aggregates per-mode-of-payment totals (`POS Closing Shift Detail`) and per-tax totals (`POS Closing Shift Taxes`). Use `make_closing_shift_from_opening(opening_shift)` (called from the UI) to pre-populate, then submit. The opening shift's status flips to **Closed**.

### Sales Invoice Reference
A child table used for linking invoices to other documents.

---

## 8. Sales Invoice lifecycle hooks

Defined in `hooks.py → doc_events`. All three are in `posawesome/posawesome/api/invoice.py`.

- **`validate`** runs on every save. In the core build it calls:
  - `validate_shift(doc)` — refuses save if `posa_pos_opening_shift` is set but the shift is not Open / belongs to a different profile or company.
  - `set_patient(doc)` — only fires if the company's domain is Healthcare; auto-links a Patient record.
- **`before_submit`** — no-op (was loyalty + sales-order creation in the original).
- **`before_cancel`** — no-op (was coupon counter rollback).

Customer hooks (`api/customer.py`) are also no-ops in the core build but remain wired so future extensions can plug in without touching `hooks.py`.

---

## 9. Public API surface (whitelisted endpoints)

Everything below is at `posawesome.posawesome.api.posapp.<name>` and callable from the Vue app via `frappe.call(...)`.

| Endpoint | Purpose |
|---|---|
| `get_opening_dialog_data` | List of companies + POS profiles for the open-shift modal |
| `create_opening_voucher(pos_profile, company, balance_details)` | Create + submit a POS Opening Shift |
| `check_opening_shift(user)` | Find an already-open shift for this user |
| `get_items(...)` | The big one: returns the item grid with prices, stock, batches |
| `get_items_groups` / `get_customer_names(pos_profile)` | Pickers |
| `get_items_details(pos_profile, items_data)` | Hydrate batch / serial / UOM detail for selected items |
| `get_item_detail(item, doc, warehouse, price_list)` | Same for a single item |
| `get_items_from_barcode(price_list, currency, barcode)` | Barcode lookup |
| `get_item_attributes(item_code)` | Variant attributes for the Variants dialog |
| `search_serial_or_batch_or_barcode_number(...)` | Combined number search |
| `update_invoice(data)` / `update_invoice_from_order(data)` | Save the in-progress cart as a draft Sales Invoice |
| `submit_invoice(invoice, data)` | Final submit (sync or background) |
| `get_draft_invoices(pos_opening_shift)` | List held invoices for the current shift |
| `delete_invoice(invoice)` | Discard a draft |
| `search_invoices_for_return(invoice_name, company)` | Picker for returns |
| `search_orders(company, currency, order_name)` | Sales-order picker |
| `delete_sales_invoice` / `get_sales_invoice_child_table` | Misc helpers |
| `create_customer(...)` / `set_customer_info(...)` | Customer create/update from POS |
| `get_customer_info(customer)` | Hydrate customer card |
| `get_customer_addresses(customer)` / `make_address(args)` | Address management |
| `create_payment_request(doc)` | Hook for online-payment gateways (kept for completeness) |

---

## 10. Frontend conventions

- **State** lives in a single `useReducer` exposed by `hooks/usePOS.js`. There is no Redux / Zustand / Context — the reducer is passed down as a `pos` prop.
- **Styling** is Tailwind CSS, configured in `tailwind.config.js`. Use utility classes; avoid bespoke CSS files unless necessary (only `index.css` exists, for global + print rules).
- **Icons** are from `lucide-react`.
- **Mock data** is isolated in `src/data/mockData.js` so swapping to real Frappe `frappe.call(...)` endpoints is a single-file change.
- **No barcode hardware integration** in the standalone build — the search input doubles as a barcode field when "barcode mode" is toggled. Wire up `onScan.js` if you need keyboard-wedge scanners.

---

## 11. Keyboard shortcuts

| Key | Action |
|---|---|
| `Ctrl/Cmd + S` | Open Payments |
| `Ctrl/Cmd + D` | Remove top item from cart |
| `Esc` | Close any open modal |

---

## 12. What was removed from upstream (and why)

To keep the codebase small and the sales flow obvious, every optional feature shipped by upstream POS-Awesome has been deleted:

| Removed feature | Files deleted |
|---|---|
| M-Pesa mobile payment | `api/m_pesa.py`, `doctype/mpesa_c2b_register_url/`, `doctype/mpesa_payment_register/`, `components/pos/Mpesa-Payments.vue` |
| Loyalty points | logic inside `invoice.py` + custom fields |
| POS Coupons | `doctype/pos_coupon/`, `doctype/pos_coupon_detail/`, `components/pos/PosCoupons.vue` |
| POS Offers | `doctype/pos_offer/`, `doctype/pos_offer_detail/`, `components/pos/PosOffers.vue` |
| Referral codes | `doctype/referral_code/` + customer hooks |
| Delivery charges | `doctype/delivery_charges/`, `doctype/delivery_charges_pos_profile/` |
| Sales Order creation from POS | `components/pos/SalesOrders.vue` + invoice logic |
| Payment reconciliation against outstanding invoices | `api/payment_entry.py`, `doctype/pos_payment_entry_reference/`, `components/payments/Pay.vue` |
| Customer credit / cashback | logic inside `posapp.py` (`redeeming_customer_credit`, `get_available_credit`) |

If you need any of these features back, restore them from the upstream repository at https://github.com/yrestom/POS-Awesome.

---

## 13. License

GPL v3 — see `license.txt`.
