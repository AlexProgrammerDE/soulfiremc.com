import type { CSSProperties, ReactNode } from "react";
import { labelize } from "@/lib/og";

const palette = {
  bg: "#040c18",
  bgAlt: "#0a1628",
  panel: "rgba(8, 20, 36, 0.85)",
  panelStrong: "rgba(10, 24, 44, 0.94)",
  border: "rgba(120, 170, 220, 0.18)",
  text: "#f0f6ff",
  muted: "#8daec8",
  cyan: "#4cc9ff",
  blue: "#4a7dff",
  green: "#5ef0a8",
  amber: "#ffb04a",
  rose: "#ff6b8a",
  violet: "#a98aff",
};

function canvasBackground(primary: string, secondary: string) {
  return {
    backgroundColor: palette.bg,
    backgroundImage: [
      "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
      "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      `radial-gradient(circle at 18% 18%, ${primary}30 0, transparent 34%)`,
      `radial-gradient(circle at 82% 22%, ${secondary}28 0, transparent 30%)`,
      "linear-gradient(135deg, #07111d 0%, #0c1828 44%, #08101b 100%)",
    ].join(", "),
    backgroundSize: "36px 36px, 36px 36px, auto, auto, auto",
  } satisfies CSSProperties;
}

function Canvas({
  primary,
  secondary,
  children,
}: {
  primary: string;
  secondary: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        ...canvasBackground(primary, secondary),
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        color: palette.text,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 28,
          borderRadius: 34,
          border: `1px solid ${palette.border}`,
          background: "rgba(5, 12, 20, 0.32)",
          boxShadow: "0 30px 100px rgba(0, 0, 0, 0.32)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -70,
          right: -50,
          width: 340,
          height: 340,
          borderRadius: 999,
          background: `${secondary}22`,
          filter: "blur(28px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -90,
          left: 10,
          width: 420,
          height: 260,
          borderRadius: 999,
          background: `${primary}1f`,
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: 52,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Eyebrow({
  label,
  accent,
  trailing,
}: {
  label: string;
  accent: string;
  trailing?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 110,
            padding: "10px 16px",
            borderRadius: 999,
            background: `${accent}20`,
            border: `1px solid ${accent}55`,
            color: accent,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
        <div
          style={{
            width: 72,
            height: 2,
            background: `linear-gradient(90deg, ${accent}, transparent)`,
          }}
        />
      </div>
      {trailing ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "9px 14px",
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.06)",
            border: `1px solid ${palette.border}`,
            color: palette.muted,
            fontSize: 18,
            fontFamily: "Geist Mono",
          }}
        >
          {trailing}
        </div>
      ) : null}
    </div>
  );
}

