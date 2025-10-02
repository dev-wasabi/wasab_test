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

### 3. Opening Positions
Implement functionality to actually open positions:
- Submit position orders with the configured parameters
- Handle position opening by calling the `fetchOrderV2` endpoint and submitting the calldata inside the `PerpOrder`
- Make sure to also approve the payment token to the `to` address from the function call data
- Show confirmation dialogs before opening positions
- Display success/error feedback after position submission
- Validate inputs before allowing position opening

### 4. Positions Table
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

### Markets Selection
- Dropdown with fetched markets
- Clear market information display (name, symbol, etc.)
- Loading state while fetching markets

### Position Creation
- Toggle between Long/Short positions
- Input field for quote token amount
- Real-time output calculation display
- Leverage slider (e.g., 1x to 10x)
- Clear visual feedback for position type and amounts

### User Experience
- Responsive design for different screen sizes
- Intuitive form validation
- Clear error handling
- Smooth transitions between states 