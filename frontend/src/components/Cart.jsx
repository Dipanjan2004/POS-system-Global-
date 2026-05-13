import { User, Plus, Minus, Trash2, Percent, StickyNote, PauseCircle, CreditCard } from 'lucide-react';
import { currency } from '../utils/format';

export default function Cart({ pos, onPickCustomer, onPay, showPayButton }) {
  const { state, totals, updateLine, removeLine, setInvoiceDiscount, setNotes, holdInvoice, clearCart } = pos;
  const empty = state.lines.length === 0;

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="p-3 border-b border-slate-200">
        <button
          onClick={onPickCustomer}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition text-left"
        >
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center">
            <User size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">
              {state.customer.name}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {state.customer.mobile || 'Tap to change customer'}
            </div>
          </div>
          <span className="text-xs text-brand-600 font-medium">Change</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {empty ? (
          <div className="h-full grid place-items-center text-slate-400 text-sm p-6 text-center">
            <div>
              <div className="text-5xl mb-2">🛒</div>
              <div>Cart is empty. Click items on the left to begin.</div>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {state.lines.map((l) => {
              const lineTotal = l.qty * l.price * (1 - (l.discount || 0) / 100);
              return (
                <li key={l.id} className="px-3 py-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900">{l.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {l.code} · {currency(l.price)} ea
                      </div>
                    </div>
                    <button
                      onClick={() => removeLine(l.id)}
                      className="text-slate-400 hover:text-red-600"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateLine(l.id, { qty: l.qty - 1 })}
                        className="px-2 py-1 hover:bg-slate-100"
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        value={l.qty}
                        onChange={(e) =>
                          updateLine(l.id, { qty: parseFloat(e.target.value) || 0 })
                        }
                        className="w-14 text-center py-1 text-sm focus:outline-none"
                      />
                      <button
                        onClick={() => updateLine(l.id, { qty: l.qty + 1 })}
                        className="px-2 py-1 hover:bg-slate-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={l.discount || 0}
                        onChange={(e) =>
                          updateLine(l.id, { discount: parseFloat(e.target.value) || 0 })
                        }
                        className="w-16 pr-5 pl-2 py-1 text-sm rounded-lg border border-slate-200"
                      />
                      <Percent size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    <div className="flex-1 text-right text-sm font-semibold text-slate-900">
                      {currency(lineTotal)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-slate-200 p-3 space-y-2 bg-slate-50">
        <div className="flex items-center gap-2">
          <StickyNote size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Add a note…"
            value={state.notes}
            onChange={(e) => setNotes(e.target.value)}
            className="flex-1 px-2 py-1 text-sm rounded border border-slate-200 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Percent size={14} className="text-slate-400 shrink-0" />
          <label className="text-sm text-slate-600">Invoice discount</label>
          <input
            type="number"
            min="0"
            max="100"
            value={state.invoiceDiscount}
            onChange={(e) => setInvoiceDiscount(parseFloat(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-sm rounded border border-slate-200 bg-white"
          />
          <span className="text-sm text-slate-500">%</span>
        </div>

        <div className="pt-2 border-t border-slate-200 space-y-1 text-sm">
          <Row label="Subtotal" value={currency(totals.subtotal)} />
          {totals.invoiceDiscountAmount > 0 && (
            <Row
              label={`Discount (${state.invoiceDiscount}%)`}
              value={`- ${currency(totals.invoiceDiscountAmount)}`}
              negative
            />
          )}
          <Row label="Tax (5%)" value={currency(totals.tax)} />
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-200">
            <span className="font-semibold text-slate-900">Grand Total</span>
            <span className="text-xl font-bold text-brand-700">
              {currency(totals.grandTotal)}
            </span>
          </div>
          <div className="text-xs text-slate-500 text-right">
            {totals.totalQty} item{totals.totalQty !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={clearCart}
            disabled={empty}
            className="py-2 rounded-lg bg-white border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <button
            onClick={holdInvoice}
            disabled={empty}
            className="py-2 rounded-lg bg-amber-100 border border-amber-200 text-amber-800 text-sm font-medium hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5"
          >
            <PauseCircle size={15} /> Hold
          </button>
          {showPayButton && (
            <button
              onClick={onPay}
              disabled={empty}
              className="py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5"
            >
              <CreditCard size={15} /> Pay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, negative }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={negative ? 'text-rose-600' : 'text-slate-900'}>{value}</span>
    </div>
  );
}
