// -------------------
// Customer Type
// -------------------
export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  total_orders: number;
  last_order_date: string | null;
  last_refill_date: string | null;
  type: "active" | "inactive" | "chronic" | "new";
  notes?: string;
  customer_since?: string;
};

// -------------------
// Mock Customers (8 entries)
// -------------------
export const mockCustomers: Customer[] = [
  {
    id: "C001",
    name: "Ali Khan",
    phone: "03001234567",
    address: "Block 5, Clifton, Karachi",
    total_orders: 8,
    last_order_date: "2025-12-10",
    last_refill_date: "2025-12-05",
    type: "active",
    customer_since: "2024-03-15"
  },
  {
    id: "C002",
    name: "Sara Ahmed",
    phone: "03111234567",
    address: "Gulberg III, Lahore",
    total_orders: 3,
    last_order_date: "2025-11-20",
    last_refill_date: null,
    type: "new",
    customer_since: "2025-10-01"
  },
  {
    id: "C003",
    name: "Usman Tariq",
    phone: "03221234567",
    address: "F-7, Islamabad",
    total_orders: 14,
    last_order_date: "2025-12-01",
    last_refill_date: "2025-12-01",
    type: "chronic",
    customer_since: "2023-06-10"
  },
  {
    id: "C004",
    name: "Fatima Noor",
    phone: "03331234567",
    address: "North Nazimabad, Karachi",
    total_orders: 0,
    last_order_date: null,
    last_refill_date: null,
    type: "inactive",
    customer_since: "2025-01-20"
  },
  {
    id: "C005",
    name: "Hassan Raza",
    phone: "03451234567",
    address: "DHA Phase 2, Lahore",
    total_orders: 6,
    last_order_date: "2025-12-08",
    last_refill_date: "2025-11-28",
    type: "active",
    customer_since: "2024-07-22"
  },
  {
    id: "C006",
    name: "Ayesha Malik",
    phone: "03021234567",
    address: "G-11, Islamabad",
    total_orders: 11,
    last_order_date: "2025-12-09",
    last_refill_date: "2025-12-09",
    type: "chronic",
    customer_since: "2023-02-14"
  },
  {
    id: "C007",
    name: "Bilal Hussain",
    phone: "03121234567",
    address: "Saddar, Karachi",
    total_orders: 2,
    last_order_date: "2025-11-15",
    last_refill_date: null,
    type: "new",
    customer_since: "2025-09-05"
  },
  {
    id: "C008",
    name: "Zainab Qureshi",
    phone: "03231234567",
    address: "Bahria Town, Rawalpindi",
    total_orders: 7,
    last_order_date: "2025-12-07",
    last_refill_date: "2025-11-30",
    type: "active",
    customer_since: "2024-01-18"
  }
];

// -------------------
// Refill Medicine Type
// -------------------
export type RefillMedicine = {
  medicine_name: string;
  strength: string;
  qty: number;
  unit_price: number;
};

// -------------------
// Refill Type
// -------------------
export type Refill = {
  id: string;
  customer_id: string;
  status: "new" | "approved" | "ready" | "completed" | "cancelled";
  channel: "whatsapp" | "voice" | "manual";
  medicines: RefillMedicine[];
  request_date: string;
  next_due?: string;
  linked_order_id?: string;
  notes?: string;
};

