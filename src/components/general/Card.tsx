import clsx from "clsx";
import React, { JSX, PropsWithChildren } from "react";

export interface CardProps {
  title?: string | JSX.Element;
  className?: string;
}

export const Card: React.FC<PropsWithChildren<CardProps>> = ({
  children,
  title,
  className = "",
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-4 p-4 mb-2 bg-white rounded shadow",
        className
      )}
    >
      {title && <h2 className="text-xl">{title}</h2>}
      <div>{children}</div>
    </div>
  );
};
