import React, { useEffect, useState } from "react";
import { useMarketStatsList } from "./utils/fetcher";
import { MarketStatsList, PerpSide } from "./utils/types";
import { Popup } from "./components/general/Popup";
import { MarketSelectionList } from "./components/market/MarketSelectionList";
import { PerpForm } from "./components/market/PerpForm";
import { ButtonWithLoader } from "./components/general/ButtonWithLoader";
import { Card } from "./components/general/Card";

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
          <Card>
            <div className="flex flex-row items-center justify-start gap-2">
              <ButtonWithLoader
                disabled={isMarketsPopupOpen}
                isLoading={isMarketStatsListLoading}
                onClick={() => setIsMarketsPopupOpen(true)}
              >
                Select Market
              </ButtonWithLoader>

              {marketStatsListError ? (
                <span className="text-red-500">
                  Error loading markets: {marketStatsListError.message}
                </span>
              ) : (
                <h2 className="block text-xl flex-1">
                  {selectedMarket
                    ? `Selected Market: ${selectedMarket.market.pair.baseToken.symbol}/${selectedMarket.market.pair.quoteToken.symbol}`
                    : isMarketStatsListLoading
                    ? "Loading markets..."
                    : "Please select a market."}
                </h2>
              )}
            </div>
          </Card>
          {selectedMarket && <PerpForm market={selectedMarket.market} />}
        </main>
      </div>
      <Popup
        popupTitle="Select Market"
        isOpen={isMarketsPopupOpen}
        onClose={() => setIsMarketsPopupOpen(false)}
      >
        <MarketSelectionList
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
