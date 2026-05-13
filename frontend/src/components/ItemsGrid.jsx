import { useMemo, useState, useRef, useEffect } from 'react';
import { Search, Barcode, LayoutGrid, List } from 'lucide-react';
import { items, categories } from '../data/mockData';
import { currency } from '../utils/format';

export default function ItemsGrid({ onAdd }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [view, setView] = useState('grid');
  const [barcodeMode, setBarcodeMode] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (category !== 'All' && it.category !== category) return false;
      if (!q) return true;
      return (
        it.name.toLowerCase().includes(q) ||
        it.code.toLowerCase().includes(q) ||
        it.barcode.includes(q)
      );
    });
  }, [query, category]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!barcodeMode) return;
    const match = items.find((i) => i.barcode === query.trim());
    if (match) {
      onAdd(match);
      setQuery('');
    }
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200">
      <form onSubmit={handleSubmit} className="p-3 border-b border-slate-200 flex gap-2">
        <div className="flex-1 relative">
          {barcodeMode ? (
            <Barcode size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-600" />
          ) : (
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          )}
          <input
            ref={searchRef}
            type="text"
            placeholder={barcodeMode ? 'Scan or enter barcode…' : 'Search by name / code / barcode'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button
          type="button"
          onClick={() => setBarcodeMode((m) => !m)}
          className={`px-3 rounded-lg border ${
            barcodeMode
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white text-slate-600 border-slate-300'
          }`}
          title="Toggle barcode mode"
        >
          <Barcode size={18} />
        </button>
        <button
          type="button"
          onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
          className="px-3 rounded-lg border border-slate-300 bg-white text-slate-600"
          title="Toggle layout"
        >
          {view === 'grid' ? <List size={18} /> : <LayoutGrid size={18} />}
        </button>
      </form>

      <div className="px-3 py-2 border-b border-slate-200 flex gap-2 overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
              category === c
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <div className="h-full grid place-items-center text-slate-400 text-sm">
            No items match your search
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((it) => (
              <button
                key={it.id}
                onClick={() => onAdd(it)}
                className="text-left bg-white rounded-xl border border-slate-200 p-3 hover:border-brand-500 hover:shadow-md transition active:scale-[0.98]"
              >
                <div className="aspect-square rounded-lg bg-slate-50 grid place-items-center text-4xl mb-2">
                  {it.emoji}
                </div>
                <div className="text-sm font-medium text-slate-900 line-clamp-2">
                  {it.name}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-brand-700">
                    {currency(it.price)}
                  </span>
                  <span
                    className={`text-[11px] ${
                      it.stock < 20 ? 'text-amber-600' : 'text-slate-400'
                    }`}
                  >
                    {it.stock} in stock
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {filtered.map((it) => (
              <button
                key={it.id}
                onClick={() => onAdd(it)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left"
              >
                <span className="text-2xl">{it.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">{it.name}</div>
                  <div className="text-xs text-slate-500">
                    {it.code} · {it.category}
                  </div>
                </div>
                <div className="text-sm font-bold text-brand-700">
                  {currency(it.price)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
