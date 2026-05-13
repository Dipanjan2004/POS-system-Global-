import { Undo2 } from 'lucide-react';
import Modal from './Modal';
import { currency, formatDate } from '../utils/format';

export default function ReturnsDialog({ invoices, onReturn, onClose }) {
  return (
    <Modal title="Return an Invoice" onClose={onClose} size="lg">
      <div className="p-4">
        {invoices.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">
            No submitted invoices yet. Complete a sale first.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {invoices.map((inv) => (
              <li key={inv.id} className="p-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{inv.id}</span>
                    <span className="text-[11px] text-slate-400">
                      · {formatDate(inv.submittedAt)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {inv.customer.name} · {inv.lines.length} item
                    {inv.lines.length !== 1 ? 's' : ''} · {currency(inv.totals.grandTotal)}
                  </div>
                </div>
                <button
                  onClick={() => onReturn(inv.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 inline-flex items-center gap-1.5"
                >
                  <Undo2 size={14} /> Return
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-slate-400">
          Returning an invoice loads its items into the cart with negative quantities. Process the
          refund via the normal payment flow.
        </p>
      </div>
    </Modal>
  );
}
