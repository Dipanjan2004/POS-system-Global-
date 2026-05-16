// Mock catalog for the standalone POS frontend.
// Replace with `frappe.call('posawesome.posawesome.api.posapp.get_items')` to wire to Frappe.

export const categories = [
  'All',
  'Drinks',
  'Bakery',
  'Snacks',
  'Groceries',
  'Dairy',
  'Frozen',
];

export const items = [
  { id: 'ITM-001', name: 'Espresso', code: 'ESP', category: 'Drinks', price: 3.5, stock: 120, barcode: '1000001', emoji: '☕' },
  { id: 'ITM-002', name: 'Cappuccino', code: 'CAP', category: 'Drinks', price: 4.25, stock: 90, barcode: '1000002', emoji: '☕' },
  { id: 'ITM-003', name: 'Iced Latte', code: 'ICL', category: 'Drinks', price: 4.75, stock: 60, barcode: '1000003', emoji: '🥤' },
  { id: 'ITM-004', name: 'Green Tea', code: 'GTE', category: 'Drinks', price: 2.95, stock: 80, barcode: '1000004', emoji: '🍵' },
  { id: 'ITM-005', name: 'Orange Juice', code: 'OJ', category: 'Drinks', price: 3.25, stock: 45, barcode: '1000005', emoji: '🧃' },
  { id: 'ITM-006', name: 'Mineral Water', code: 'H2O', category: 'Drinks', price: 1.5, stock: 200, barcode: '1000006', emoji: '💧' },

  { id: 'ITM-010', name: 'Croissant', code: 'CRO', category: 'Bakery', price: 2.75, stock: 30, barcode: '1000010', emoji: '🥐' },
  { id: 'ITM-011', name: 'Chocolate Muffin', code: 'MUF', category: 'Bakery', price: 3.0, stock: 25, barcode: '1000011', emoji: '🧁' },
  { id: 'ITM-012', name: 'Bagel', code: 'BGL', category: 'Bakery', price: 2.5, stock: 18, barcode: '1000012', emoji: '🥯' },
  { id: 'ITM-013', name: 'Donut', code: 'DON', category: 'Bakery', price: 2.25, stock: 40, barcode: '1000013', emoji: '🍩' },
  { id: 'ITM-014', name: 'Sourdough Loaf', code: 'SDL', category: 'Bakery', price: 5.5, stock: 12, barcode: '1000014', emoji: '🍞' },

  { id: 'ITM-020', name: 'Potato Chips', code: 'CHP', category: 'Snacks', price: 2.0, stock: 75, barcode: '1000020', emoji: '🍟' },
  { id: 'ITM-021', name: 'Chocolate Bar', code: 'CHB', category: 'Snacks', price: 1.75, stock: 100, barcode: '1000021', emoji: '🍫' },
  { id: 'ITM-022', name: 'Granola Bar', code: 'GRB', category: 'Snacks', price: 1.5, stock: 60, barcode: '1000022', emoji: '🥜' },
  { id: 'ITM-023', name: 'Popcorn', code: 'POP', category: 'Snacks', price: 2.25, stock: 50, barcode: '1000023', emoji: '🍿' },

  { id: 'ITM-030', name: 'Bananas (1 kg)', code: 'BAN', category: 'Groceries', price: 1.2, stock: 200, barcode: '1000030', emoji: '🍌' },
  { id: 'ITM-031', name: 'Apples (1 kg)', code: 'APL', category: 'Groceries', price: 2.4, stock: 180, barcode: '1000031', emoji: '🍎' },
  { id: 'ITM-032', name: 'Tomatoes (1 kg)', code: 'TOM', category: 'Groceries', price: 1.8, stock: 90, barcode: '1000032', emoji: '🍅' },
  { id: 'ITM-033', name: 'Bread', code: 'BRD', category: 'Groceries', price: 3.0, stock: 40, barcode: '1000033', emoji: '🍞' },
  { id: 'ITM-034', name: 'Pasta 500g', code: 'PST', category: 'Groceries', price: 2.5, stock: 70, barcode: '1000034', emoji: '🍝' },

  { id: 'ITM-040', name: 'Whole Milk 1L', code: 'MLK', category: 'Dairy', price: 1.95, stock: 60, barcode: '1000040', emoji: '🥛' },
  { id: 'ITM-041', name: 'Greek Yogurt', code: 'YGT', category: 'Dairy', price: 2.85, stock: 35, barcode: '1000041', emoji: '🍶' },
  { id: 'ITM-042', name: 'Cheddar 200g', code: 'CHD', category: 'Dairy', price: 4.5, stock: 20, barcode: '1000042', emoji: '🧀' },
  { id: 'ITM-043', name: 'Butter 250g', code: 'BTR', category: 'Dairy', price: 3.75, stock: 25, barcode: '1000043', emoji: '🧈' },

  { id: 'ITM-050', name: 'Vanilla Ice Cream', code: 'ICE', category: 'Frozen', price: 5.95, stock: 15, barcode: '1000050', emoji: '🍦' },
  { id: 'ITM-051', name: 'Frozen Pizza', code: 'FPZ', category: 'Frozen', price: 6.5, stock: 22, barcode: '1000051', emoji: '🍕' },
  { id: 'ITM-052', name: 'Frozen Berries', code: 'FBR', category: 'Frozen', price: 4.25, stock: 18, barcode: '1000052', emoji: '🫐' },
];

export const customers = [
  { id: 'CUST-0001', name: 'Walk-in Customer', mobile: '', email: '', group: 'Retail', discount: 0 },
  { id: 'CUST-0002', name: 'Aarav Sharma', mobile: '+91 98100 11122', email: 'aarav@example.com', group: 'Retail', discount: 5 },
  { id: 'CUST-0003', name: 'Sapphire Ventures', mobile: '+91 98203 44556', email: 'ap@sapphire.co', group: 'Corporate', discount: 12 },
  { id: 'CUST-0004', name: 'Priya Iyer', mobile: '+91 99880 12345', email: 'priya@example.com', group: 'Retail', discount: 0 },
  { id: 'CUST-0005', name: 'Northwind Cafe', mobile: '+91 91111 22334', email: 'orders@northwind.cafe', group: 'Wholesale', discount: 15 },
  { id: 'CUST-0006', name: 'Daniel Cohen', mobile: '+91 87654 33221', email: 'dan@example.com', group: 'Retail', discount: 0 },
];

export const defaultSettings = {
  allowEditRate: true,
  maxDiscount: 25,
  hideOutOfStock: false,
  taxInclusive: false,
  allowPartial: false,
  applyCustomerDiscount: true,
  storeName: 'POS Awesome',
  storeAddress: '123 Main Street · Anywhere',
  receiptFooter: 'Thank you for shopping with us!',
};

export const paymentModes = [
  { id: 'cash', label: 'Cash', icon: 'Banknote', isCash: true },
  { id: 'card', label: 'Card', icon: 'CreditCard', isCash: false },
  { id: 'upi', label: 'UPI', icon: 'Smartphone', isCash: false },
  { id: 'wallet', label: 'Wallet', icon: 'Wallet', isCash: false },
];

export const taxRate = 0.05; // 5% tax used in totals