function Panel({ children, width }: { children: ReactNode; width?: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: width ? `${width}px` : undefined,
        borderRadius: 28,
        border: `1px solid ${palette.border}`,
        background: palette.panel,
        padding: 24,
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}

function Chip({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "accent";
}) {
  const background =
    tone === "accent"
      ? "rgba(255, 255, 255, 0.12)"
      : "rgba(255, 255, 255, 0.06)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 14px",
        borderRadius: 999,
        background,
        border: `1px solid ${palette.border}`,
        color: palette.text,
        fontSize: 18,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

function MutedLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        color: palette.muted,
        fontSize: 18,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        flex: 1,
        padding: "18px 20px",
        borderRadius: 22,
        background: palette.panelStrong,
        border: `1px solid ${palette.border}`,
      }}
    >
      <div
        style={{
          fontSize: 16,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: palette.muted,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: accent,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function BlogOgImage({
  title,
  description,
  author,
  date,
  tags,
  readTime,
}: {
  title: string;
  description?: string | null;
  author?: string | null;
  date?: string | null;
  tags?: string[];
  readTime?: string;
}) {
  return (
    <Canvas primary={palette.amber} secondary={palette.rose}>
      <Eyebrow
        label="Blog"
        accent={palette.amber}
        trailing={author || "SoulFire Team"}
      />
      <div style={{ display: "flex", flex: 1, gap: 28, marginTop: 34 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1.1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                fontSize: 80,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              {title}
            </div>
            <div
              style={{
                maxWidth: 680,
                fontSize: 29,
                lineHeight: 1.35,
                color: palette.muted,
              }}
            >
              {description ||
                "Fresh notes on Minecraft bot testing, operations, and SoulFire development."}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {(tags && tags.length > 0
              ? tags.slice(0, 4)
              : ["Minecraft", "Testing"]
            ).map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
        </div>
        <Panel width={340}>
          <MutedLabel>Article</MutedLabel>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              padding: 22,
              borderRadius: 24,
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${palette.border}`,
            }}
          >
            <div style={{ fontSize: 24, color: palette.text, fontWeight: 700 }}>
              Editorial Notes
            </div>
            <div
              style={{ fontSize: 22, color: palette.muted, lineHeight: 1.45 }}
            >
              Structured, practical write-ups for operators stress testing
              Minecraft servers or building automation around SoulFire.
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Metric
              label="Published"
              value={date || "Latest"}
              accent={palette.amber}
            />
            <Metric
              label="Read Time"
              value={readTime || "5 min"}
              accent={palette.rose}
            />
          </div>
        </Panel>
      </div>
    </Canvas>
  );
}

const opsPalette = {
  ink: "#040913",
  inkAlt: "#0a1422",
  surface: "rgba(10, 18, 31, 0.84)",
  surfaceStrong: "rgba(12, 22, 37, 0.95)",
  border: "rgba(129, 165, 205, 0.18)",
  borderStrong: "rgba(186, 212, 240, 0.24)",
  text: "#f6fbff",
  muted: "#98aec4",
  mutedStrong: "#c8d7e7",
  dim: "#61758b",
};

function fitTitleSize(
  value: string,
  {
    base,
    medium,
    long,
    xlong,
  }: {
    base: number;
    medium: number;
    long: number;
    xlong: number;
  },
) {
  if (value.length > 34) return xlong;
  if (value.length > 24) return long;
  if (value.length > 14) return medium;
  return base;
}

function opsCanvasBackground(accent: string, secondary: string) {
  return {
    backgroundColor: opsPalette.ink,
    backgroundImage: [
      "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
      "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      `radial-gradient(circle at 14% 84%, ${accent}28 0, transparent 34%)`,
      `radial-gradient(circle at 87% 18%, ${secondary}2a 0, transparent 30%)`,
      "linear-gradient(132deg, rgba(255,255,255,0.025) 0 34%, transparent 34% 100%)",
      "linear-gradient(142deg, #07101c 0%, #040913 40%, #0a1525 100%)",
    ].join(", "),
    backgroundSize: "56px 56px, 56px 56px, auto, auto, auto, auto",
  } satisfies CSSProperties;
}

function OpsCanvas({
  section,
  accent,
  secondary,
  rail,
  railWidth = 288,
  children,
}: {
  section: string;
  accent: string;
  secondary: string;
  rail?: ReactNode;
  railWidth?: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        ...opsCanvasBackground(accent, secondary),
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        color: opsPalette.text,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 24,
          borderRadius: 34,
          border: `1px solid ${opsPalette.border}`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -110,
          right: 118,
          width: 308,
          height: 900,
          borderRadius: 54,
          background: `linear-gradient(180deg, ${secondary}1f 0%, transparent 42%, ${accent}26 100%)`,
          transform: "rotate(14deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 112,
          right: 36,
          bottom: 34,
          width: `${railWidth}px`,
          borderRadius: 32,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))",
          border: `1px solid ${opsPalette.border}`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 44,
          right: 44,
          height: 1,
          background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.08) 28%, transparent 72%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 38,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 16px",
            borderRadius: 999,
            border: `1px solid ${accent}55`,
            background: `linear-gradient(135deg, ${accent}28, rgba(255,255,255,0.04))`,
            color: opsPalette.text,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          SoulFire
        </div>
        <div
          style={{
            width: 54,
            height: 2,
            background: `linear-gradient(90deg, ${accent}, transparent)`,
          }}
        />
        <div
          style={{
            color: opsPalette.muted,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
          }}
        >
          {section}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 48,
          top: 40,
          display: "flex",
          alignItems: "center",
          padding: "9px 16px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${opsPalette.border}`,
          color: opsPalette.mutedStrong,
          fontSize: 18,
          fontFamily: "Geist Mono",
        }}
      >
        soulfiremc.com
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "116px 40px 34px 40px",
          gap: 26,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            flexGrow: 1,
          }}
        >
          {children}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: `${railWidth}px`,
            gap: 16,
            minWidth: `${railWidth}px`,
          }}
        >
          {rail}
        </div>
      </div>
    </div>
  );
}

