import { useMutation, useQuery } from "@tanstack/react-query";
import { getBaseURL } from "./constants";
import fetchData from "./fetchData";
import {
  MarketStatsList,
  OpenPositionRequest,
  PaginatedResponse,
  PerpOrder,
  PerpQuoteRequestV2,
  PerpQuoteResponseV2,
  PerpSide,
} from "./types";

export const fetchMarketStatsList = async (
  chainId?: number
): Promise<PaginatedResponse<MarketStatsList>> => {
  const params = new URLSearchParams();
  params.set("env", "test");

  if (chainId) {
    params.set("chainId", chainId.toString());
  }

  return fetchData(
    `https://mtpmmrxvh7.us-east-1.awsapprunner.com/markets?${params}`
  );
};

export const useMarketStatsList = (chainId?: number) => {
  return useQuery<PaginatedResponse<MarketStatsList>>({
    queryKey: ["marketStatsList", chainId],
    queryFn: () => fetchMarketStatsList(chainId),
  });
};

export const fetchQuote = async (
  marketPairId: number,
  side: PerpSide,
  downPayment: bigint,
  leverage: number,
  maxSlippage: number,
  chainId: number
): Promise<PerpQuoteResponseV2> => {
  const params = new URLSearchParams();
  params.append("marketId", marketPairId.toString());
  params.append("side", side.toUpperCase());
  params.append("downPayment", downPayment.toString());
  params.append("leverage", leverage.toString());
  params.append("maxSlippage", maxSlippage.toString());
  return fetchData(`${getBaseURL(chainId)}/api/market/quote?${params}`);
};

export const useQuote = ({
  marketPairId,
  side,
  leverage,
  maxSlippage,
  chainId,
  downPayment,
  enabled = true,
}: {
  marketPairId: number;
  side: PerpSide;
  leverage: number;
  maxSlippage: number;
  chainId: number;
  downPayment?: bigint;
  enabled?: boolean;
}) => {
  return useQuery<PerpQuoteResponseV2>({
    queryKey: [
      "quote",
      marketPairId,
      side,
      downPayment?.toString(),
      leverage,
      maxSlippage,
      chainId,
    ],
    queryFn: () =>
      fetchQuote(
        marketPairId,
        side,
        downPayment!,
        leverage,
        maxSlippage,
        chainId
      ),
    enabled:
      enabled &&
      marketPairId !== undefined &&
      side !== undefined &&
      downPayment !== undefined &&
      leverage !== undefined &&
      maxSlippage !== undefined &&
      chainId !== undefined,
  });
};

export const fetchOrderV2 = async (
  request: PerpQuoteRequestV2,
  chainId: number
): Promise<PerpOrder<OpenPositionRequest>> => {
  return await fetchData(`${getBaseURL(chainId)}/api/v2/order/open`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: stringifyWithBigInts({
      ...request,
      side: request.side.toUpperCase(),
    }),
  });
};

export function useOrder() {
  return useMutation<
    PerpOrder<OpenPositionRequest>,
    Error,
    { request: PerpQuoteRequestV2; chainId: number }
  >({
    mutationFn: ({ request, chainId }) => fetchOrderV2(request, chainId),
  });
}

function stringifyWithBigInts(value: unknown, space?: string | number) {
  return JSON.stringify(
    value,
    (_, value) => (typeof value === "bigint" ? value.toString() : value),
    space
  );
}
