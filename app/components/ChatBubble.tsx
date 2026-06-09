"use client";

interface ChatBubbleProps {
  content: string;
  isSent: boolean;
  senderName?: string;
  senderImage?: string | null;
  timestamp: string;
}

export default function ChatBubble({
  content,
  isSent,
  senderName,
  senderImage,
  timestamp,
}: ChatBubbleProps) {
  const formattedTime = new Date(timestamp).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "10px",
        flexDirection: isSent ? "row-reverse" : "row",
        alignSelf: isSent ? "flex-end" : "flex-start",
        width: "100%",
      }}
    >
      {/* Avatar (only for received) */}
      {!isSent && (
        <div style={{ flexShrink: 0, marginBottom: "2px" }}>
          {senderImage ? (
            <img
              src={senderImage}
              alt={senderName || ""}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.6)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: "white",
                background: "var(--pink-gradient)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {senderName?.charAt(0) || "?"}
            </div>
          )}
        </div>
      )}

      {/* Bubble */}
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 16px",
          borderRadius: isSent ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
          background: isSent
            ? "linear-gradient(135deg, #e9407e 0%, #e65b96 100%)"
            : "#ffffff",
          color: isSent ? "#ffffff" : "#1f2937",
          boxShadow: isSent
            ? "0 4px 12px rgba(233, 64, 126, 0.2)"
            : "0 4px 12px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          border: isSent ? "none" : "1px solid rgba(0, 0, 0, 0.03)",
        }}
      >
        {(() => {
          const isImage = content.startsWith("http") && (
            content.includes("/storage/v1/object/public/") || 
            /\.(jpeg|jpg|gif|png|webp|svg)/i.test(content)
          );
          if (isImage) {
            return (
              <img
                src={content}
                alt="Shared media"
                style={{
                  maxWidth: "100%",
                  maxHeight: "260px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  cursor: "pointer",
                  display: "block",
                  marginTop: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                }}
                onClick={() => window.open(content, "_blank")}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            );
          }
          return (
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                lineHeight: "1.4",
                wordBreak: "break-word",
                fontWeight: 500,
              }}
            >
              {content}
            </p>
          );
        })()}
        <span
          style={{
            fontSize: "0.7rem",
            alignSelf: "flex-end",
            opacity: 0.8,
            color: isSent ? "rgba(255,255,255,0.7)" : "#9ca3af",
            marginTop: "2px",
          }}
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
