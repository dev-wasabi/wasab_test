import React, { useEffect, useState } from "react";
import { useMarketStatsList } from "./utils/fetcher";
import { MarketStatsList, PerpSide } from "./utils/types";
import { Popup } from "./components/general/Popup";
import { MarketSelection } from "./components/market/MarketSelection";
import { PerpForm } from "./components/market/PerpForm";

const App: React.FC = () => {
  const [isMarketsPopupOpen, setIsMarketsPopupOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<MarketStatsList | null>(
    null
  );

  const { data: marketStatsListResponse } = useMarketStatsList();

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
          {selectedMarket ? (
            <div>
              <h2 className="text-xl mb-4">
                Selected Market: {selectedMarket.market.name}
              </h2>
              {/* Additional market details can be displayed here */}
            </div>
          ) : (
            <p>Please select a market to view details.</p>
          )}
          <button
            onClick={() => setIsMarketsPopupOpen(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Select Market
          </button>
        </main>
        {selectedMarket && <PerpForm market={selectedMarket} side="long" />}
      </div>
      <Popup
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
