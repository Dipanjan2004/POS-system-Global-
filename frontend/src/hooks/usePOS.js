import { useReducer, useCallback, useMemo } from 'react';
import { taxRate, customers, items as catalog, defaultSettings } from '../data/mockData';

const walkIn = customers[0];

const initialStock = catalog.reduce((acc, it) => {
  acc[it.id] = it.stock;
  return acc;
}, {});

const initialState = {
  shift: null,             // { id, openedAt, openingBalance, profile }
  customer: walkIn,
  lines: [],               // { id, itemId, name, code, price, qty, discount }
  invoiceDiscount: 0,      // percent
  notes: '',
  drafts: [],              // held invoices
  submittedInvoices: [],   // completed invoices for the day
  lastInvoice: null,
  settings: { ...defaultSettings },
  stock: { ...initialStock },
};

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN_SHIFT':
      return { ...state, shift: action.payload };

    case 'CLOSE_SHIFT':
      return { ...initialState, settings: state.settings };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'SET_CUSTOMER': {
      const c = action.payload;
      const apply = state.settings.applyCustomerDiscount && c?.discount > 0;
      return {
        ...state,
        customer: c,
        invoiceDiscount: apply ? c.discount : state.invoiceDiscount,
      };
    }

    case 'ADD_ITEM': {
      const item = action.payload;
      const existing = state.lines.find((l) => l.itemId === item.id);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.itemId === item.id ? { ...l, qty: l.qty + 1 } : l
          ),
        };
      }
      return {
        ...state,
        lines: [
          ...state.lines,
          {
            id: `LN-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            itemId: item.id,
            name: item.name,
            code: item.code,
            price: item.price,
            qty: 1,
            discount: 0,
          },
        ],
      };
    }

    case 'UPDATE_LINE':
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.id === action.payload.id ? { ...l, ...action.payload.patch } : l
        ),
      };

    case 'REMOVE_LINE':
      return { ...state, lines: state.lines.filter((l) => l.id !== action.payload) };

    case 'SET_INVOICE_DISCOUNT':
      return { ...state, invoiceDiscount: action.payload };

    case 'SET_NOTES':
      return { ...state, notes: action.payload };

    case 'HOLD_INVOICE': {
      if (state.lines.length === 0) return state;
      const draft = {
        id: `DRAFT-${Date.now()}`,
        customer: state.customer,
        lines: state.lines,
        invoiceDiscount: state.invoiceDiscount,
        notes: state.notes,
        heldAt: new Date().toISOString(),
      };
      return {
        ...state,
        drafts: [draft, ...state.drafts],
        customer: walkIn,
        lines: [],
        invoiceDiscount: 0,
        notes: '',
      };
    }

    case 'RESTORE_DRAFT': {
      const draft = state.drafts.find((d) => d.id === action.payload);
      if (!draft) return state;
      return {
        ...state,
        drafts: state.drafts.filter((d) => d.id !== action.payload),
        customer: draft.customer,
        lines: draft.lines,
        invoiceDiscount: draft.invoiceDiscount,
        notes: draft.notes,
      };
    }

    case 'DELETE_DRAFT':
      return { ...state, drafts: state.drafts.filter((d) => d.id !== action.payload) };

    case 'SUBMIT_INVOICE': {
      const invoice = action.payload;
      const nextStock = { ...state.stock };
      for (const l of invoice.lines) {
        if (nextStock[l.itemId] != null) {
          nextStock[l.itemId] = Math.max(0, nextStock[l.itemId] - l.qty);
        }
      }
      return {
        ...state,
        submittedInvoices: [invoice, ...state.submittedInvoices],
        lastInvoice: invoice,
        stock: nextStock,
        customer: walkIn,
        lines: [],
        invoiceDiscount: 0,
        notes: '',
      };
    }

    case 'RETURN_INVOICE': {
      const original = state.submittedInvoices.find((i) => i.id === action.payload);
      if (!original) return state;
      return {
        ...state,
        customer: original.customer,
        lines: original.lines.map((l) => ({ ...l, qty: -Math.abs(l.qty) })),
        invoiceDiscount: original.invoiceDiscount,
        notes: `Return against ${original.id}`,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        customer: walkIn,
        lines: [],
        invoiceDiscount: 0,
        notes: '',
      };

    default:
      return state;
  }
}

export function calcTotals(lines, invoiceDiscountPct) {
  const subtotal = lines.reduce((s, l) => {
    const lineTotal = l.qty * l.price * (1 - (l.discount || 0) / 100);
    return s + lineTotal;
  }, 0);
  const afterInvoiceDiscount = subtotal * (1 - (invoiceDiscountPct || 0) / 100);
  const tax = afterInvoiceDiscount * taxRate;
  const grandTotal = afterInvoiceDiscount + tax;
  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  return {
    subtotal,
    invoiceDiscountAmount: subtotal - afterInvoiceDiscount,
    tax,
    grandTotal,
    totalQty,
  };
}

export function usePOS() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openShift = useCallback((payload) => dispatch({ type: 'OPEN_SHIFT', payload }), []);
  const closeShift = useCallback(() => dispatch({ type: 'CLOSE_SHIFT' }), []);
  const setCustomer = useCallback((c) => dispatch({ type: 'SET_CUSTOMER', payload: c }), []);
  const addItem = useCallback((item) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
  const updateLine = useCallback(
    (id, patch) => dispatch({ type: 'UPDATE_LINE', payload: { id, patch } }),
    []
  );
  const removeLine = useCallback((id) => dispatch({ type: 'REMOVE_LINE', payload: id }), []);
  const setInvoiceDiscount = useCallback(
    (pct) => dispatch({ type: 'SET_INVOICE_DISCOUNT', payload: pct }),
    []
  );
  const setNotes = useCallback((notes) => dispatch({ type: 'SET_NOTES', payload: notes }), []);
  const holdInvoice = useCallback(() => dispatch({ type: 'HOLD_INVOICE' }), []);
  const restoreDraft = useCallback(
    (id) => dispatch({ type: 'RESTORE_DRAFT', payload: id }),
    []
  );
  const deleteDraft = useCallback(
    (id) => dispatch({ type: 'DELETE_DRAFT', payload: id }),
    []
  );
  const submitInvoice = useCallback(
    (invoice) => dispatch({ type: 'SUBMIT_INVOICE', payload: invoice }),
    []
  );
  const returnInvoice = useCallback(
    (id) => dispatch({ type: 'RETURN_INVOICE', payload: id }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const updateSettings = useCallback(
    (patch) => dispatch({ type: 'UPDATE_SETTINGS', payload: patch }),
    []
  );

  const totals = useMemo(
    () => calcTotals(state.lines, state.invoiceDiscount),
    [state.lines, state.invoiceDiscount]
  );

  const dayTotal = useMemo(
    () =>
      state.submittedInvoices.reduce(
        (s, inv) => s + (inv.totals?.grandTotal || 0),
        0
      ),
    [state.submittedInvoices]
  );

  return {
    state,
    totals,
    dayTotal,
    openShift,
    closeShift,
    setCustomer,
    addItem,
    updateLine,
    removeLine,
    setInvoiceDiscount,
    setNotes,
    holdInvoice,
    restoreDraft,
    deleteDraft,
    submitInvoice,
    returnInvoice,
    clearCart,
    updateSettings,
  };
}