// -------------------
// Mock Refills (6 entries)
// -------------------
export const mockRefills: Refill[] = [
  {
    id: "R001",
    customer_id: "C001",
    status: "new",
    channel: "whatsapp",
    request_date: "2025-12-10",
    next_due: "2026-01-10",
    medicines: [
      { medicine_name: "Panadol", strength: "500mg", qty: 2, unit_price: 120 }
    ],
    notes: "Requested through WhatsApp AI"
  },
  {
    id: "R002",
    customer_id: "C002",
    status: "approved",
    channel: "voice",
    request_date: "2025-12-09",
    next_due: "2026-01-05",
    medicines: [
      { medicine_name: "Brufen", strength: "400mg", qty: 1, unit_price: 180 },
      { medicine_name: "Augmentin", strength: "625mg", qty: 1, unit_price: 950 }
    ]
  },
  {
    id: "R003",
    customer_id: "C003",
    status: "ready",
    channel: "manual",
    request_date: "2025-12-08",
    next_due: "2026-02-01",
    medicines: [
      { medicine_name: "Glucophage", strength: "850mg", qty: 2, unit_price: 320 }
    ]
  },
  {
    id: "R004",
    customer_id: "C005",
    status: "completed",
    channel: "whatsapp",
    request_date: "2025-11-28",
    next_due: "2025-12-28",
    medicines: [
      { medicine_name: "Atenolol", strength: "50mg", qty: 1, unit_price: 210 },
      { medicine_name: "Lipitor", strength: "20mg", qty: 1, unit_price: 1450 }
    ],
    notes: "Chronic patient — monthly refill"
  },
  {
    id: "R005",
    customer_id: "C006",
    status: "new",
    channel: "voice",
    request_date: "2025-12-09",
    next_due: "2026-01-09",
    medicines: [
      { medicine_name: "Insulin Glargine", strength: "100IU/ml", qty: 2, unit_price: 2800 }
    ],
    notes: "Diabetic patient — urgent"
  },
  {
    id: "R006",
    customer_id: "C008",
    status: "cancelled",
    channel: "manual",
    request_date: "2025-12-07",
    next_due: "2026-01-07",
    medicines: [
      { medicine_name: "Ventolin", strength: "100mcg", qty: 1, unit_price: 380 }
    ],
    notes: "Patient cancelled — will visit walk-in"
  }
];

// -------------------
// Get Refill By ID
// -------------------
export function getRefillById(id: string | undefined) {
  return mockRefills.find(r => r.id === id);
}

// -------------------
// Get Customer by ID
// -------------------
export function getCustomerById(id: string | undefined) {
  return mockCustomers.find(c => c.id === id);
}

// -------------------
// Add Customer
// -------------------
export function addCustomer(data: { name: string; phone: string; address: string }): Customer {
  const newCustomer: Customer = {
    id: `C${String(mockCustomers.length + 1).padStart(3, '0')}`,
    name: data.name,
    phone: data.phone,
    address: data.address || 'Not provided',
    total_orders: 0,
    last_order_date: null,
    last_refill_date: null,
    type: 'new',
    customer_since: new Date().toISOString().split('T')[0],
  };
  mockCustomers.push(newCustomer);
  return newCustomer;
}

// -------------------
// Order Item Type
// -------------------
export type OrderItem = {
  medicine_name: string;
  strength: string;
  form: string;
  qty: number;
  unit_price: number;
};

// -------------------
// Order Type
// -------------------
export type Order = {
  id: string;
  customer_id: string;
  date: string;
  channel: "whatsapp" | "call" | "walk-in";
  status: "pending" | "processing" | "ready" | "out-for-delivery" | "completed" | "cancelled";
  payment_status: "paid" | "unpaid";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  created_at: string;
  updated_at: string;
  notes?: string;
};

