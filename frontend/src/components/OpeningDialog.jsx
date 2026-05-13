import { useState } from 'react';
import { Store } from 'lucide-react';

const profiles = ['Main Counter', 'Express Lane', 'Drive-Through'];

export default function OpeningDialog({ onOpen }) {
  const [profile, setProfile] = useState(profiles[0]);
  const [openingBalance, setOpeningBalance] = useState('100.00');

  function submit(e) {
    e.preventDefault();
    onOpen({
      id: `SHIFT-${Date.now()}`,
      openedAt: new Date().toISOString(),
      openingBalance: parseFloat(openingBalance) || 0,
      profile,
    });
  }

  return (
    <div className="h-full grid place-items-center bg-gradient-to-br from-brand-50 to-slate-100 p-4">
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-600 text-white grid place-items-center">
            <Store size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Open POS Shift</h1>
            <p className="text-sm text-slate-500">Start a new register session</p>
          </div>
        </div>

        <label className="block text-sm font-medium text-slate-700 mb-1">
          POS Profile
        </label>
        <select
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {profiles.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Opening Cash Balance
        </label>
        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            $
          </span>
          <input
            type="number"
            step="0.01"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition"
        >
          Open Shift
        </button>

        <p className="text-xs text-slate-400 text-center mt-4">
          Tip: <kbd className="bg-slate-100 px-1.5 py-0.5 rounded">Ctrl+S</kbd> opens
          payments. <kbd className="bg-slate-100 px-1.5 py-0.5 rounded">Ctrl+D</kbd>{' '}
          removes the top cart item.
        </p>
      </form>
    </div>
  );
}