function OpsTag({
  children,
  accent,
  tone = "neutral",
}: {
  children: ReactNode;
  accent: string;
  tone?: "neutral" | "accent";
}) {
  const accentTone = tone === "accent";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 14px",
        borderRadius: 18,
        background: accentTone
          ? `linear-gradient(135deg, ${accent}20, rgba(255,255,255,0.04))`
          : "rgba(255,255,255,0.045)",
        border: `1px solid ${accentTone ? `${accent}4f` : opsPalette.border}`,
        color: accentTone ? opsPalette.text : opsPalette.mutedStrong,
        fontSize: 18,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  );
}

function OpsRailCard({
  accent,
  grow,
  children,
}: {
  accent: string;
  grow?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        flexGrow: grow ? 1 : 0,
        padding: 20,
        borderRadius: 26,
        background:
          "linear-gradient(180deg, rgba(12,22,37,0.94), rgba(9,16,28,0.88))",
        border: `1px solid ${opsPalette.border}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 1,
          background: `linear-gradient(90deg, ${accent}, transparent 82%)`,
        }}
      />
      {children}
    </div>
  );
}

function OpsCardLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        color: opsPalette.dim,
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function OpsFactList({
  rows,
  accent,
}: {
  rows: { label: string; value: string }[];
  accent: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {rows.map((row, index) => (
        <div
          key={`${row.label}-${row.value}`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            paddingTop: index === 0 ? 0 : 14,
            marginTop: index === 0 ? 0 : 14,
            borderTop:
              index === 0 ? undefined : `1px solid ${opsPalette.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: accent,
              }}
            />
            <div
              style={{
                color: opsPalette.dim,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {row.label}
            </div>
          </div>
          <div
            style={{
              color: opsPalette.text,
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function OpsPriceList({
  listings,
  accent,
}: {
  listings: { label: string; price: string }[];
  accent: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {listings.map((listing) => (
        <div
          key={`${listing.label}-${listing.price}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            padding: "12px 14px",
            borderRadius: 18,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${opsPalette.border}`,
          }}
        >
          <div
            style={{
              color: opsPalette.muted,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {listing.label}
          </div>
          <div
            style={{
              color: accent,
              fontSize: 26,
              fontWeight: 800,
              fontFamily: "Geist Mono",
            }}
          >
            {listing.price}
          </div>
        </div>
      ))}
    </div>
  );
}

function OpsLogoPlate({
  value,
  accent,
  secondary,
  logoSrc,
}: {
  value: string;
  accent: string;
  secondary: string;
  logoSrc?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 210,
        borderRadius: 28,
        background: `linear-gradient(145deg, ${accent}18, rgba(255,255,255,0.03) 45%, ${secondary}12 100%)`,
        border: `1px solid ${accent}45`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 14,
          borderRadius: 20,
          border: `1px solid ${opsPalette.borderStrong}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -32,
          right: -12,
          width: 160,
          height: 160,
          borderRadius: 999,
          background: `${secondary}20`,
          filter: "blur(16px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          top: 22,
          height: 1,
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />
      {logoSrc ? (
        // biome-ignore lint/performance/noImgElement: Takumi ImageResponse needs a plain img tag for embedded OG assets.
        <img
          src={logoSrc}
          alt={`${value} logo`}
          style={{
            width: 126,
            height: 126,
            objectFit: "contain",
          }}
        />
      ) : (
        <div
          style={{
            color: opsPalette.text,
            fontSize: 82,
            fontWeight: 850,
            letterSpacing: "-0.04em",
          }}
        >
          {value.charAt(0).toUpperCase()}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: 20,
          bottom: 18,
          color: opsPalette.dim,
          fontSize: 13,
          fontFamily: "Geist Mono",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        {value.slice(0, 12)}
      </div>
    </div>
  );
}

function OpsSignalBoard({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: string;
}) {
  const visibleItems = items.slice(0, 4);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 20,
        borderRadius: 28,
        background:
          "linear-gradient(180deg, rgba(12,22,37,0.94), rgba(8,15,26,0.88))",
        border: `1px solid ${opsPalette.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div
          style={{
            color: opsPalette.text,
            fontSize: 22,
            fontWeight: 750,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: accent,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Live Feed
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visibleItems.map((item, index) => (
          <div
            key={`${index + 1}-${item}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                minWidth: 34,
                color: accent,
                fontSize: 17,
                fontWeight: 800,
                fontFamily: "Geist Mono",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                minWidth: 0,
                flexGrow: 1,
                color: index === 0 ? opsPalette.text : opsPalette.mutedStrong,
                fontSize: 20,
                fontWeight: index === 0 ? 700 : 650,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpsHumanizedTags({
  badges,
  accent,
  emphasize,
}: {
  badges: string[];
  accent: string;
  emphasize?: string;
}) {
  const normalized = badges.slice(0, 6).map((badge) => labelize(badge));
  const ordered = emphasize
    ? [emphasize, ...normalized.filter((badge) => badge !== emphasize)]
    : normalized;

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {ordered.map((badge, index) => (
        <OpsTag
          key={badge}
          accent={accent}
          tone={index === 0 && emphasize ? "accent" : "neutral"}
        >
          {badge}
        </OpsTag>
      ))}
    </div>
  );
}

export function HomeOgImage() {
  return (
    <OpsCanvas
      section="Core Platform"
      accent={palette.green}
      secondary={palette.cyan}
      rail={
        <>
          <OpsRailCard accent={palette.green}>
            <OpsCardLabel>Runtime</OpsCardLabel>
            <div
              style={{
                fontSize: 50,
                lineHeight: 0.96,
                fontWeight: 860,
                letterSpacing: "-0.05em",
              }}
            >
              Real
              <br />
              Clients
            </div>
            <div
              style={{
                color: opsPalette.muted,
                fontSize: 20,
                lineHeight: 1.45,
              }}
            >
              Real protocol behavior for production-style bot sessions.
            </div>
          </OpsRailCard>
          <OpsRailCard accent={palette.cyan} grow>
            <OpsCardLabel>Modes</OpsCardLabel>
            <OpsFactList
              accent={palette.cyan}
              rows={[
                { label: "Interfaces", value: "GUI, CLI, Dedicated" },
                { label: "Coverage", value: "All Minecraft versions" },
              ]}
            />
          </OpsRailCard>
        </>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          gap: 26,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: palette.green,
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            Operations Console
          </div>
          <div
            style={{
              maxWidth: 760,
              fontSize: 92,
              lineHeight: 0.92,
              fontWeight: 870,
              letterSpacing: "-0.065em",
            }}
          >
            Advanced Minecraft Stress Testing
          </div>
          <div
            style={{
              maxWidth: 720,
              color: opsPalette.muted,
              fontSize: 31,
              lineHeight: 1.34,
            }}
          >
            Real client code across versions with GUI, CLI, and dedicated server
            workflows.
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <OpsTag accent={palette.green} tone="accent">
            All Versions
          </OpsTag>
          <OpsTag accent={palette.green}>GUI + CLI</OpsTag>
          <OpsTag accent={palette.green}>Plugins</OpsTag>
          <OpsTag accent={palette.green}>Open Source</OpsTag>
        </div>
      </div>
    </OpsCanvas>
  );
}

export function DownloadOgImage({ version }: { version?: string }) {
  return (
    <OpsCanvas
      section="Distribution"
      accent={palette.blue}
      secondary={palette.cyan}
      rail={
        <>
          <OpsRailCard accent={palette.blue}>
            <OpsCardLabel>Install</OpsCardLabel>
            <div
              style={{
                fontSize: 52,
                lineHeight: 0.96,
                fontWeight: 860,
                letterSpacing: "-0.05em",
              }}
            >
              No
              <br />
              Java
            </div>
            <div
              style={{
                color: opsPalette.muted,
                fontSize: 20,
                lineHeight: 1.45,
              }}
            >
              Native builds for desktop and server deployments.
            </div>
          </OpsRailCard>
          <OpsRailCard accent={palette.cyan} grow>
            <OpsCardLabel>{version ? `v${version}` : "Packages"}</OpsCardLabel>
            <OpsFactList
              accent={palette.cyan}
              rows={[
                { label: "Desktop", value: "Windows, macOS, Linux" },
                { label: "Server", value: "CLI and Dedicated" },
              ]}
            />
          </OpsRailCard>
        </>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          gap: 26,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: palette.blue,
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            Native Distribution
          </div>
          <div
            style={{
              maxWidth: 760,
              fontSize: 92,
              lineHeight: 0.92,
              fontWeight: 870,
              letterSpacing: "-0.065em",
            }}
          >
            Download SoulFire
          </div>
          <div
            style={{
              maxWidth: 720,
              color: opsPalette.muted,
              fontSize: 31,
              lineHeight: 1.34,
            }}
          >
            Native installers for every platform, with desktop and server
            workflows ready out of the box.
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <OpsTag accent={palette.blue} tone="accent">
            Windows
          </OpsTag>
          <OpsTag accent={palette.blue} tone="accent">
            macOS
          </OpsTag>
          <OpsTag accent={palette.blue} tone="accent">
            Linux
          </OpsTag>
          <OpsTag accent={palette.blue}>CLI</OpsTag>
          <OpsTag accent={palette.blue}>Dedicated Server</OpsTag>
        </div>
      </div>
    </OpsCanvas>
  );
}

export function DirectoryOgImage({
  label,
  title,
  description,
  accent,
  secondary,
  count,
  samples,
}: {
  label: string;
  title: string;
  description: string;
  accent: string;
  secondary: string;
  count?: number;
  samples: string[];
}) {
  return (
    <OpsCanvas
      section={`${label} Directory`}
      accent={accent}
      secondary={secondary}
      rail={
        <>
          {count !== undefined ? (
            <OpsRailCard accent={accent}>
              <OpsCardLabel>Total</OpsCardLabel>
              <div
                style={{
                  fontSize: 84,
                  lineHeight: 0.9,
                  fontWeight: 860,
                  letterSpacing: "-0.06em",
                  color: accent,
                }}
              >
                {count}
              </div>
              <div
                style={{
                  color: opsPalette.muted,
                  fontSize: 18,
                  lineHeight: 1.45,
                }}
              >
                Curated entries for SoulFire workflows and operator research.
              </div>
            </OpsRailCard>
          ) : null}
          <OpsRailCard accent={secondary} grow>
            <OpsCardLabel>Browse</OpsCardLabel>
            <OpsFactList
              accent={secondary}
              rows={[
                { label: "Collection", value: label },
                { label: "Mode", value: "Directory and comparison" },
              ]}
            />
          </OpsRailCard>
        </>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          gap: 24,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              color: accent,
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            Curated Index
          </div>
          <div
            style={{
              maxWidth: 730,
              fontSize: fitTitleSize(title, {
                base: 84,
                medium: 74,
                long: 66,
                xlong: 58,
              }),
              lineHeight: 0.96,
              fontWeight: 860,
              letterSpacing: "-0.06em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              maxWidth: 710,
              color: opsPalette.muted,
              fontSize: 30,
              lineHeight: 1.36,
            }}
          >
            {description}
          </div>
        </div>
        <OpsSignalBoard
          title="Latest Entries"
          items={samples}
          accent={accent}
        />
      </div>
    </OpsCanvas>
  );
}

export function ProxyOgImage({
  name,
  testimonial,
  badges,
  sponsor,
  logoSrc,
}: {
  name: string;
  testimonial: string;
  badges: string[];
  sponsor?: boolean;
  logoSrc?: string;
}) {
  return (
    <OpsCanvas
      section={sponsor ? "Sponsored Proxy" : "Proxy Profile"}
      accent={palette.cyan}
      secondary={palette.blue}
      rail={
        <>
          <OpsLogoPlate
            value={name}
            accent={palette.cyan}
            secondary={palette.blue}
            logoSrc={logoSrc}
          />
          <OpsRailCard accent={palette.blue} grow>
            <OpsCardLabel>Provider Notes</OpsCardLabel>
            <OpsFactList
              accent={palette.cyan}
              rows={[
                {
                  label: "Status",
                  value: sponsor ? "SoulFire Sponsor" : "Listed Provider",
                },
                {
                  label: "Highlights",
                  value:
                    badges.length > 0
                      ? badges
                          .slice(0, 2)
                          .map((badge) => labelize(badge))
                          .join(" · ")
                      : "Proxy Network",
                },
              ]}
            />
          </OpsRailCard>
        </>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          gap: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: palette.cyan,
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            Network Profile
          </div>
          <div
            style={{
              maxWidth: 730,
              fontSize: fitTitleSize(name, {
                base: 88,
                medium: 80,
                long: 72,
                xlong: 64,
              }),
              lineHeight: 0.94,
              fontWeight: 860,
              letterSpacing: "-0.06em",
            }}
          >
            {name}
          </div>
          <div
            style={{
              maxWidth: 720,
              color: opsPalette.muted,
              fontSize: 31,
              lineHeight: 1.35,
            }}
          >
            {testimonial}
          </div>
        </div>
        <OpsHumanizedTags
          badges={badges}
          accent={palette.cyan}
          emphasize={sponsor ? "SoulFire Sponsor" : undefined}
        />
      </div>
    </OpsCanvas>
  );
}

export function AccountOgImage({
  name,
  listings,
  description,
  logoSrc,
}: {
  name: string;
  listings: { label: string; price: string }[];
  description: string;
  logoSrc?: string;
}) {
  return (
    <OpsCanvas
      section="Account Provider"
      accent={palette.green}
      secondary={palette.amber}
      rail={
        <>
          <OpsLogoPlate
            value={name}
            accent={palette.green}
            secondary={palette.amber}
            logoSrc={logoSrc}
          />
          <OpsRailCard accent={palette.amber} grow>
            <OpsCardLabel>Listings</OpsCardLabel>
            <OpsPriceList listings={listings} accent={palette.amber} />
          </OpsRailCard>
        </>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          gap: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: palette.green,
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            Marketplace Profile
          </div>
          <div
            style={{
              maxWidth: 730,
              fontSize: fitTitleSize(name, {
                base: 88,
                medium: 80,
                long: 72,
                xlong: 64,
              }),
              lineHeight: 0.94,
              fontWeight: 860,
              letterSpacing: "-0.06em",
            }}
          >
            {name}
          </div>
          <div
            style={{
              maxWidth: 720,
              color: opsPalette.muted,
              fontSize: 31,
              lineHeight: 1.35,
            }}
          >
            {description}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {listings.map((listing) => (
            <OpsTag
              key={`${listing.label}-${listing.price}`}
              accent={palette.green}
              tone="accent"
            >
              {`${listing.label} · ${listing.price}`}
            </OpsTag>
          ))}
        </div>
      </div>
    </OpsCanvas>
  );
}

export function ResourceOgImage({
  name,
  description,
  author,
  category,
  badges,
  version,
  logoSrc,
}: {
  name: string;
  description: string;
  author: string;
  category: string;
  badges: string[];
  version?: string;
  logoSrc?: string;
}) {
  const metadataRows = [
    { label: "Category", value: labelize(category) },
    { label: "Author", value: author },
    ...(version ? [{ label: "Version", value: `v${version}` }] : []),
  ];

  return (
    <OpsCanvas
      section="Community Resource"
      accent={palette.violet}
      secondary={palette.cyan}
      rail={
        <>
          <OpsLogoPlate
            value={name}
            accent={palette.violet}
            secondary={palette.cyan}
            logoSrc={logoSrc}
          />
          <OpsRailCard accent={palette.cyan} grow>
            <OpsCardLabel>Metadata</OpsCardLabel>
            <OpsFactList accent={palette.violet} rows={metadataRows} />
          </OpsRailCard>
        </>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          gap: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: palette.violet,
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            Plugin and Script Catalog
          </div>
          <div
            style={{
              maxWidth: 730,
              fontSize: fitTitleSize(name, {
                base: 82,
                medium: 74,
                long: 66,
                xlong: 58,
              }),
              lineHeight: 0.96,
              fontWeight: 860,
              letterSpacing: "-0.06em",
            }}
          >
            {name}
          </div>
          <div
            style={{
              maxWidth: 720,
              color: opsPalette.muted,
              fontSize: 31,
              lineHeight: 1.35,
            }}
          >
            {description}
          </div>
        </div>
        <OpsHumanizedTags badges={badges} accent={palette.violet} />
      </div>
    </OpsCanvas>
  );
}
