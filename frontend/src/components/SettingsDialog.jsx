import { Settings as SettingsIcon, Store, Receipt as ReceiptIcon, Sliders } from 'lucide-react';
import Modal from './Modal';

export default function SettingsDialog({ settings, onChange, onClose }) {
  const set = (patch) => onChange(patch);

  return (
    <Modal title="POS Settings" onClose={onClose} size="lg">
      <div className="p-5 space-y-6">
        <Section icon={<Sliders size={16} />} title="Cashier permissions">
          <Toggle
            label="Allow editing item rate"
            hint="Cashier can change the unit price on a cart line."
            checked={settings.allowEditRate}
            onChange={(v) => set({ allowEditRate: v })}
          />
          <Toggle
            label="Apply customer discount automatically"
            hint="When a customer with a saved discount % is selected, apply it to the invoice."
            checked={settings.applyCustomerDiscount}
            onChange={(v) => set({ applyCustomerDiscount: v })}
          />
          <Toggle
            label="Allow partial payment"
            hint="Submit an invoice even if the cashier collects less than the grand total. The remainder becomes outstanding."
            checked={settings.allowPartial}
            onChange={(v) => set({ allowPartial: v })}
          />
          <NumberRow
            label="Maximum discount allowed (%)"
            hint="Caps per-line and invoice discounts. Set to 100 to disable."
            value={settings.maxDiscount}
            min={0}
            max={100}
            onChange={(v) => set({ maxDiscount: v })}
          />
        </Section>

        <Section icon={<Store size={16} />} title="Display">
          <Toggle
            label="Hide out-of-stock items"
            checked={settings.hideOutOfStock}
            onChange={(v) => set({ hideOutOfStock: v })}
          />
          <Toggle
            label="Show tax-inclusive prices on totals"
            hint="Labels totals as 'incl. tax' instead of adding tax on top."
            checked={settings.taxInclusive}
            onChange={(v) => set({ taxInclusive: v })}
          />
        </Section>

        <Section icon={<ReceiptIcon size={16} />} title="Receipt header & footer">
          <TextRow
            label="Store name"
            value={settings.storeName}
            onChange={(v) => set({ storeName: v })}
          />
          <TextRow
            label="Store address"
            value={settings.storeAddress}
            onChange={(v) => set({ storeAddress: v })}
          />
          <TextRow
            label="Footer line"
            value={settings.receiptFooter}
            onChange={(v) => set({ receiptFooter: v })}
          />
        </Section>
      </div>
    </Modal>
  );
}

function Section({ icon, title, children }) {
  return (
    <section>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
        {icon}
        {title}
      </div>
      <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
        {children}
      </div>
    </section>
  );
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 p-3 cursor-pointer hover:bg-slate-50">
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-900">{label}</div>
        {hint && <div className="text-xs text-slate-500 mt-0.5">{hint}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition shrink-0 ${
          checked ? 'bg-brand-600' : 'bg-slate-300'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
    </label>
  );
}

function NumberRow({ label, hint, value, min, max, onChange }) {
  return (
    <div className="flex items-start gap-3 p-3">
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-900">{label}</div>
        {hint && <div className="text-xs text-slate-500 mt-0.5">{hint}</div>}
      </div>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-24 px-2 py-1.5 text-sm text-right rounded-lg border border-slate-300"
      />
    </div>
  );
}

function TextRow({ label, value, onChange }) {
  return (
    <div className="p-3">
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  );
}

export { SettingsIcon };
