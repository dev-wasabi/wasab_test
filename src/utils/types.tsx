export type PerpSide = "long" | "short";

export interface Market {
  id: number;
  name: string;
  chain: string;
  chainId: number;
  exchange: string;
  baseTokenAddress: string;
  quoteTokenAddress: string;
  priceSourceAddress: string;
  chartPairAddress: string;
  feeBps: number;
  enabled: boolean;
  pair: PairTokens;
}

export interface PairTokens {
  baseToken: Token;
  quoteToken: Token;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  imageUrl: string;
  chain: string;
  chainId: number;
}

export interface OpenPositionRequest {
  id: number;
  currency: string;
  targetCurrency: string;
  downPayment: bigint;
  principal: bigint;
  minTargetAmount: bigint;
  expiration: number;
  fee: bigint;
  functionCallDataList: FunctionCallData[];
  existingPosition: Position;
  referrer: string;
}

export interface FunctionCallData {
  to: string;
  value: bigint;
  data: string;
}

export interface Position {
  id: number;
  poolAddress: string;
  openTimestamp: number;
  side: PerpSide;
  traderAddress: string;
  currencyAddress: string;
  collateralCurrencyAddress: string;
  lastFundingTimestamp: number;
  downPaymentRaw: bigint;
  downPayment: number;
  principalRaw: bigint;
  principal: number;
  collateralAmountRaw: bigint;
  collateralAmount: number;
  feesToBePaid: number;
  feesToBePaidRaw: bigint;
  entryPrice: number;
  leverage: number;
}

export interface PerpOrder<T> {
  request: T;
  callData: FunctionCallData;
}

export interface PerpQuoteResponseV2 {
  market: Market;
  side: "LONG" | "SHORT";
  downPayment: bigint;
  outputSize: bigint;
  outputSizeInQuote: bigint;
  fee: bigint;
  entryPrice: number;
  liquidationPrice: number;
  errorMessage: string | undefined;
  hourlyBorrowFee: number;
  swapResponse: SwapResponse;
  principal: bigint;
  loopingApr?: number | undefined;
  baseLoopingApr?: number | undefined;
}

export interface SwapResponse {
  tokenIn: Token;
  tokenOut: Token;
  quoteAmount: bigint;
  request: QuoteRequest;
  deadline: number;
  tradePaths: TradePath[];
  functionCallDataList: FunctionCallData[];
  priceImpact: number;
  tokenToUsdPrice: TokenToUsdPrice;
  feeBips?: number;
}

export interface QuoteRequest {
  tokenIn: string;
  tokenOut: string;
  quoteType: "EXACT_IN" | "EXACT_OUT";
  amount: bigint;
  caller: string;
  recipient: string;
  maxSlippage: number;
  orderDuration: number;
}

export interface TradePath {
  percent: number;
  path: string[];
  protocol: string;
}

export interface TokenToUsdPrice {
  [key: string]: number;
}

export interface PaginatedResponse<T> {
  hasNextPage: boolean;
  nextPageToken?: string | null;
  items: T[];
}

export interface MarketStatsList {
  market: Market;
  tokenStats: MarketStats;
}


export interface MarketStats {
  address: string;
  symbol: string;
  price: number;
  priceUsd: number;
  marketCap: number;
  oneHourVolumeUsd: number;
  oneHourChange: number;
  fourHourVolumeUsd: number;
  fourHourChange: number;
  twelveHourVolumeUsd: number;
  twelveHourChange: number;
  oneDayVolumeUsd: number;
  oneDayChange: number;
}


export enum PayInType {
  NATIVE = "NATIVE",
  TOKEN = "TOKEN",
  VAULT = "VAULT",
}


export interface PerpQuoteRequestV2 {
  marketId: number;
  side: "long" | "short";
  downPayment: bigint;
  leverage: number;
  maxSlippage: number;
  speedUp: boolean;
  payInType: PayInType; // use NATIVE
  address: string;
}

export interface PositionStatus {
  position: Position;
  market: Market;
  netValue: bigint;
  markPrice: number;
  liquidationPrice: number;
  interestPaid: bigint;
  interestPaidInQuote: bigint;
  apr: number;
  pnl: bigint;
  pnlWithFee: bigint;
  fee: bigint;
  hasError: boolean;
}