import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Banknote, CreditCard, Smartphone, Wallet, CheckCircle2, Printer, Receipt as ReceiptIcon } from 'lucide-react';
import { paymentModes } from '../data/mockData';
import { currency } from '../utils/format';

const icons = { Banknote, CreditCard, Smartphone, Wallet };

export default function PaymentScreen({ pos, onBack, onSubmitted }) {
  const { state, totals, submitInvoice } = pos;
  const { settings } = state;
  const grand = totals.grandTotal;

  const [submittedInvoice, setSubmittedInvoice] = useState(null);

  const [allocations, setAllocations] = useState(() =>
    paymentModes.reduce((acc, m, i) => {
      acc[m.id] = i === 0 ? grand : 0;
      return acc;
    }, {})
  );

  useEffect(() => {
    // If totals change while user is here, reset cash allocation to grand total.
    setAllocations((a) => ({ ...a, cash: grand - paymentModes.slice(1).reduce((s, m) => s + (a[m.id] || 0), 0) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grand]);

  const totalPaid = useMemo(
    () => paymentModes.reduce((s, m) => s + (parseFloat(allocations[m.id]) || 0), 0),
    [allocations]
  );

  const change = totalPaid - grand;
  const outstanding = Math.max(0, grand - totalPaid);
  const canSubmit =
    state.lines.length > 0 &&
    (totalPaid >= grand || (settings.allowPartial && totalPaid > 0));

  function setAmount(id, v) {
    setAllocations({ ...allocations, [id]: parseFloat(v) || 0 });
  }

  function quickPay(amount) {
    setAllocations({ ...paymentModes.reduce((a, m) => ({ ...a, [m.id]: 0 }), {}), cash: amount });
  }

  function submit() {
    if (!canSubmit) return;
    const invoice = {
      id: `INV-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      customer: state.customer,
      lines: state.lines,
      invoiceDiscount: state.invoiceDiscount,
      notes: state.notes,
      totals,
      payments: paymentModes
        .map((m) => ({ mode: m.label, amount: parseFloat(allocations[m.id]) || 0 }))
        .filter((p) => p.amount > 0),
      change: Math.max(0, change),
      outstanding,
    };
    submitInvoice(invoice);
    setSubmittedInvoice(invoice);
  }

  function finishSale() {
    setSubmittedInvoice(null);
    onSubmitted();
  }

  if (submittedInvoice) {
    return (
      <SuccessScreen
        invoice={submittedInvoice}
        onPrint={() => window.print()}
        onDone={finishSale}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="p-3 border-b border-slate-200 flex items-center gap-3">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h2 className="text-lg font-semibold text-slate-900">Collect Payment</h2>
        <div className="flex-1" />
        <div className="text-right">
          <div className="text-xs text-slate-500">Amount due</div>
          <div className="text-2xl font-bold text-brand-700">{currency(grand)}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[grand, Math.ceil(grand / 5) * 5, Math.ceil(grand / 10) * 10, Math.ceil(grand / 20) * 20].map(
            (q, i) => (
              <button
                key={i}
                onClick={() => quickPay(q)}
                className="py-3 rounded-xl border border-slate-200 bg-slate-50 hover:border-brand-500 hover:bg-brand-50 text-center"
              >
                <div className="text-xs text-slate-500">Cash</div>
                <div className="text-lg font-bold text-slate-900">{currency(q)}</div>
              </button>
            )
          )}
        </div>

        <div className="space-y-2">
          {paymentModes.map((m) => {
            const Icon = icons[m.icon];
            const amount = allocations[m.id] || 0;
            return (
              <div
                key={m.id}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  amount > 0 ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg grid place-items-center ${
                    amount > 0 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 font-medium text-slate-900">{m.label}</div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={allocations[m.id] || ''}
                    onChange={(e) => setAmount(m.id, e.target.value)}
                    placeholder="0.00"
                    className="w-32 pl-7 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-right focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">
              Amount due {settings.taxInclusive && <span className="text-[11px] text-slate-400">(incl. tax)</span>}
            </span>
            <span className="font-semibold">{currency(grand)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Total tendered</span>
            <span className="font-semibold">{currency(totalPaid)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="font-semibold text-slate-900">
              {change >= 0 ? 'Change' : settings.allowPartial ? 'Outstanding (partial)' : 'Outstanding'}
            </span>
            <span
              className={`text-xl font-bold ${
                change >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {currency(Math.abs(change))}
            </span>
          </div>
          {settings.allowPartial && change < 0 && (
            <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 mt-2">
              Partial payment enabled — invoice will submit with an outstanding balance.
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-slate-200 bg-white">
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={20} />
          Submit Payment
          <span className="opacity-75 text-sm">
            (<kbd className="bg-white/20 px-1.5 rounded">Ctrl+X</kbd>)
          </span>
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({ invoice, onPrint, onDone }) {
  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-100 grid place-items-center mb-4 animate-[pulse_1.5s_ease-in-out_1]">
          <CheckCircle2 size={64} className="text-emerald-600" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Payment Successful</h2>
        <p className="text-slate-500 mb-6">Invoice {invoice.id}</p>

        <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Customer</span>
            <span className="font-medium text-slate-900">{invoice.customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Total paid</span>
            <span className="font-medium text-slate-900">{currency(invoice.totals.grandTotal)}</span>
          </div>
          {invoice.payments.map((p, i) => (
            <div key={i} className="flex justify-between text-xs text-slate-500">
              <span>{p.mode}</span>
              <span>{currency(p.amount)}</span>
            </div>
          ))}
          {invoice.change > 0 && (
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-900">Change due</span>
              <span className="font-bold text-emerald-600">{currency(invoice.change)}</span>
            </div>
          )}
          {invoice.outstanding > 0 && (
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-900">Outstanding</span>
              <span className="font-bold text-amber-700">{currency(invoice.outstanding)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-slate-200 bg-white grid grid-cols-2 gap-2">
        <button
          onClick={onPrint}
          className="py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 inline-flex items-center justify-center gap-2"
        >
          <Printer size={18} />
          Print Receipt
        </button>
        <button
          onClick={onDone}
          className="py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 inline-flex items-center justify-center gap-2"
        >
          <ReceiptIcon size={18} />
          New Sale
        </button>
      </div>
    </div>
  );
}
