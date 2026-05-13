import { ShoppingCart, FileText, Undo2, Printer, LogOut } from 'lucide-react';
import { formatDate } from '../utils/format';

export default function Navbar({ shift, lastInvoice, onCloseShift, onDrafts, onReturns }) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-4 py-2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-brand-600 text-white grid place-items-center font-bold">
            P
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-slate-900">POS Awesome</div>
            <div className="text-[11px] text-slate-500">{shift.profile}</div>
          </div>
        </div>

        <div className="flex-1" />

        <button onClick={onDrafts} className="navbtn">
          <FileText size={16} /> Drafts
        </button>
        <button onClick={onReturns} className="navbtn">
          <Undo2 size={16} /> Returns
        </button>
        {lastInvoice && (
          <button onClick={() => window.print()} className="navbtn">
            <Printer size={16} /> Print last
          </button>
        )}
        <button onClick={onCloseShift} className="navbtn navbtn-danger">
          <LogOut size={16} /> Close shift
        </button>

        <div className="hidden md:flex items-center text-xs text-slate-500 pl-3 border-l border-slate-200">
          <ShoppingCart size={14} className="mr-1.5" />
          Opened {formatDate(shift.openedAt)}
        </div>
      </div>

      <style>{`
        .navbtn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 8px;
          background: #f1f5f9; color: #334155;
          font-size: 13px; font-weight: 500;
          transition: background .15s;
        }
        .navbtn:hover { background: #e2e8f0; }
        .navbtn-danger { background: #fee2e2; color: #b91c1c; }
        .navbtn-danger:hover { background: #fecaca; }
      `}</style>
    </header>
  );
}
