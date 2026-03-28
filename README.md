# Sphere

Sphere is an on-chain community coordination app built for Monad.

The project has two parts:

- `contracts/`: Solidity smart contract and deployment scripts (Foundry)
- `frontend/sphere/`: Next.js app that connects wallets and interacts with the contract

## What The Contract Does

The `Sphere` contract supports community management and member activity:

- Contract owner creates communities and assigns a community creator
- Users register as community members with profile data (`name`, `intro`)
- Active members can send a message once every 12 hours
- Community creator can remove members
- Frontend can fetch members in paginated ranges via `getMembersInRange`

Core contract file:

- `contracts/src/Sphere.sol`

## Project Structure

```text
sphere/
	contracts/         # Foundry project (smart contracts, scripts)
	frontend/sphere/   # Next.js + wagmi + viem frontend
```

## Prerequisites

Install these tools before running the project:

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js 18+ (recommended: 20+)
- npm (comes with Node.js)
- A wallet in browser (for example, MetaMask)

## How To Run Foundry (Contracts)

From the project root:

```bash
cd contracts
```

Build contracts:

```bash
forge build
```

Run tests:

```bash
forge test
```

Run a local chain (Anvil):

```bash
anvil
```

Deploy using the script (in a second terminal while Anvil is running):

```bash
cd contracts
forge script script/Deploy.s.sol:SphereScript \
	--rpc-url http://127.0.0.1:8545 \
	--private-key <YOUR_PRIVATE_KEY> \
	--broadcast
```

After deployment, copy the deployed address and set it in:

- `frontend/sphere/config/contract.ts`

## How To Run The Project (Full Stack)

1. Start Anvil

```bash
cd contracts
anvil
```

2. Deploy the `Sphere` contract

```bash
cd contracts
forge script script/Deploy.s.sol:SphereScript \
	--rpc-url http://127.0.0.1:8545 \
	--private-key <YOUR_PRIVATE_KEY> \
	--broadcast
```

3. Update contract address in frontend

- Edit `frontend/sphere/config/contract.ts`
- Replace the hardcoded address with the newly deployed one

4. Install frontend dependencies

```bash
cd frontend/sphere
npm install
```

5. Run frontend

```bash
npm run dev
```

6. Open app

- http://localhost:3000

## Optional: Use Monad Testnet In Frontend

The frontend chain is selected through `NEXT_PUBLIC_CHAIN` in `frontend/sphere/config/networks.ts`:

- `anvil` (default)
- `monad`

Run with Monad chain setting:

```bash
cd frontend/sphere
NEXT_PUBLIC_CHAIN=monad npm run dev
```

Make sure the contract address in `frontend/sphere/config/contract.ts` matches the network you are using.
