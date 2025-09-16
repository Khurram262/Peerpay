

export type Transaction = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  amount: number;
  date: string;
  type: 'sent' | 'received' | 'top-up';
};

export type CardTheme = 'sky' | 'emerald' | 'amber' | 'rose' | 'slate' | 'violet';

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

export type User = {
    name: string;
    email: string;
}

export type Wallet = {
  balance: number;
  currency: 'USD';
  rewardsPoints: number;
}

export type Reward = {
    id: string;
    activity: string;
    points: number;
    date: string;
}

export type LinkedAccount = {
  id: string;
  type: 'bank' | 'card';
  name: string;
  provider: string;
  last4: string;
}

export let wallet: Wallet = {
  balance: 2342.78,
  currency: 'USD',
  rewardsPoints: 1250,
};

export const setWallet = (newWallet: Wallet) => {
  if (typeof window !== 'undefined') {
    wallet = newWallet;
    localStorage.setItem('wallet', JSON.stringify(newWallet));
    window.dispatchEvent(new Event('storage'));
  }
}

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

export let user: User = { name: 'Alex Doe', email: 'alex.doe@example.com' };

export const setUser = (newUser: User) => {
  if (typeof window !== 'undefined') {
    user = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
    window.dispatchEvent(new Event('storage'));
  }
}

export const initialVirtualCards: VirtualCard[] = [
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

export const rewardHistory: Reward[] = [
    {
        id: 'reward_1',
        activity: 'Electricity Bill Payment',
        points: 50,
        date: '2024-05-21',
    },
    {
        id: 'reward_2',
        activity: 'Internet Bill Payment',
        points: 30,
        date: '2024-05-15',
    },
    {
        id: 'reward_3',
        activity: 'Water Bill Payment',
        points: 25,
        date: '2024-05-10',
    },
     {
        id: 'reward_4',
        activity: 'Gas Bill Payment',
        points: 20,
        date: '2024-05-05',
    },
    {
        id: 'reward_5',
        activity: 'Welcome Bonus',
        points: 100,
        date: '2024-05-01',
    }
]

export const initialLinkedAccounts: LinkedAccount[] = [
    {
        id: 'acc_1',
        type: 'bank',
        name: 'Main Savings Account',
        provider: 'Capital Bank',
        last4: '1234',
    },
    {
        id: 'acc_2',
        type: 'card',
        name: 'Visa Debit',
        provider: 'Global Trust Bank',
        last4: '5678',
    }
]
