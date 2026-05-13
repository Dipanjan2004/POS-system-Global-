# POS Awesome — Backend

Frappe / ERPNext v14 app. Provides the Python API, custom doctypes (POS Opening Shift, POS Closing Shift, etc.), and document-event hooks that the React frontend calls into.

This folder is a regular Frappe app — it cannot run on its own. It needs a Frappe **bench** with ERPNext installed (Linux / macOS / WSL2).

## Install (assumes a working bench)

```bash
# from your bench root:
bench get-app posawesome /path/to/POS-Awesome/backend
bench setup requirements
bench --site <your-site> install-app posawesome
bench --site <your-site> migrate
bench restart
```

To serve the React UI under `/app/posapp`, build the frontend first (see `../frontend/README.md`) and copy `dist/` into `posawesome/public/js/`.

## Layout

```
backend/
├── setup.py / requirements.txt / MANIFEST.in       packaging
└── posawesome/                                     ← Frappe app folder
    ├── hooks.py                                    doc_events, fixtures, includes
    ├── modules.txt, patches.txt, uninstall.py      Frappe wiring
    │
    ├── config/         desk + workspace menu
    ├── fixtures/       custom_field.json, property_setter.json
    ├── templates/      empty placeholder
    ├── translations/   pt.csv
    │
    └── posawesome/     ← module folder
        ├── api/        whitelisted Python endpoints (posapp.py, invoice.py, etc.)
        ├── doctype/    5 shift doctypes + sales_invoice_reference
        ├── page/       Frappe page that hosts the SPA
        └── workspace/  workspace JSON
```

## Key endpoints (`posawesome.posawesome.api.posapp.*`)

| Endpoint | Purpose |
|---|---|
| `check_opening_shift(user)` | Find an open shift for this user |
| `create_opening_voucher(...)` | Create + submit a POS Opening Shift |
| `get_items(...)` | Item grid with prices, stock, batches |
| `get_items_from_barcode(...)` | Barcode lookup |
| `get_customer_names(pos_profile)` | Customer picker data |
| `create_customer(...)` / `set_customer_info(...)` | Create/update customer from POS |
| `update_invoice(data)` | Save in-progress cart as draft Sales Invoice |
| `submit_invoice(invoice, data)` | Final submit (sync or background) |
| `get_draft_invoices(opening_shift)` | Held invoices |
| `search_invoices_for_return(...)` | Return-invoice picker |

See the project root `README.md` for the full endpoint list and architecture.
