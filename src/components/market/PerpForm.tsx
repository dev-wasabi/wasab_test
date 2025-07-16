import React, { useMemo, useState } from "react";
import { MarketStatsList, PerpSide } from "../../utils/types";
import { useQuote } from "../../utils/fetcher";
import { parseUnits } from "viem";

interface PerpFormProps {
  market: MarketStatsList;
  side: PerpSide;
}

export const PerpForm: React.FC<PerpFormProps> = ({
  market: { market, tokenStats },
  side,
}) => {
  const [formData, setFormData] = useState({
    downPayment: "",
    leverage: 1,
    maxSlippage: 1,
  });

  const { isFormValid, downPaymentAtoms } = useMemo(() => {
    const downPaymentNum = Number.parseFloat(formData.downPayment);
    const isFormValid = !Number.isNaN(downPaymentNum) && downPaymentNum > 0;
    const downPaymentAtoms = isFormValid
      ? parseUnits(formData.downPayment, market.pair.quoteToken.decimals)
      : undefined;
    return { isFormValid, downPaymentAtoms };
  }, [formData, market]);

  const { data: quote } = useQuote({
    enabled: isFormValid,
    marketPairId: market.id,
    chainId: market.chainId,
    side,
    ...formData,
    downPayment: downPaymentAtoms,
  });

  return (
    <form className="flex flex-col gap-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-4">
        {side === "long" ? "Open Long Position" : "Open Short Position"} on{" "}
        {market.name}
      </h2>
      <div>
        <label className="block mb-1 font-medium">
          Token {market.pair.quoteToken.symbol}:
        </label>
        <input
          type="number"
          value={formData.downPayment}
          onChange={(e) => {
            setFormData({
              ...formData,
              downPayment: e.target.value,
            });
          }}
          className="border rounded px-2 py-1 w-full"
          placeholder={`Amount in ${market.pair.quoteToken.symbol}`}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">
          Leverage: {formData.leverage}x
        </label>
        <input
          type="range"
          min={1}
          max={market.maxLeverage}
          step={0.1}
          value={formData.leverage}
          onChange={(e) =>
            setFormData({
              ...formData,
              leverage: Number(e.target.value),
            })
          }
          className="w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        disabled={!isFormValid || !quote}
      >
        Submit
      </button>
    </form>
  );
};
