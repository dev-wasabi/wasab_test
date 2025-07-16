import React, { useEffect, useState } from "react";
import { useMarketStatsList } from "./utils/fetcher";
import { MarketStatsList, PerpSide } from "./utils/types";
import { Popup } from "./components/general/Popup";
import { MarketSelection } from "./components/market/MarketSelection";
import { PerpForm } from "./components/market/PerpForm";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

const App: React.FC = () => {
  const [isMarketsPopupOpen, setIsMarketsPopupOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<MarketStatsList | null>(
    null
  );

  const {
    data: marketStatsListResponse,
    isLoading: isMarketStatsListLoading,
    error: marketStatsListError,
  } = useMarketStatsList();

  useEffect(() => {
    if (selectedMarket || isMarketsPopupOpen || !marketStatsListResponse) {
      return;
    }

    const selectedMarketFromUrl = extractMarketFromCurrentUrl(
      marketStatsListResponse.items
    );
    if (selectedMarketFromUrl) {
      setSelectedMarket(selectedMarketFromUrl);
    } else {
      setIsMarketsPopupOpen(true);
    }
  }, [selectedMarket, marketStatsListResponse]);

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl">Market Dashboard</h1>
        </header>
        <main className="p-4">
          <div className="flex flex-row items-center justify-start bg-white p-4 mb-2 rounded shadow gap-2">
            <button
              disabled={isMarketsPopupOpen || isMarketStatsListLoading}
              onClick={() => setIsMarketsPopupOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded relative transition-colors duration-200 ease-in"
            >
              {isMarketStatsListLoading && (
                <ArrowPathIcon className="size-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
              )}
              <span className={clsx(isMarketStatsListLoading && "invisible")}>
                Select Market
              </span>
            </button>
            <h2 className="block text-xl flex-1">
              {marketStatsListError ? (
                <span className="text-red-500">
                  Error loading markets: {marketStatsListError.message}
                </span>
              ) : selectedMarket ? (
                `Selected Market: ${selectedMarket.market.pair.baseToken.symbol}/${selectedMarket.market.pair.quoteToken.symbol}`
              ) : isMarketStatsListLoading ? (
                "Loading markets..."
              ) : (
                "Please select a market."
              )}
            </h2>
          </div>
          {selectedMarket && <PerpForm market={selectedMarket.market} />}
        </main>
      </div>
      <Popup
        popupTitle="Select Market"
        isOpen={isMarketsPopupOpen}
        onClose={() => setIsMarketsPopupOpen(false)}
      >
        <MarketSelection
          marketStatsList={marketStatsListResponse?.items ?? []}
          onSelected={(marketItem) => {
            setSelectedMarket(marketItem);
            updateCurrentUrlWithSelectedMarket(marketItem.market.id);
            setIsMarketsPopupOpen(false);
          }}
        />
      </Popup>
    </>
  );
};

export default App;

function extractMarketFromCurrentUrl(
  markets: MarketStatsList[]
): MarketStatsList | null {
  const url = new URL(String(window.location));
  const marketIdFromUrl = url.searchParams.get("market");
  const selectedMarketId = marketIdFromUrl
    ? Number.parseInt(marketIdFromUrl)
    : null;

  if (!selectedMarketId) {
    return null;
  }

  return markets.find(({ market: { id } }) => id === selectedMarketId) ?? null;
}

function updateCurrentUrlWithSelectedMarket(marketId: number): void {
  const url = new URL(String(window.location));
  const searchParams = url.searchParams;
  searchParams.set("market", String(marketId));
  url.search = searchParams.toString();
  history.pushState({ marketId }, "", url);
}
