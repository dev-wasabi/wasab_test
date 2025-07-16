import React, { PropsWithChildren } from "react";

export interface PopupProps {
  isOpen: boolean;
  onClose(): void;
}

export const Popup: React.FC<PropsWithChildren<PopupProps>> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              borderRadius: "8px",
              background: "white",
              minWidth: "300px",
              minHeight: "100px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ margin: 0 }}>Popup</h3>
              <button
                onClick={onClose}
                style={{
                  fontSize: 18,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
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
