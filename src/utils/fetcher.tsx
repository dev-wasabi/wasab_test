import { GATEWAY_URL, getBaseURL } from "./constants";
import fetchData from "./fetchData";
import postData from "./postData";
import { Market, MarketStatsList, OpenPositionRequest, PaginatedResponse, PerpOrder, PerpQuoteRequestV2, PerpQuoteResponseV2, PerpSide, PositionStatus } from "./types";

export const fetchMarketStatsList = async (
    chainId?: number,
  ): Promise<PaginatedResponse<MarketStatsList>> => {
    const params = new URLSearchParams();
    params.set("env", "test");
  
    if (chainId) {
      params.set("chainId", chainId.toString());
    }
  
    return fetchData(`${GATEWAY_URL}/markets?${params}`);
  };
  

export const fetchQuote = async (
    marketPairId: number,
    side: PerpSide,
    downPayment: bigint,
    leverage: number,
    maxSlippage: number,
    speedUp: boolean,
    chainId: number
  ): Promise<PerpQuoteResponseV2> => {
    const params = new URLSearchParams();
    params.append("marketId", marketPairId.toString());
    params.append("side", side.toUpperCase());
    params.append("downPayment", downPayment.toString());
    params.append("leverage", leverage.toString());
    params.append("maxSlippage", maxSlippage.toString());
    params.append("speedUp", speedUp.toString());
    return fetchData(`${getBaseURL(chainId)}/api/market/quote?${params}`);
  };


export const fetchOrderV2 = async (
  request: PerpQuoteRequestV2,
  chainId: number,
): Promise<PerpOrder<OpenPositionRequest>> => {
  return await postData(`${getBaseURL(chainId)}/api/v2/order/open`, {
    ...request,
    side: request.side.toUpperCase(),
  });
};

export const fetchPositionsPortfolio = async (args: {
  address?: string;
  solanaAddress?: string;
  nextPageToken?: string;
  chainId?: number;
  markPriceForPnl?: boolean;
}): Promise<PaginatedResponse<PositionStatus>> => {
  const params = new URLSearchParams();
  params.set("env", "test");
  if (args.nextPageToken) {
    params.set("nextPageToken", args.nextPageToken);
  }
  if (args.address) {
    params.set("address", args.address);
  }
  if (args.solanaAddress) {
    params.set("solanaAddress", args.solanaAddress);
  }
  if (args.chainId !== undefined) {
    params.set("chainId", args.chainId.toString());
  }
  if (args.markPriceForPnl !== undefined) {
    params.set("markPriceForPnl", args.markPriceForPnl.toString());
  }
  return fetchData(`${GATEWAY_URL}/portfolio/positions?${params}`);
};
