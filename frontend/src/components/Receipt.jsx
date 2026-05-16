import { currency, formatDate } from '../utils/format';

// Hidden on screen; only visible on window.print() (see index.css).
export default function Receipt({ invoice, settings }) {
  const storeName = settings?.storeName || 'POS Awesome';
  const storeAddress = settings?.storeAddress || '';
  const footer = settings?.receiptFooter || 'Thank you!';
  const taxInclusive = settings?.taxInclusive;

  return (
    <div className="receipt-print">
      <div className="text-center mb-3">
        <div className="text-lg font-bold">{storeName}</div>
        {storeAddress && <div className="text-xs">{storeAddress}</div>}
      </div>
      <div className="text-xs mb-2">
        Invoice: {invoice.id}
        <br />
        Date: {formatDate(invoice.submittedAt)}
        <br />
        Customer: {invoice.customer.name}
      </div>
      <hr />
      <table className="w-full text-xs">
        <tbody>
          {invoice.lines.map((l) => (
            <tr key={l.id}>
              <td>
                {l.qty} × {l.name}
              </td>
              <td className="text-right">{currency(l.qty * l.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <div className="text-xs">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{currency(invoice.totals.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax{taxInclusive ? ' (incl.)' : ''}</span>
          <span>{currency(invoice.totals.tax)}</span>
        </div>
        <div className="flex justify-between font-bold mt-1">
          <span>Total</span>
          <span>{currency(invoice.totals.grandTotal)}</span>
        </div>
      </div>
      <hr />
      <div className="text-xs">
        {invoice.payments.map((p, i) => (
          <div key={i} className="flex justify-between">
            <span>{p.mode}</span>
            <span>{currency(p.amount)}</span>
          </div>
        ))}
        {invoice.change > 0 && (
          <div className="flex justify-between font-semibold mt-1">
            <span>Change</span>
            <span>{currency(invoice.change)}</span>
          </div>
        )}
        {invoice.outstanding > 0 && (
          <div className="flex justify-between font-semibold mt-1">
            <span>Outstanding</span>
            <span>{currency(invoice.outstanding)}</span>
          </div>
        )}
      </div>
      <div className="text-center text-xs mt-3">{footer}</div>
    </div>
  );
}
