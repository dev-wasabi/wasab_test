import React, { PropsWithChildren } from "react";
import ArrowPathIcon from "@heroicons/react/20/solid/ArrowPathIcon";
import clsx from "clsx";

export interface ButtonWithLoaderProps {
  isLoading: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const ButtonWithLoader: React.FC<
  PropsWithChildren<ButtonWithLoaderProps>
> = ({ disabled, isLoading, onClick, children, className, type }) => {
  return (
    <button
      type={type || "button"}
      disabled={!!disabled || isLoading}
      onClick={onClick}
      className={clsx(
        "relative px-4 py-2 rounded transition-colors duration-200 ease-in border",
        disabled
          ? "bg-white border-gray-400 text-gray-400"
          : "bg-blue-500 border-blue-500 text-white",
        (!!disabled || isLoading) && "cursor-not-allowed",
        className
      )}
    >
      <ArrowPathIcon
        className={clsx(
          "size-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin pointer-events-none transition-opacity duration-200 ease-in",
          !isLoading && "opacity-0"
        )}
      />
      <div
        className={clsx(
          "transition-opacity duration-200 ease-in",
          isLoading && "opacity-0"
        )}
      >
        {children}
      </div>
    </button>
  );
};
