const swatchColors = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
] as const;

export function SocialImage() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15), transparent)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid pattern background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating color orbs */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 70%)",
          top: -50,
          right: 100,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%)",
          bottom: 50,
          left: 50,
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent 70%)",
          top: 200,
          left: 300,
          filter: "blur(40px)",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 16,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <rect width="10" height="8" x="7" y="8" rx="1" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
              margin: 0,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            previewcn
          </h1>
          <p
            style={{
              fontSize: 28,
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 400,
            }}
          >
            Real-time Theme Editor for shadcn/ui
          </p>
        </div>

        {/* Color swatches */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 24,
          }}
        >
          {swatchColors.map((color, i) => (
            <div
              key={i}
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: color,
                boxShadow: `0 4px 24px ${color}66`,
                transform: `rotate(${(i - 3.5) * 3}deg)`,
              }}
            />
          ))}
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 16,
          }}
        >
          {["Live Preview", "OKLCH Colors", "Export CSS"].map((feature, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 100,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                fontSize: 18,
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
