import { useCallback, useEffect, useState } from "react";
import { type ObjectInputProps, useClient } from "sanity";
import imageUrlBuilder from "@sanity/image-url";

/**
 * Custom Sanity input component that wraps the default image input
 * and adds a live preview showing how the banner will actually render
 * on desktop (panoramic 1920×400) and mobile (portrait 800×1000).
 */
export function BannerDesktopPreview(props: ObjectInputProps) {
  const client = useClient({ apiVersion: "2024-01-01" });
  const builder = imageUrlBuilder(client);
  const { value } = props;

  const imageValue = value as any;
  const hasImage = imageValue?.asset?._ref;

  return (
    <div>
      {props.renderDefault(props)}
      {hasImage && (
        <div style={{ marginTop: 12 }}>
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
            Aperçu Desktop (ratio réel)
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
              alt="Aperçu desktop"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              Rendu desktop
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function BannerMobilePreview(props: ObjectInputProps) {
  const client = useClient({ apiVersion: "2024-01-01" });
  const builder = imageUrlBuilder(client);
  const { value } = props;

  const imageValue = value as any;
  const hasImage = imageValue?.asset?._ref;

  return (
    <div>
      {props.renderDefault(props)}
      {hasImage && (
        <div style={{ marginTop: 12 }}>
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
            Aperçu Mobile (ratio réel)
          </div>
          <div
            style={{
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid #333",
              maxWidth: 250,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "133%", // 3:4 ratio
              }}
            >
              <img
                src={builder.image(imageValue).width(800).quality(80).url()}
                alt="Aperçu mobile"
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
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}
              >
                Rendu mobile
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
