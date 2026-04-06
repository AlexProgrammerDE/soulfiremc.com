import type { CSSProperties, ReactNode } from "react";
import { labelize } from "@/lib/og";

const palette = {
  bg: "#07111d",
  bgAlt: "#0c1a2c",
  panel: "rgba(10, 24, 40, 0.8)",
  panelStrong: "rgba(11, 28, 46, 0.94)",
  border: "rgba(126, 171, 214, 0.22)",
  text: "#f4fbff",
  muted: "#9cb5cb",
  cyan: "#58c7ff",
  blue: "#4a7dff",
  green: "#75f1ba",
  amber: "#ffb562",
  rose: "#ff7d99",
  violet: "#b89cff",
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

function BrandMark({
  value,
  accent,
  logoSrc,
}: {
  value: string;
  accent: string;
  logoSrc?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 112,
        height: 112,
        borderRadius: 28,
        background: `linear-gradient(135deg, ${accent}44, rgba(255,255,255,0.05))`,
        border: `1px solid ${accent}66`,
        color: palette.text,
        overflow: "hidden",
      }}
    >
      {logoSrc ? (
        // biome-ignore lint/performance/noImgElement: Takumi ImageResponse needs a plain img tag for embedded OG assets.
        <img
          src={logoSrc}
          alt={`${value} logo`}
          style={{
            width: 88,
            height: 88,
            objectFit: "contain",
          }}
        />
      ) : (
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
          }}
        >
          {value.charAt(0).toUpperCase()}
        </div>
      )}
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

function HumanizedBadges({
  badges,
  limit = 5,
}: {
  badges: string[];
  limit?: number;
}) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {badges.slice(0, limit).map((badge) => (
        <Chip key={badge}>{labelize(badge)}</Chip>
      ))}
    </div>
  );
}

