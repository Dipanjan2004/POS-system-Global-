import { useState, useEffect } from 'react';
import { usePOS } from './hooks/usePOS';
import Navbar from './components/Navbar';
import OpeningDialog from './components/OpeningDialog';
import ClosingDialog from './components/ClosingDialog';
import ItemsGrid from './components/ItemsGrid';
import Cart from './components/Cart';
import PaymentScreen from './components/PaymentScreen';
import CustomerDialog from './components/CustomerDialog';
import DraftsDialog from './components/DraftsDialog';
import ReturnsDialog from './components/ReturnsDialog';
import Receipt from './components/Receipt';

export default function App() {
  const pos = usePOS();
  const { state } = pos;

  const [view, setView] = useState('items'); // 'items' | 'payment'
  const [openDialog, setOpenDialog] = useState(null); // 'customer' | 'drafts' | 'returns' | 'closing'

  // Keyboard shortcuts mirrored from the original Vue app.
  useEffect(() => {
    function onKey(e) {
      if (!state.shift) return;
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === 's') {
        e.preventDefault();
        if (state.lines.length > 0) setView('payment');
      } else if (e.key === 'd') {
        e.preventDefault();
        if (state.lines.length > 0) pos.removeLine(state.lines[0].id);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.shift, state.lines, pos]);

  if (!state.shift) {
    return <OpeningDialog onOpen={pos.openShift} />;
  }

  return (
    <div className="h-full flex flex-col bg-slate-100">
      <Navbar
        shift={state.shift}
        lastInvoice={state.lastInvoice}
        onCloseShift={() => setOpenDialog('closing')}
        onDrafts={() => setOpenDialog('drafts')}
        onReturns={() => setOpenDialog('returns')}
      />

      <main className="flex-1 overflow-hidden p-4">
        <div className="h-full grid grid-cols-12 gap-4">
          <section className="col-span-12 lg:col-span-7 h-full overflow-hidden">
            {view === 'items' ? (
              <ItemsGrid onAdd={pos.addItem} />
            ) : (
              <PaymentScreen
                pos={pos}
                onBack={() => setView('items')}
                onSubmitted={() => setView('items')}
              />
            )}
          </section>

          <section className="col-span-12 lg:col-span-5 h-full overflow-hidden">
            <Cart
              pos={pos}
              onPickCustomer={() => setOpenDialog('customer')}
              onPay={() => setView('payment')}
              showPayButton={view === 'items'}
            />
          </section>
        </div>
      </main>

      {openDialog === 'customer' && (
        <CustomerDialog
          current={state.customer}
          onSelect={(c) => {
            pos.setCustomer(c);
            setOpenDialog(null);
          }}
          onClose={() => setOpenDialog(null)}
        />
      )}

      {openDialog === 'drafts' && (
        <DraftsDialog
          drafts={state.drafts}
          onRestore={(id) => {
            pos.restoreDraft(id);
            setOpenDialog(null);
          }}
          onDelete={pos.deleteDraft}
          onClose={() => setOpenDialog(null)}
        />
      )}

      {openDialog === 'returns' && (
        <ReturnsDialog
          invoices={state.submittedInvoices}
          onReturn={(id) => {
            pos.returnInvoice(id);
            setOpenDialog(null);
          }}
          onClose={() => setOpenDialog(null)}
        />
      )}

      {openDialog === 'closing' && (
        <ClosingDialog
          shift={state.shift}
          invoices={state.submittedInvoices}
          onSubmit={() => {
            pos.closeShift();
            setOpenDialog(null);
          }}
          onClose={() => setOpenDialog(null)}
        />
      )}

      {state.lastInvoice && <Receipt invoice={state.lastInvoice} />}
    </div>
  );
}
