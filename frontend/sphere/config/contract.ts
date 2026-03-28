export const SPHERE_ABI = [
  // Constructor
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },

  // ── Read Functions ──
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'communityCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'communities',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'id', type: 'uint256' },
      { name: 'name', type: 'string' },
      { name: 'creator', type: 'address' },
      { name: 'exists', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'members',
    inputs: [
      { name: '', type: 'uint256' },
      { name: '', type: 'address' },
    ],
    outputs: [
      { name: 'serial', type: 'uint256' },
      { name: 'name', type: 'string' },
      { name: 'intro', type: 'string' },
      { name: 'joinedAt', type: 'uint256' },
      { name: 'lastMessageAt', type: 'uint256' },
      { name: 'status', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'memberCount',
    inputs: [{ name: '_communityId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'memberList',
    inputs: [
      { name: '', type: 'uint256' },
      { name: '', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMembersInRange',
    inputs: [
      { name: '_communityId', type: 'uint256' },
      { name: 'from', type: 'uint256' },
      { name: 'to', type: 'uint256' },
    ],
    outputs: [
      { name: 'wallets', type: 'address[]' },
      { name: 'serials', type: 'uint256[]' },
      { name: 'names', type: 'string[]' },
      { name: 'intros', type: 'string[]' },
      { name: 'joinedAts', type: 'uint256[]' },
      { name: 'lastMessageAts', type: 'uint256[]' },
      { name: 'statuses', type: 'uint8[]' },
    ],
    stateMutability: 'view',
  },

  // ── Write Functions ──
  {
    type: 'function',
    name: 'createCommunity',
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_creator', type: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'register',
    inputs: [
      { name: '_communityId', type: 'uint256' },
      { name: '_name', type: 'string' },
      { name: '_intro', type: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'sendMessage',
    inputs: [
      { name: '_communityId', type: 'uint256' },
      { name: '_message', type: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeMember',
    inputs: [
      { name: '_communityId', type: 'uint256' },
      { name: '_member', type: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },

  // ── Events ──
  {
    type: 'event',
    name: 'CommunityCreated',
    inputs: [
      { name: 'communityId', type: 'uint256', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'creator', type: 'address', indexed: true },
    ],
  },
  {
    type: 'event',
    name: 'MemberRegistered',
    inputs: [
      { name: 'communityId', type: 'uint256', indexed: true },
      { name: 'member', type: 'address', indexed: true },
      { name: 'serial', type: 'uint256', indexed: false },
      { name: 'name', type: 'string', indexed: false },
      { name: 'joinedAt', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'MemberRemoved',
    inputs: [
      { name: 'communityId', type: 'uint256', indexed: true },
      { name: 'member', type: 'address', indexed: true },
      { name: 'serial', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'MessageSent',
    inputs: [
      { name: 'communityId', type: 'uint256', indexed: true },
      { name: 'member', type: 'address', indexed: true },
      { name: 'message', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;

export function getContractAddress(): `0x${string}` {
  const addr = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!addr) {
    // Default to a zero address for development
    return '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  }
  return addr as `0x${string}`;
}

export const sphereContract = {
  abi: SPHERE_ABI,
  address: getContractAddress(),
} as const;
