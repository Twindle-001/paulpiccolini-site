import { type ObjectInputProps, useClient } from "sanity";
import imageUrlBuilder from "@sanity/image-url";

/**
 * Unified Banner Preview Ã¢ÂÂ single image upload with dual desktop + mobile preview.
 * Shows how the banner will render on desktop (1920x400) and mobile (16:9 ratio).
 * Uses the Sanity hotspot to control mobile crop positioning.
 */
export function UnifiedBannerPreview(props: ObjectInputProps) {
  const client = useClient({ apiVersion: "2024-01-01" });
  const builder = imageUrlBuilder(client);
  const { value } = props;
  const imageValue = value as any;
  const hasImage = imageValue?.asset?._ref;

  return (
    <div>
      {props.renderDefault(props)}
      {hasImage && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {/* Desktop Preview */}
          <div style={{ flex: "1 1 60%", minWidth: 280 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#8a8a8a",
                marginBottom: 6,
              }}
            >
              Rendu Desktop (1920 x 400)
            </div>
            <div
              style={{
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid #333",
                position: "relative",
              }}
            >
              <img
                src={builder
                  .image(imageValue)
                  .width(1920)
                  .height(400)
                  .fit("crop")
                  .quality(80)
                  .url()}
                alt="Apercu desktop"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}
              >
                Desktop
              </div>
            </div>
          </div>

          {/* Mobile Preview */}
          <div style={{ flex: "0 0 auto", width: 280 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#8a8a8a",
                marginBottom: 6,
              }}
            >
              Rendu Mobile (16:9)
            </div>
            <div
              style={{
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid #333",
                width: 160,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "56.25%",
                }}
              >
                <img
                  src={builder.image(imageValue).width(800).quality(80).url()}
                  alt="Apercu mobile"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: imageValue?.hotspot
                      ? `${Math.round(imageValue.hotspot.x * 100)}% ${Math.round(imageValue.hotspot.y * 100)}%`
                      : "center center",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                  }}
                >
                  Mobile
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {hasImage && (
        <div
          style={{
            marginTop: 8,
            padding: "8px 12px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 4,
            fontSize: 11,
            color: "#999",
            lineHeight: 1.5,
          }}
        >
          Utilisez le <strong style={{ color: "#ccc" }}>hotspot</strong> (point
          de focus) pour ajuster le cadrage mobile. Le desktop utilise un crop
          centre automatique.
        </div>
      )}
    </div>
  );
}

// Backward-compatible exports
export const BannerDesktopPreview = UnifiedBannerPreview;
export const BannerMobilePreview = UnifiedBannerPreview;