// -------------------
// Mock Orders (8 entries)
// -------------------
export const mockOrders: Order[] = [
  {
    id: "O001",
    customer_id: "C001",
    date: "2025-12-10",
    channel: "whatsapp",
    status: "completed",
    payment_status: "paid",
    items: [
      { medicine_name: "Panadol", strength: "500mg", form: "Tablet", qty: 2, unit_price: 120 }
    ],
    subtotal: 240,
    tax: 19,
    discount: 0,
    total: 259,
    created_at: "2025-12-10 10:00",
    updated_at: "2025-12-10 10:10"
  },
  {
    id: "O002",
    customer_id: "C002",
    date: "2025-11-22",
    channel: "call",
    status: "processing",
    payment_status: "unpaid",
    items: [
      { medicine_name: "Brufen", strength: "400mg", form: "Tablet", qty: 1, unit_price: 180 }
    ],
    subtotal: 180,
    tax: 14,
    discount: 0,
    total: 194,
    created_at: "2025-11-22 14:00",
    updated_at: "2025-11-22 14:05"
  },
  {
    id: "O003",
    customer_id: "C003",
    date: "2025-12-01",
    channel: "walk-in",
    status: "completed",
    payment_status: "paid",
    items: [
      { medicine_name: "Glucophage", strength: "850mg", form: "Tablet", qty: 2, unit_price: 320 },
      { medicine_name: "Atenolol", strength: "50mg", form: "Tablet", qty: 1, unit_price: 210 }
    ],
    subtotal: 850,
    tax: 68,
    discount: 50,
    total: 868,
    created_at: "2025-12-01 09:30",
    updated_at: "2025-12-01 09:45"
  },
  {
    id: "O004",
    customer_id: "C005",
    date: "2025-12-08",
    channel: "whatsapp",
    status: "ready",
    payment_status: "unpaid",
    items: [
      { medicine_name: "Lipitor", strength: "20mg", form: "Tablet", qty: 1, unit_price: 1450 },
      { medicine_name: "Panadol", strength: "500mg", form: "Tablet", qty: 1, unit_price: 120 }
    ],
    subtotal: 1570,
    tax: 126,
    discount: 0,
    total: 1696,
    created_at: "2025-12-08 11:00",
    updated_at: "2025-12-08 11:20"
  },
  {
    id: "O005",
    customer_id: "C006",
    date: "2025-12-09",
    channel: "call",
    status: "pending",
    payment_status: "unpaid",
    items: [
      { medicine_name: "Insulin Glargine", strength: "100IU/ml", form: "Injection", qty: 2, unit_price: 2800 }
    ],
    subtotal: 5600,
    tax: 448,
    discount: 200,
    total: 5848,
    created_at: "2025-12-09 16:00",
    updated_at: "2025-12-09 16:00",
    notes: "Diabetic patient — handle with care"
  },
  {
    id: "O006",
    customer_id: "C007",
    date: "2025-11-15",
    channel: "walk-in",
    status: "cancelled",
    payment_status: "unpaid",
    items: [
      { medicine_name: "Augmentin", strength: "625mg", form: "Tablet", qty: 1, unit_price: 950 }
    ],
    subtotal: 950,
    tax: 76,
    discount: 0,
    total: 1026,
    created_at: "2025-11-15 13:00",
    updated_at: "2025-11-15 13:30",
    notes: "Customer cancelled after placing"
  },
  {
    id: "O007",
    customer_id: "C008",
    date: "2025-12-07",
    channel: "whatsapp",
    status: "out-for-delivery",
    payment_status: "paid",
    items: [
      { medicine_name: "Ventolin", strength: "100mcg", form: "Inhaler", qty: 1, unit_price: 380 },
      { medicine_name: "Flixotide", strength: "250mcg", form: "Inhaler", qty: 1, unit_price: 1100 }
    ],
    subtotal: 1480,
    tax: 118,
    discount: 100,
    total: 1498,
    created_at: "2025-12-07 10:30",
    updated_at: "2025-12-07 12:00"
  },
  {
    id: "O008",
    customer_id: "C001",
    date: "2025-11-05",
    channel: "whatsapp",
    status: "completed",
    payment_status: "paid",
    items: [
      { medicine_name: "Amoxil", strength: "500mg", form: "Capsule", qty: 2, unit_price: 280 },
      { medicine_name: "Flagyl", strength: "400mg", form: "Tablet", qty: 1, unit_price: 150 }
    ],
    subtotal: 710,
    tax: 57,
    discount: 0,
    total: 767,
    created_at: "2025-11-05 08:00",
    updated_at: "2025-11-05 08:20"
  }
];

// -------------------
// Get All Orders
// -------------------
export function getAllOrders(): Order[] {
  return mockOrders;
}

// -------------------
// Get Order By ID
// -------------------
export function getOrderById(id: string | undefined) {
  return mockOrders.find((o) => o.id === id);
}

// -------------------
// Get Customer Orders
// -------------------
export function getCustomerOrders(customerId: string | undefined) {
  return mockOrders.filter(o => o.customer_id === customerId);
}

// -------------------
// Get Customer Refills
// -------------------
export function getCustomerRefills(customerId: string | undefined) {
  return mockRefills.filter(r => r.customer_id === customerId);
}

// -------------------
// Add Order
// -------------------
export function addOrder(order: Omit<Order, 'id'>): Order {
  const newOrder: Order = {
    ...order,
    id: `O${String(mockOrders.length + 1).padStart(3, '0')}`,
  };
  mockOrders.push(newOrder);
  return newOrder;
}

