import { Trash2, RotateCcw } from 'lucide-react';
import Modal from './Modal';
import { currency, formatDate } from '../utils/format';
import { calcTotals } from '../hooks/usePOS';

export default function DraftsDialog({ drafts, onRestore, onDelete, onClose }) {
  return (
    <Modal title={`Held Drafts (${drafts.length})`} onClose={onClose} size="lg">
      <div className="p-4">
        {drafts.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">
            No held invoices. Use the <b>Hold</b> button in the cart to park one for later.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {drafts.map((d) => {
              const t = calcTotals(d.lines, d.invoiceDiscount);
              return (
                <li key={d.id} className="p-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {d.customer.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        · {formatDate(d.heldAt)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {d.lines.length} item{d.lines.length !== 1 ? 's' : ''} · {currency(t.grandTotal)}
                    </div>
                    {d.notes && (
                      <div className="text-xs text-slate-500 italic mt-1">
                        “{d.notes}”
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onRestore(d.id)}
                    className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 inline-flex items-center gap-1.5"
                  >
                    <RotateCcw size={14} /> Restore
                  </button>
                  <button
                    onClick={() => onDelete(d.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Modal>
  );
}
