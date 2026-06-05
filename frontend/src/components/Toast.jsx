const Toast = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1000,
        minWidth: 260,
        maxWidth: 380,
        background: isError ? "rgba(239,68,68,0.95)" : "rgba(16,185,129,0.95)",
        color: "#FFFFFF",
        borderRadius: 10,
        padding: "12px 16px",
        boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        fontSize: 13,
        fontWeight: 500,
      }}
      role="status"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        style={{
          background: "transparent",
          border: "none",
          color: "#FFFFFF",
          cursor: "pointer",
          fontSize: 16,
          lineHeight: 1,
          padding: 0,
        }}
      >
        x
      </button>
    </div>
  );
};

export default Toast;
