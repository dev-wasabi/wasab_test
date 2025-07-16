import React, { JSX, PropsWithChildren } from "react";

export interface PopupProps {
  popupTitle: string | JSX.Element;
  isOpen: boolean;
  onClose(): void;
}

export const Popup: React.FC<PropsWithChildren<PopupProps>> = ({
  popupTitle,
  isOpen,
  onClose,
  children,
}) => {
  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 size-full bg-black/30 flex items-center justify-center z-50">
          <div className="flex flex-col p-5 rounded-lg bg-white min-w-[300px] min-h-[100px]">
            <div className="flex justify-between items-center mb-4">
              <h3>{popupTitle}</h3>
              <button
                onClick={onClose}
                className="text-2xl bg-transparent border-none cursor-pointer pb-1"
              >
                &times;
              </button>
            </div>
            <div>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
