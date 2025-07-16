import React, { useMemo, useState } from "react";
import { Market, PerpSide } from "../../utils/types";
import { useQuote } from "../../utils/fetcher";
import { formatUnits, parseUnits } from "viem";
import { Select } from "../general/Select";
import clsx from "clsx";
import { ButtonWithLoader } from "../general/ButtonWithLoader";

interface PerpFormProps {
  market: Market;
}

export const PerpForm: React.FC<PerpFormProps> = ({ market }) => {
  const [formData, setFormData] = useState({
    side: "long" as PerpSide,
    downPayment: "",
    leverage: 1.1,
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

  const {
    data: quote,
    isFetching: isQuoteFetching,
    error: quoteError,
  } = useQuote({
    enabled: isFormValid,
    marketPairId: market.id,
    chainId: market.chainId,
    ...formData,
    downPayment: downPaymentAtoms,
  });

  const outputSize =
    !quote || isQuoteFetching
      ? "0"
      : formatUnits(quote.outputSize, market.pair.baseToken.decimals);
  const submitDisabled =
    !isFormValid || !quote || !!quote.errorMessage || !!quoteError;

  return (
    <form className="flex flex-col gap-4 p-4 mb-2 bg-white rounded shadow">
      <h2 className="text-xl mb-4">
        {formData.side === "long"
          ? "Open Long Position"
          : "Open Short Position"}
      </h2>
      <Select
        value={formData.side}
        options={[
          { value: "long", label: "Long" },
          { value: "short", label: "Short" },
        ]}
        onChange={(side) =>
          setFormData({
            ...formData,
            side,
          })
        }
        name="perp-side-select"
        className="border rounded px-2 py-1 w-full"
      />
      <div className="flex flex-row gap-2 items-center">
        <label
          className="block font-medium order-2 w-15"
          htmlFor="down-payment"
        >
          {market.pair.quoteToken.symbol}
        </label>
        <input
          type="number"
          id="down-payment"
          placeholder="0"
          value={formData.downPayment}
          onChange={(e) => {
            setFormData({
              ...formData,
              downPayment: e.target.value,
            });
          }}
          className="border rounded px-2 py-1 w-full order-1"
        />
      </div>
      <div className="flex flex-row gap-2 items-center">
        <label className="block font-medium order-2 w-15" htmlFor="out-amount">
          {market.pair.baseToken.symbol}
        </label>
        <input
          type="number"
          id="out-amount"
          placeholder="0"
          disabled
          value={outputSize}
          onChange={(e) => {
            setFormData({
              ...formData,
              downPayment: e.target.value,
            });
          }}
          className="border border-gray-400 text-gray-400 rounded px-2 py-1 w-full order-1"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="leverage">
          Leverage: {formData.leverage}x
        </label>
        <input
          type="range"
          id="leverage"
          min={1.1}
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
      <ButtonWithLoader
        type="submit"
        isLoading={isQuoteFetching}
        disabled={submitDisabled}
        className="mt-2"
      >
        Submit
      </ButtonWithLoader>
      {(quote?.errorMessage || !!quoteError) && (
        <div className="text-red-500 mt-2">
          Error: {quote?.errorMessage || quoteError?.message || "Unknown error"}
        </div>
      )}
    </form>
  );
};
