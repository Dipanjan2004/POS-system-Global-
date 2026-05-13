import { useState, useMemo } from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import { paymentModes } from '../data/mockData';
import { currency, formatDate } from '../utils/format';

export default function ClosingDialog({ shift, invoices, onSubmit, onClose }) {
  const expectedByMode = useMemo(() => {
    const map = {};
    paymentModes.forEach((m) => (map[m.label] = 0));
    invoices.forEach((inv) => {
      inv.payments.forEach((p) => {
        if (map[p.mode] !== undefined) map[p.mode] += p.amount;
      });
    });
    // Cash also includes the opening float and minus change given.
    map['Cash'] = (map['Cash'] || 0) + shift.openingBalance;
    invoices.forEach((inv) => {
      map['Cash'] -= inv.change || 0;
    });
    return map;
  }, [invoices, shift.openingBalance]);

  const [counted, setCounted] = useState(() =>
    paymentModes.reduce((acc, m) => ({ ...acc, [m.label]: '' }), {})
  );

  const grossSales = invoices.reduce((s, i) => s + i.totals.grandTotal, 0);
  const totalExpected = paymentModes.reduce((s, m) => s + (expectedByMode[m.label] || 0), 0);

  return (
    <Modal
      title="Close POS Shift"
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 inline-flex items-center gap-2"
          >
            <LogOut size={16} /> Submit & Close Shift
          </button>
        </div>
      }
    >
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Shift" value={shift.profile} />
          <Stat label="Opened" value={formatDate(shift.openedAt)} />
          <Stat label="Invoices" value={String(invoices.length)} />
          <Stat label="Gross Sales" value={currency(grossSales)} highlight />
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left py-2 px-3 font-medium">Payment Mode</th>
                <th className="text-right py-2 px-3 font-medium">Expected</th>
                <th className="text-right py-2 px-3 font-medium">Counted</th>
                <th className="text-right py-2 px-3 font-medium">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paymentModes.map((m) => {
                const expected = expectedByMode[m.label] || 0;
                const countedVal = parseFloat(counted[m.label]) || 0;
                const diff = countedVal - expected;
                return (
                  <tr key={m.id}>
                    <td className="py-2 px-3 font-medium text-slate-900">{m.label}</td>
                    <td className="py-2 px-3 text-right text-slate-700">
                      {currency(expected)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={counted[m.label]}
                        onChange={(e) =>
                          setCounted({ ...counted, [m.label]: e.target.value })
                        }
                        className="w-28 px-2 py-1 rounded border border-slate-300 text-right"
                      />
                    </td>
                    <td
                      className={`py-2 px-3 text-right font-medium ${
                        diff === 0
                          ? 'text-slate-400'
                          : diff > 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {counted[m.label] ? currency(diff) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 font-semibold text-slate-900">
              <tr>
                <td className="py-2 px-3">Total</td>
                <td className="py-2 px-3 text-right">{currency(totalExpected)}</td>
                <td colSpan="2" />
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex items-start gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />
          Closing a shift clears all in-progress drafts and totals. Print receipts before closing.
        </div>
      </div>
    </Modal>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        highlight ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="text-xs text-slate-500">{label}</div>
      <div
        className={`text-lg font-bold mt-0.5 ${
          highlight ? 'text-brand-700' : 'text-slate-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