export function DocsOgImage({
  title,
  description,
  slugs,
}: {
  title: string;
  description?: string | null;
  slugs: string[];
}) {
  const tocItems = [...slugs].slice(0, 4);
  const sidebar =
    tocItems.length > 0 ? tocItems : ["installation", "usage", "proxies"];

  return (
    <Canvas primary={palette.cyan} secondary={palette.blue}>
      <Eyebrow
        label="Docs"
        accent={palette.cyan}
        trailing={`/${slugs.join("/") || "overview"}`}
      />
      <div style={{ display: "flex", flex: 1, gap: 30, marginTop: 34 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                fontSize: 82,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: "-0.05em",
              }}
            >
              {title}
            </div>
            <div
              style={{
                maxWidth: 640,
                fontSize: 29,
                lineHeight: 1.35,
                color: palette.muted,
              }}
            >
              {description ||
                "Practical guidance for operating SoulFire at scale."}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Chip tone="accent">Installation</Chip>
            <Chip>Usage</Chip>
            <Chip>Automation</Chip>
            <Chip>Bot Testing</Chip>
          </div>
        </div>
        <Panel width={320}>
          <MutedLabel>Path</MutedLabel>
          <div
            style={{
              fontSize: 24,
              lineHeight: 1.35,
              color: palette.text,
              fontFamily: "Geist Mono",
            }}
          >
            {slugs.length > 0 ? slugs.join(" / ") : "index"}
          </div>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <MutedLabel>Sections</MutedLabel>
          {sidebar.map((item, index) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: index === 0 ? palette.text : palette.muted,
                fontSize: 23,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background:
                    index === 0 ? palette.cyan : "rgba(255,255,255,0.18)",
                }}
              />
              {labelize(item)}
            </div>
          ))}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 18,
              borderRadius: 20,
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${palette.border}`,
            }}
          >
            <MutedLabel>Site</MutedLabel>
            <div style={{ fontSize: 24, fontWeight: 700 }}>SoulFire Docs</div>
          </div>
        </Panel>
      </div>
    </Canvas>
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

export function HomeOgImage() {
  return (
    <Canvas primary={palette.cyan} secondary={palette.green}>
      <Eyebrow
        label="SoulFire"
        accent={palette.green}
        trailing="soulfiremc.com"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          marginTop: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 84,
              lineHeight: 0.98,
              fontWeight: 850,
              letterSpacing: "-0.06em",
            }}
          >
            Advanced Minecraft Server Stress Testing
          </div>
          <div
            style={{
              maxWidth: 820,
              fontSize: 32,
              lineHeight: 1.35,
              color: palette.muted,
            }}
          >
            Real client code. Every version. GUI, CLI, and dedicated server
            modes. Open source.
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Chip tone="accent">All Minecraft Versions</Chip>
          <Chip>Fabric Runtime</Chip>
          <Chip>GUI + CLI + Dedicated</Chip>
          <Chip>Plugin System</Chip>
          <Chip>Open Source</Chip>
        </div>
      </div>
    </Canvas>
  );
}

export function DownloadOgImage({ version }: { version?: string }) {
  return (
    <Canvas primary={palette.blue} secondary={palette.cyan}>
      <Eyebrow
        label="Download"
        accent={palette.blue}
        trailing={version ? `v${version}` : "soulfiremc.com"}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          marginTop: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 86,
              lineHeight: 0.98,
              fontWeight: 850,
              letterSpacing: "-0.06em",
            }}
          >
            Download SoulFire
          </div>
          <div
            style={{
              maxWidth: 820,
              fontSize: 32,
              lineHeight: 1.35,
              color: palette.muted,
            }}
          >
            Native installers for every platform. No Java required.
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Chip tone="accent">Windows</Chip>
          <Chip tone="accent">macOS</Chip>
          <Chip tone="accent">Linux</Chip>
          <Chip>CLI</Chip>
          <Chip>Dedicated Server</Chip>
        </div>
      </div>
    </Canvas>
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
    <Canvas primary={accent} secondary={secondary}>
      <Eyebrow label={label} accent={accent} trailing="soulfiremc.com" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          marginTop: 28,
        }}
      >
        <div style={{ display: "flex", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1 }}>
            <div
              style={{
                fontSize: 82,
                lineHeight: 1.02,
                fontWeight: 820,
                letterSpacing: "-0.05em",
              }}
            >
              {title}
            </div>
            <div
              style={{
                maxWidth: 750,
                fontSize: 30,
                lineHeight: 1.35,
                color: palette.muted,
              }}
            >
              {description}
            </div>
          </div>
          {count !== undefined ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 160,
                padding: "28px 32px",
                borderRadius: 28,
                background: `${accent}14`,
                border: `1px solid ${accent}44`,
              }}
            >
              <div style={{ fontSize: 64, fontWeight: 850, color: accent }}>
                {count}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: palette.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {label}
              </div>
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {samples.slice(0, 6).map((name) => (
            <Chip key={name}>{name}</Chip>
          ))}
          {samples.length > 6 ? (
            <Chip>{`+${samples.length - 6} more`}</Chip>
          ) : null}
        </div>
      </div>
    </Canvas>
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
    <Canvas primary={palette.cyan} secondary={palette.blue}>
      <Eyebrow
        label="Proxy"
        accent={palette.cyan}
        trailing={sponsor ? "SoulFire Sponsor" : "Proxy Provider"}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          marginTop: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <BrandMark value={name} accent={palette.cyan} logoSrc={logoSrc} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 80,
                lineHeight: 1.02,
                fontWeight: 820,
                letterSpacing: "-0.05em",
              }}
            >
              {name}
            </div>
            <div
              style={{
                maxWidth: 900,
                fontSize: 30,
                lineHeight: 1.35,
                color: palette.muted,
              }}
            >
              {testimonial}
            </div>
          </div>
        </div>
        <HumanizedBadges badges={badges} limit={6} />
      </div>
    </Canvas>
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
    <Canvas primary={palette.green} secondary={palette.amber}>
      <Eyebrow
        label="Accounts"
        accent={palette.green}
        trailing="Minecraft Provider"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          marginTop: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <BrandMark value={name} accent={palette.green} logoSrc={logoSrc} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 80,
                lineHeight: 1.02,
                fontWeight: 820,
                letterSpacing: "-0.05em",
              }}
            >
              {name}
            </div>
            <div
              style={{
                maxWidth: 900,
                fontSize: 30,
                lineHeight: 1.35,
                color: palette.muted,
              }}
            >
              {description}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {listings.map((listing) => (
            <Chip key={listing.label} tone="accent">
              {`${listing.label} · ${listing.price}`}
            </Chip>
          ))}
        </div>
      </div>
    </Canvas>
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
  return (
    <Canvas primary={palette.violet} secondary={palette.cyan}>
      <Eyebrow
        label="Resource"
        accent={palette.violet}
        trailing={
          [labelize(category), version ? `v${version}` : null, `by ${author}`]
            .filter(Boolean)
            .join(" · ")
        }
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          marginTop: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <BrandMark value={name} accent={palette.violet} logoSrc={logoSrc} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 78,
                lineHeight: 1.02,
                fontWeight: 820,
                letterSpacing: "-0.05em",
              }}
            >
              {name}
            </div>
            <div
              style={{
                maxWidth: 900,
                fontSize: 30,
                lineHeight: 1.35,
                color: palette.muted,
              }}
            >
              {description}
            </div>
          </div>
        </div>
        <HumanizedBadges badges={badges} limit={6} />
      </div>
    </Canvas>
  );
}
