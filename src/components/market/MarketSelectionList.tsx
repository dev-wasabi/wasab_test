import React from "react";
import { MarketStatsList } from "../../utils/types";

export interface MarketSelectionProps {
  marketStatsList: MarketStatsList[];
  onSelected: (marketItem: MarketStatsList) => void;
}

export const MarketSelectionList: React.FC<MarketSelectionProps> = ({
  marketStatsList,
  onSelected,
}) => {
  return (
    <ul>
      {marketStatsList.map((item) => {
        const { market } = item;

        return (
          <li key={market.id} className="mb-2">
            <button
              onClick={() => onSelected(item)}
              className="text-blue-500 hover:underline"
            >
              {market.pair.baseToken.symbol}/{market.pair.quoteToken.symbol}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
