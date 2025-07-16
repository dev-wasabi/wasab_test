import React from "react";
import { useMarketStatsList } from "../utils/fetcher";
import { Market, MarketStatsList } from "../utils/types";

export interface MarketSelectionProps {
  onSelected: (marketItem: MarketStatsList) => void;
}

export function MarketSelection({ onSelected }: MarketSelectionProps) {
  const { data: res } = useMarketStatsList();

  const marketStatsList = res?.items;

  return (
    <div>
      <h1>Market Selection</h1>
      <p>Select a market to view details.</p>
      <ul>
        {marketStatsList?.map((item) => {
          const { market } = item;

          return (
            <li>
              <button
                onClick={() => onSelected(item)}
                className="text-blue-500 hover:underline"
              >
                {market.name} ({market.pair.baseToken.symbol}/{" "}
                {market.pair.quoteToken.symbol})
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
