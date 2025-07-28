import React, { useMemo, useState } from "react";
import { Market, PayInType, PerpSide } from "../../utils/types";
import { useOrder, useQuote } from "../../utils/fetcher";
import { formatUnits, parseUnits } from "viem";
import { Select } from "../general/Select";
import { ButtonWithLoader } from "../general/ButtonWithLoader";
import { Card } from "../general/Card";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useConnectWalletPopup } from "../general/ConnectWalletPopup";

interface PerpFormProps {
  market: Market;
}

export const PerpForm: React.FC<PerpFormProps> = ({ market }) => {
  const account = useAccount();
  const { open: openConnectPopup } = useConnectWalletPopup();
  const [formData, setFormData] = useState({
    side: "long" as PerpSide,
    downPayment: "",
    leverage: 1.1,
    maxSlippage: 1,
  });
  const [isSubmittingPerpOrder, setIsSubmittingPerpOrder] = useState(false);
  const {
    data: transaction,
    sendTransactionAsync,
    error: transactionSendError,
  } = useSendTransaction();
  const { isLoading: isConfirming, error: transactionConfirmationError } =
    useWaitForTransactionReceipt({
      hash: transaction,
      chainId: market.chainId as 1 | 11155111,
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

  const { mutateAsync: makeOrderData } = useOrder();

  async function handleSubmit() {
    // TODO: check whether the user has enough balance to submit the order
    if (
      isSubmittingPerpOrder ||
      !account.address ||
      !isFormValid ||
      !downPaymentAtoms ||
      !quote
    ) {
      return;
    }

    setIsSubmittingPerpOrder(true);
    try {
      const orderData = await makeOrderData({
        request: {
          marketId: market.id,
          side: formData.side,
          downPayment: downPaymentAtoms,
          leverage: formData.leverage,
          maxSlippage: formData.maxSlippage,
          speedUp: false,
          payInType: PayInType.NATIVE,
          address: account.address,
        },
        chainId: market.chainId,
      });
      await sendTransactionAsync(orderData.callData);
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmittingPerpOrder(false);
    }
  }

  const outputSize =
    !quote || isQuoteFetching
      ? "0"
      : formatUnits(quote.outputSize, market.pair.baseToken.decimals);
  const submitDisabled =
    !isFormValid ||
    !quote ||
    !!quote.errorMessage ||
    !!quoteError ||
    isSubmittingPerpOrder ||
    isConfirming;
  const isSubmitLoading =
    isQuoteFetching || isSubmittingPerpOrder || isConfirming;

  return (
    <Card
      title={
        formData.side === "long" ? "Open Long Position" : "Open Short Position"
      }
    >
      <form
        className="flex flex-col gap-4"
        onClick={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
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
          <label
            className="block font-medium order-2 w-15"
            htmlFor="out-amount"
          >
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
        {account.isConnected ? (
          <ButtonWithLoader
            type="submit"
            isLoading={isSubmitLoading}
            disabled={submitDisabled}
            className="mt-2"
          >
            Submit
          </ButtonWithLoader>
        ) : (
          <ButtonWithLoader
            type="button"
            isLoading={false}
            className="mt-2"
            onClick={openConnectPopup}
          >
            Connect Wallet
          </ButtonWithLoader>
        )}
        {(quote?.errorMessage ||
          !!quoteError ||
          transactionSendError ||
          transactionConfirmationError) && (
          <div className="text-red-500 mt-2">
            Error:{" "}
            {quote?.errorMessage ||
              quoteError?.message ||
              transactionSendError?.message ||
              transactionConfirmationError?.message ||
              "Unknown error"}
          </div>
        )}
      </form>
    </Card>
  );
};
