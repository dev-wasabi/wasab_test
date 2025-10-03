# UI Interview Question - Trading Interface

This is a React TypeScript project for a UI interview question. The task is to create a trading interface using React, Tailwind CSS, and the provided types/fetching utilities.

## 🎯 Task Requirements

Create a trading interface with the following components:

### 1. Markets Dropdown
- Fetch markets list using `fetchMarketStatsList`
- Create a dropdown component for market selection
- User picks one market from the list

### 2. Quoting View
After market selection, show a quoting interface where users can:
- Open **long** or **short** positions
- Input the amount in quote token they want to pay
- See the output amount they will receive
- Adjust leverage using a slider

### 3. Wallet Connection
Implement wallet connectivity for user interactions:
- Integrate wallet connection using Wallet Connector or similar libraries
- Support popular wallets (MetaMask, WalletConnect, etc.)
- Display connected wallet address and balance
- Handle wallet connection/disconnection states
- Show appropriate UI when wallet is not connected

### 4. Token Approval Process
Implement token approval functionality using wagmi/viem:
- Read current token approval status for wasabi contracts
- Request token approval when insufficient allowance
- Use wagmi/viem hooks for reading and writing approval state
- Display approval status and required actions to users
- Handle approval transaction flows

### 5. Transaction Pending States
Implement comprehensive transaction state management:
- Show loading notifications when approval transactions are submitted
- Display pending states for trade transactions
- Implement success/error notification system
- Provide transaction hash links to block explorers
- Handle transaction failures with clear error messages
- Show progress indicators during multi-step processes (approval → trade)

### 6. Opening Positions
Implement functionality to actually open positions:
- Submit position orders with the configured parameters
- Handle position opening by calling the `fetchOrderV2` endpoint and submitting the calldata inside the `PerpOrder`
- Make sure to also approve the payment token to the `to` address from the function call data
- Show confirmation dialogs before opening positions
- Display success/error feedback after position submission
- Validate inputs before allowing position opening

### 7. Positions Table
Display a table showing all user positions:
- Fetch and display current open positions
- Show position details (market, side, size, entry price, PnL, etc.)
- Real-time updates of position values and PnL
- Actions to close or modify existing positions
- Responsive table design for mobile and desktop

## 🎨 Technical Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **TanStack Query** for data fetching
- **Webpack 5** for bundling
- **PostCSS** for CSS processing

## 📦 Required NPM Packages

### Blockchain Interactions
- **wagmi** - React hooks for Ethereum interactions
- **viem** - TypeScript interface for Ethereum, required for wagmi

### Wallet Connection
- **Reown AppKit** (recommended) - Comprehensive wallet connection solution
  - Documentation: [Reown AppKit Overview](https://docs.reown.com/overview)
  - Supports 600+ wallets with features like email/social login, gas sponsorship, multi-chain support
- Alternative wallet connection libraries are acceptable (WalletConnect, RainbowKit, etc.)

### UI Libraries (Optional)
- Any reasonable UI component libraries can be used alongside Tailwind CSS
- Examples: Headless UI, Radix UI, Chakra UI, Material-UI, Ant Design
- Choose based on project needs and design requirements

## 📁 Project Structure

```
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.tsx            # Main App component
│   ├── index.css          # Tailwind CSS imports
│   ├── index.tsx          # Entry point
│   └── utils/
│       └── types.tsx      # TypeScript interfaces
├── .babelrc               # Babel configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
├── webpack.config.js      # Webpack configuration
└── package.json           # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm start
```
This will start the development server at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 📋 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests (not configured yet)

## 🎨 Design Requirements

- Use Tailwind CSS for all styling
- Create a clean, modern UI
- Implement responsive design
- Focus on user experience and intuitive interactions
- Use the provided TypeScript types for type safety

## 🔧 Implementation Notes

- The `fetchMarketStatsList` function is provided for fetching market data
- Use the TypeScript interfaces in `src/utils/types.tsx` for type safety
- Implement proper loading and error states
- Consider UX patterns for trading interfaces (clear input/output, validation, etc.)

## 📝 Expected Features

### Wallet Integration
- Connect/disconnect wallet functionality
- Display connected wallet address and balance
- Support for multiple wallet types (MetaMask, WalletConnect, etc.)
- Wallet connection status indicators
- Graceful handling of wallet switching and disconnection

### Markets Selection
- Dropdown with fetched markets using `fetchMarketStatsList`
- Clear market information display (name, symbol, price, etc.)
- Loading state while fetching markets
- Error handling for failed market data requests

### Position Configuration
- Toggle between Long/Short positions
- Input field for quote token amount with validation
- Real-time output calculation display
- Leverage slider (e.g., 1x to 10x (or whatever the market max leverage is)) with clear indicators
- Clear visual feedback for position type and amounts
- Input validation and error messages

### Token Approval Management
- Check current token allowance using wagmi/viem
- Request token approval when insufficient
- Display approval status and progress
- Handle approval transaction states
- Clear indication of required vs. completed approvals

### Transaction Flow
- Multi-step transaction process (approval → trade)
- Loading states for pending transactions
- Success/error notifications with transaction hashes
- Progress indicators for multi-step operations
- Block explorer links for completed transactions
- Retry mechanisms for failed transactions

### Position Management
- Real-time positions table with current data
- Position details (market, side, size, entry price, PnL)
- Live updates of position values and unrealized PnL

### User Experience
- Responsive design for different screen sizes
- Intuitive form validation with clear error messages
- Comprehensive error handling for all failure scenarios
- Smooth transitions between application states
- Loading skeletons and progress indicators
- Accessible UI components and keyboard navigation 