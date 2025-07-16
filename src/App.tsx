import React, { useEffect, useState } from "react";
import { useMarketStatsList } from "./utils/fetcher";
import { MarketStatsList, PerpSide } from "./utils/types";
import { Popup } from "./components/general/Popup";
import { MarketSelectionList } from "./components/market/MarketSelectionList";
import { PerpForm } from "./components/market/PerpForm";
import { ButtonWithLoader } from "./components/general/ButtonWithLoader";
import { Card } from "./components/general/Card";
import { useAccount, useDisconnect } from "wagmi";

const App: React.FC = () => {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const {
    data: marketStatsListResponse,
    isLoading: isMarketStatsListLoading,
    error: marketStatsListError,
  } = useMarketStatsList();
  const {
    isMarketsPopupOpen,
    setIsMarketsPopupOpen,
    selectedMarket,
    setSelectedMarket,
  } = useMarketSelection(marketStatsListResponse?.items);

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4 flex">
          <h1 className="text-2xl flex-1">Market Dashboard</h1>
          {account.isConnected && (
            <button onClick={() => disconnect()}>Disconnect</button>
          )}
        </header>
        <main className="p-2 sm:p-4 w-full max-w-xl mx-auto">
          <Card>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2 sm:gap-4">
              <ButtonWithLoader
                disabled={isMarketsPopupOpen}
                isLoading={isMarketStatsListLoading}
                onClick={() => setIsMarketsPopupOpen(true)}
              >
                Select Market
              </ButtonWithLoader>

              {marketStatsListError ? (
                <span className="text-red-500 text-sm ">
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

function useMarketSelection(marketStatsList: MarketStatsList[] | undefined) {
  const [isMarketsPopupOpen, setIsMarketsPopupOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<MarketStatsList | null>(
    null
  );

  useEffect(() => {
    if (selectedMarket || isMarketsPopupOpen || !marketStatsList) {
      return;
    }

    const selectedMarketFromUrl = extractMarketFromCurrentUrl(marketStatsList);
    if (selectedMarketFromUrl) {
      setSelectedMarket(selectedMarketFromUrl);
    } else {
      setIsMarketsPopupOpen(true);
    }
  }, [selectedMarket, marketStatsList, isMarketsPopupOpen]);

  return {
    isMarketsPopupOpen,
    setIsMarketsPopupOpen,
    selectedMarket,
    setSelectedMarket,
  };
}

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
