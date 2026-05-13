import { useState, useMemo } from 'react';
import { Search, UserPlus, Check } from 'lucide-react';
import { customers as initial } from '../data/mockData';
import Modal from './Modal';

export default function CustomerDialog({ current, onSelect, onClose }) {
  const [list, setList] = useState(initial);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', mobile: '', email: '', group: 'Retail' });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.mobile && c.mobile.includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [query, list]);

  function createCustomer() {
    if (!draft.name.trim()) return;
    const customer = {
      id: `CUST-${Date.now()}`,
      name: draft.name.trim(),
      mobile: draft.mobile.trim(),
      email: draft.email.trim(),
      group: draft.group,
    };
    setList([customer, ...list]);
    onSelect(customer);
  }

  return (
    <Modal title="Select Customer" onClose={onClose} size="md">
      <div className="p-4">
        {!adding ? (
          <>
            <div className="relative mb-3">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search by name, mobile, email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              onClick={() => setAdding(true)}
              className="w-full mb-3 py-2 rounded-lg bg-brand-50 text-brand-700 font-medium hover:bg-brand-100 inline-flex items-center justify-center gap-2 border border-brand-200"
            >
              <UserPlus size={16} /> Add new customer
            </button>
            <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {filtered.map((c) => {
                const selected = c.id === current?.id;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => onSelect(c)}
                      className={`w-full text-left p-3 hover:bg-slate-50 flex items-center gap-3 ${
                        selected ? 'bg-brand-50' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 grid place-items-center font-semibold">
                        {c.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {c.mobile || c.email || c.group}
                        </div>
                      </div>
                      {selected && <Check size={18} className="text-brand-600" />}
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="p-4 text-center text-sm text-slate-400">
                  No matching customers
                </li>
              )}
            </ul>
          </>
        ) : (
          <div className="space-y-3">
            <Field
              label="Name"
              value={draft.name}
              onChange={(v) => setDraft({ ...draft, name: v })}
              autoFocus
            />
            <Field
              label="Mobile"
              value={draft.mobile}
              onChange={(v) => setDraft({ ...draft, mobile: v })}
            />
            <Field
              label="Email"
              type="email"
              value={draft.email}
              onChange={(v) => setDraft({ ...draft, email: v })}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Customer Group
              </label>
              <select
                value={draft.group}
                onChange={(e) => setDraft({ ...draft, group: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option>Retail</option>
                <option>Wholesale</option>
                <option>Corporate</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setAdding(false)}
                className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={createCustomer}
                disabled={!draft.name.trim()}
                className="flex-1 py-2 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 disabled:opacity-50"
              >
                Create & Select
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function Field({ label, value, onChange, type = 'text', autoFocus }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        autoFocus={autoFocus}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  );
}