// -------------------
// Add Refill
// -------------------
export function addRefill(refill: Omit<Refill, 'id'>): Refill {
  const newRefill: Refill = {
    ...refill,
    id: `R${String(mockRefills.length + 1).padStart(3, '0')}`,
  };
  mockRefills.push(newRefill);
  return newRefill;
}

// -----------------------------
// Batch Type
// -----------------------------
export type Batch = {
  batch_no: string;
  manufacture_date: string;
  expiry_date: string;
  qty: number;
  purchase_price: number;
  supplier: string;
};

// -----------------------------
// Medicine Type
// -----------------------------
export type Medicine = {
  id: string;
  name: string;
  generic: string;
  strength: string;
  form: string;
  category: string;
  unit_price: number;
  min_stock: number;
  total_qty: number;
  description?: string;
  batches: Batch[];
};

// -----------------------------
// Mock Medicines (12 entries)
// -----------------------------
export const mockMedicines: Medicine[] = [
  {
    id: "M001",
    name: "Panadol",
    generic: "Paracetamol",
    strength: "500mg",
    form: "Tablet",
    category: "Pain Relief",
    unit_price: 120,
    min_stock: 50,
    total_qty: 220,
    description: "Used for fever and mild to moderate pain relief",
    batches: [
      { batch_no: "B001", manufacture_date: "2024-06-01", expiry_date: "2026-06-01", qty: 120, purchase_price: 80, supplier: "GSK Pakistan" },
      { batch_no: "B002", manufacture_date: "2024-09-01", expiry_date: "2026-09-01", qty: 100, purchase_price: 85, supplier: "GSK Pakistan" }
    ]
  },
  {
    id: "M002",
    name: "Augmentin",
    generic: "Amoxicillin + Clavulanic Acid",
    strength: "625mg",
    form: "Tablet",
    category: "Antibiotics",
    unit_price: 950,
    min_stock: 30,
    total_qty: 28,
    description: "Broad-spectrum antibiotic for bacterial infections",
    batches: [
      { batch_no: "B010", manufacture_date: "2024-08-01", expiry_date: "2026-08-01", qty: 28, purchase_price: 720, supplier: "GSK Pakistan" }
    ]
  },
  {
    id: "M003",
    name: "Brufen",
    generic: "Ibuprofen",
    strength: "400mg",
    form: "Tablet",
    category: "Pain Relief",
    unit_price: 180,
    min_stock: 40,
    total_qty: 95,
    description: "Anti-inflammatory for pain, fever, and inflammation",
    batches: [
      { batch_no: "B020", manufacture_date: "2024-07-01", expiry_date: "2026-07-01", qty: 95, purchase_price: 130, supplier: "Abbott Pakistan" }
    ]
  },
  {
    id: "M004",
    name: "Glucophage",
    generic: "Metformin",
    strength: "850mg",
    form: "Tablet",
    category: "Diabetes Care",
    unit_price: 320,
    min_stock: 30,
    total_qty: 12,
    description: "First-line treatment for Type 2 diabetes",
    batches: [
      { batch_no: "B030", manufacture_date: "2024-05-01", expiry_date: "2026-05-01", qty: 12, purchase_price: 240, supplier: "Merck Pakistan" }
    ]
  },
  {
    id: "M005",
    name: "Lipitor",
    generic: "Atorvastatin",
    strength: "20mg",
    form: "Tablet",
    category: "Cardiovascular",
    unit_price: 1450,
    min_stock: 20,
    total_qty: 60,
    description: "Statin for lowering LDL cholesterol",
    batches: [
      { batch_no: "B040", manufacture_date: "2024-04-01", expiry_date: "2026-04-01", qty: 60, purchase_price: 1100, supplier: "Pfizer Pakistan" }
    ]
  },
  {
    id: "M006",
    name: "Atenolol",
    generic: "Atenolol",
    strength: "50mg",
    form: "Tablet",
    category: "Blood Pressure",
    unit_price: 210,
    min_stock: 25,
    total_qty: 75,
    description: "Beta-blocker for hypertension and angina",
    batches: [
      { batch_no: "B050", manufacture_date: "2024-03-01", expiry_date: "2026-03-01", qty: 75, purchase_price: 155, supplier: "ICI Pakistan" }
    ]
  },
  {
    id: "M007",
    name: "Ventolin",
    generic: "Salbutamol",
    strength: "100mcg",
    form: "Inhaler",
    category: "Respiratory Care",
    unit_price: 380,
    min_stock: 15,
    total_qty: 22,
    description: "Bronchodilator for asthma and COPD",
    batches: [
      { batch_no: "B060", manufacture_date: "2024-10-01", expiry_date: "2026-10-01", qty: 22, purchase_price: 280, supplier: "GSK Pakistan" }
    ]
  },
  {
    id: "M008",
    name: "Amoxil",
    generic: "Amoxicillin",
    strength: "500mg",
    form: "Capsule",
    category: "Antibiotics",
    unit_price: 280,
    min_stock: 40,
    total_qty: 110,
    description: "Penicillin-type antibiotic for bacterial infections",
    batches: [
      { batch_no: "B070", manufacture_date: "2024-09-15", expiry_date: "2026-09-15", qty: 110, purchase_price: 200, supplier: "Sami Pharmaceuticals" }
    ]
  },
  {
    id: "M009",
    name: "Insulin Glargine",
    generic: "Insulin Glargine",
    strength: "100IU/ml",
    form: "Injection",
    category: "Diabetes Care",
    unit_price: 2800,
    min_stock: 10,
    total_qty: 18,
    description: "Long-acting basal insulin for Type 1 and Type 2 diabetes",
    batches: [
      { batch_no: "B090", manufacture_date: "2024-11-01", expiry_date: "2025-11-01", qty: 18, purchase_price: 2200, supplier: "Sanofi Pakistan" }
    ]
  },
  {
    id: "M010",
    name: "Flixotide",
    generic: "Fluticasone Propionate",
    strength: "250mcg",
    form: "Inhaler",
    category: "Respiratory Care",
    unit_price: 1100,
    min_stock: 10,
    total_qty: 30,
    description: "Corticosteroid inhaler for asthma maintenance",
    batches: [
      { batch_no: "B100", manufacture_date: "2024-08-15", expiry_date: "2026-08-15", qty: 30, purchase_price: 820, supplier: "GSK Pakistan" }
    ]
  },
  {
    id: "M011",
    name: "Calpol Syrup",
    generic: "Paracetamol",
    strength: "120mg/5ml",
    form: "Syrup",
    category: "Pediatric Medicines",
    unit_price: 160,
    min_stock: 30,
    total_qty: 0,
    description: "Paracetamol syrup for fever in children",
    batches: []
  },
  {
    id: "M012",
    name: "Betnovate",
    generic: "Betamethasone",
    strength: "0.1%",
    form: "Cream",
    category: "Dermatology",
    unit_price: 290,
    min_stock: 15,
    total_qty: 40,
    description: "Topical corticosteroid for skin inflammation",
    batches: [
      { batch_no: "B130", manufacture_date: "2024-04-10", expiry_date: "2026-04-10", qty: 40, purchase_price: 200, supplier: "GSK Pakistan" }
    ]
  }
];

