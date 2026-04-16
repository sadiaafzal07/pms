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
// Mock Customers
// -------------------
export const mockCustomers: Customer[] = [
  {
    id: "C001",
    name: "Ali Khan",
    phone: "03001234567",
    address: "Karachi",
    total_orders: 5,
    last_order_date: "2025-12-10",
    last_refill_date: "2025-12-05",
    type: "active"
  },
  {
    id: "C002",
    name: "Sara Ahmed",
    phone: "03111234567",
    address: "Lahore",
    total_orders: 2,
    last_order_date: "2025-11-20",
    last_refill_date: null,
    type: "new"
  },
  {
    id: "C003",
    name: "Usman Tariq",
    phone: "03221234567",
    address: "Islamabad",
    total_orders: 10,
    last_order_date: "2025-12-01",
    last_refill_date: "2025-12-01",
    type: "chronic"
  },
  {
    id: "C004",
    name: "Fatima Noor",
    phone: "03331234567",
    address: "Karachi",
    total_orders: 0,
    last_order_date: null,
    last_refill_date: null,
    type: "inactive"
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
// Mock Refills
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
      {
        medicine_name: "Panadol",
        strength: "500mg",
        qty: 2,
        unit_price: 2
      }
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
      {
        medicine_name: "Brufen",
        strength: "400mg",
        qty: 1,
        unit_price: 3
      },
      {
        medicine_name: "Augmentin",
        strength: "625mg",
        qty: 1,
        unit_price: 4
      }
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
      {
        medicine_name: "Glucophage",
        strength: "850mg",
        qty: 1,
        unit_price: 3.5
      }
    ]
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
  status:
    | "pending"
    | "processing"
    | "ready"
    | "out-for-delivery"
    | "completed"
    | "cancelled";
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
// Mock Orders
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
      {
        medicine_name: "Panadol",
        strength: "500mg",
        form: "Tablet",
        qty: 2,
        unit_price: 2
      }
    ],
    subtotal: 4,
    tax: 0.32,
    discount: 0,
    total: 4.32,
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
      {
        medicine_name: "Brufen",
        strength: "400mg",
        form: "Tablet",
        qty: 1,
        unit_price: 3
      }
    ],
    subtotal: 3,
    tax: 0.24,
    discount: 0,
    total: 3.24,
    created_at: "2025-11-22 14:00",
    updated_at: "2025-11-22 14:05"
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
// Mock Medicines
// -----------------------------
export const mockMedicines: Medicine[] = [
  {
    id: "M001",
    name: "Panadol",
    generic: "Paracetamol",
    strength: "500mg",
    form: "Tablet",
    category: "Pain Relief",
    unit_price: 2,
    min_stock: 50,
    total_qty: 120,
    description: "Used for fever and pain relief",
    batches: [
      {
        batch_no: "B001",
        manufacture_date: "2024-01-10",
        expiry_date: "2025-01-10",
        qty: 70,
        purchase_price: 1,
        supplier: "ABC Pharma"
      },
      {
        batch_no: "B002",
        manufacture_date: "2024-03-05",
        expiry_date: "2025-12-01",
        qty: 50,
        purchase_price: 1.2,
        supplier: "ABC Pharma"
      },
      {
        batch_no: "B003",
        manufacture_date: "2024-03-05",
        expiry_date: "2025-15-01",
        qty: 50,
        purchase_price: 1.2,
        supplier: "ABC Pharma"
      }
    ]
  },

  {
    id: "M002",
    name: "Augmentin",
    generic: "Amoxicillin + Clavulanic Acid",
    strength: "625mg",
    form: "Tablet",
    category: "Antibiotic",
    unit_price: 4,
    min_stock: 30,
    total_qty: 25,
    description: "Used for bacterial infections",
    batches: [
      {
        batch_no: "B010",
        manufacture_date: "2024-02-12",
        expiry_date: "2025-05-10",
        qty: 25,
        purchase_price: 3,
        supplier: "GSK Pharma"
      }
    ]
  },

  {
    id: "M003",
    name: "Brufen",
    generic: "Ibuprofen",
    strength: "400mg",
    form: "Tablet",
    category: "Pain Relief",
    unit_price: 3,
    min_stock: 40,
    total_qty: 80,
    description: "Anti-inflammatory pain medicine",
    batches: [
      {
        batch_no: "B020",
        manufacture_date: "2024-04-01",
        expiry_date: "2026-04-01",
        qty: 80,
        purchase_price: 2,
        supplier: "Abbott Pharma"
      }
    ]
  },

  {
    id: "M004",
    name: "Glucophage",
    generic: "Metformin",
    strength: "850mg",
    form: "Tablet",
    category: "Diabetes",
    unit_price: 3.5,
    min_stock: 20,
    total_qty: 10,
    description: "Used to control blood sugar",
    batches: [
      {
        batch_no: "B030",
        manufacture_date: "2023-11-20",
        expiry_date: "2024-11-20",
        qty: 10,
        purchase_price: 2.5,
        supplier: "Pfizer Pharma"
      }
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
):
  | "in-stock"
  | "low-stock"
  | "expiring-soon"
  | "expired"
  | "out-of-stock" {

  const today = new Date();

  if (medicine.total_qty === 0) return "out-of-stock";

  if (medicine.total_qty <= medicine.min_stock) return "low-stock";

  const hasExpired = medicine.batches.some(
    (b) => new Date(b.expiry_date) < today
  );

  if (hasExpired) return "expired";

  const expiringSoon = medicine.batches.some((b) => {
    const expiry = new Date(b.expiry_date);
    const diffDays =
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 90;
  });

  if (expiringSoon) return "expiring-soon";

  return "in-stock";
}
// -----------------------------
// Delete Medicine (mutates the shared array)
// -----------------------------
export function deleteMedicine(id: string): void {
  const index = mockMedicines.findIndex((m) => m.id === id);
  if (index !== -1) {
    mockMedicines.splice(index, 1);
  }
}
