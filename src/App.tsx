import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMarketStatsList } from "./utils/fetcher";
import { Market, MarketStatsList } from "./utils/types";
import { Popup } from "./components/Popup";
import { MarketSelection } from "./components/MarketSelection";
import { PerpForm } from "./components/PerpForm";

const App: React.FC = () => {
  const [isMarketsPopupOpen, setIsMarketsPopupOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<MarketStatsList | null>(
    null
  );

  useEffect(() => {
    if (!selectedMarket) {
      setIsMarketsPopupOpen(true);
    }
  }, []);

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
          onSelected={(marketItem: MarketStatsList) => {
            setSelectedMarket(marketItem);
            setIsMarketsPopupOpen(false);
          }}
        />
      </Popup>
    </>
  );
};

export default App;