// -----------------------------
// Get All Medicines
// -----------------------------
export function getAllMedicines(): Medicine[] {
  return mockMedicines;
}

// -----------------------------
// Get Medicine By ID
// -----------------------------
export function getMedicineById(id: string | undefined) {
  return mockMedicines.find((m) => m.id === id);
}

// -----------------------------
// Calculate Medicine Status
// -----------------------------
export function calculateMedicineStatus(
  medicine: Medicine
): "in-stock" | "low-stock" | "expiring-soon" | "expired" | "out-of-stock" {
  const today = new Date();

  if (medicine.total_qty === 0) return "out-of-stock";
  if (medicine.total_qty <= medicine.min_stock) return "low-stock";

  const hasExpired = medicine.batches.some(
    (b) => new Date(b.expiry_date) < today
  );
  if (hasExpired) return "expired";

  const expiringSoon = medicine.batches.some((b) => {
    const expiry = new Date(b.expiry_date);
    const diffDays = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 90;
  });
  if (expiringSoon) return "expiring-soon";

  return "in-stock";
}

// -----------------------------
// Delete Medicine
// -----------------------------
export function deleteMedicine(id: string): void {
  const index = mockMedicines.findIndex((m) => m.id === id);
  if (index !== -1) {
    mockMedicines.splice(index, 1);
  }
}