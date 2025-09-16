export type Transaction = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  amount: number;
  date: string;
  type: 'sent' | 'received' | 'top-up';
};

export type CardTheme = 'sky' | 'emerald' | 'amber' | 'rose';

export type VirtualCard = {
  id: string;
  fullNumber: string;
  last4: string;
  expiry: string;
  cvv: string;
  cardholder: string;
  isPrimary: boolean;
  status: 'active' | 'blocked';
  theme: CardTheme;
};

export const wallet = {
  balance: 2342.78,
  currency: 'USD',
};

export const transactions: Transaction[] = [
  {
    id: 'txn_1',
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    avatar: 'https://picsum.photos/seed/p1/40/40',
    amount: 45.5,
    date: '2024-05-20',
    type: 'sent',
  },
  {
    id: 'txn_2',
    name: 'Netflix Subscription',
    email: 'billing@netflix.com',
    avatar: 'https://picsum.photos/seed/p2/40/40',
    amount: 15.99,
    date: '2024-05-19',
    type: 'sent',
  },
  {
    id: 'txn_3',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    avatar: 'https://picsum.photos/seed/p3/40/40',
    amount: 200.0,
    date: '2024-05-18',
    type: 'received',
  },
  {
    id: 'txn_4',
    name: 'Bank Deposit',
    email: 'notifications@yourbank.com',
    avatar: 'https://picsum.photos/seed/p4/40/40',
    amount: 1000.0,
    date: '2024-05-17',
    type: 'top-up',
  },
  {
    id: 'txn_5',
    name: 'Sarah Davis',
    email: 'sarah.d@example.com',
    avatar: 'https://picsum.photos/seed/p5/40/40',
    amount: 75.0,
    date: '2024-05-16',
    type: 'received',
  },
];

export const virtualCards: VirtualCard[] = [
  {
    id: 'card_1',
    fullNumber: '4242424242424242',
    last4: '4242',
    expiry: '12/26',
    cvv: '123',
    cardholder: 'Alex Doe',
    isPrimary: true,
    status: 'active',
    theme: 'sky',
  },
  {
    id: 'card_2',
    fullNumber: '1234123412341234',
    last4: '1234',
    expiry: '08/25',
    cvv: '456',
    cardholder: 'Alex Doe',
    isPrimary: false,
    status: 'active',
    theme: 'emerald',
  },
];
