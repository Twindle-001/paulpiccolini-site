/**
 * Bulk Photo Upload Tool for Sanity Studio
 *
 * Allows uploading multiple photos at once into a selected category,
 * with optional subcategory. Photos can be edited individually later.
 */

import { definePlugin } from "sanity";
import { useState, useCallback, useEffect } from "react";
import { useClient } from "sanity";
import {
  Card,
  Stack,
  Text,
  Button,
  Select,
  TextInput,
  Flex,
  Spinner,
} from "@sanity/ui";

interface Category {
  _id: string;
  title: string;
}

interface UploadItem {
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  preview: string;
  docId?: string;
}

function BulkUploadComponent() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    client
      .fetch<Category[]>(
        '*[_type == "category"] | order(order asc) { _id, title }'
      )
      .then(setCategories);
  }, [client]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const newFiles: UploadItem[] = Array.from(e.target.files).map(
        (file) => ({
          file,
          status: "pending" as const,
          preview: URL.createObjectURL(file),
        })
      );
      setFiles((prev) => [...prev, ...newFiles]);
      setDone(false);
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedCategory || files.length === 0) return;

    setUploading(true);
    setDone(false);

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === "done") continue;

      setFiles((prev) => {
        const updated = [...prev];
        updated[i] = { ...updated[i], status: "uploading" };
        return updated;
      });

      try {
        // 1. Upload the image asset
        const asset = await client.assets.upload("image", files[i].file, {
          filename: files[i].file.name,
        });

        // 2. Create the photo document
        const doc = await client.create({
          _type: "photo",
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
          },
          category: { _type: "reference", _ref: selectedCategory },
          ...(subcategory ? { subcategory } : {}),
          order: i,
        });

        setFiles((prev) => {
          const updated = [...prev];
          updated[i] = { ...updated[i], status: "done", docId: doc._id };
          return updated;
        });
      } catch (err) {
        console.error("Upload error:", err);
        setFiles((prev) => {
          const updated = [...prev];
          updated[i] = { ...updated[i], status: "error" };
          return updated;
        });
      }
    }

    setUploading(false);
    setDone(true);
  }, [client, files, selectedCategory, subcategory]);

  const reset = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setDone(false);
    setSubcategory("");
  }, [files]);

  const doneCount = files.filter((f) => f.status === "done").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <Card padding={5} sizing="border" style={{ overflow: "auto" }}>
      <Card
        padding={4}
        style={{ maxWidth: 900, margin: "0 auto" }}
        radius={3}
      >
        <Stack space={5}>
          <Text size={4} weight="bold">
            Upload en masse de photos
          </Text>
          <Text size={1} muted>
            Sélectionnez une catégorie, ajoutez vos photos, et elles seront
            toutes créées d&apos;un coup. Vous pourrez les éditer
            individuellement ensuite (titre, texte SEO, sous-catégorie, etc.).
          </Text>

          {/* Category selector */}
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Catégorie *
            </Text>
            <Select
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedCategory(e.currentTarget.value)
              }
            >
              <option value="">-- Choisir une catégorie --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
            </Select>
          </Stack>

          {/* Subcategory (optional) */}
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Sous-catégorie (optionnel)
            </Text>
            <TextInput
              value={subcategory}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSubcategory(e.currentTarget.value)
              }
              placeholder="Ex: Monuments, Street, Nuit..."
            />
          </Stack>

          {/* File input */}
          <Stack space={3}>
            <Text size={1} weight="semibold">
              Photos
            </Text>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              style={{ fontSize: 14 }}
            />
          </Stack>

          {/* Preview grid */}
          {files.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 8,
              }}
            >
              {files.map((item, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    borderRadius: 4,
                    overflow: "hidden",
                    border:
                      item.status === "done"
                        ? "2px solid #4caf50"
                        : item.status === "error"
                          ? "2px solid #f44336"
                          : item.status === "uploading"
                            ? "2px solid #ff9800"
                            : "2px solid transparent",
                  }}
                >
                  <img
                    src={item.preview}
                    alt=""
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      display: "block",
                      opacity: item.status === "uploading" ? 0.5 : 1,
                    }}
                  />
                  {item.status === "uploading" && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Spinner />
                    </div>
                  )}
                  {item.status === "done" && (
                    <div
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        background: "#4caf50",
                        color: "#fff",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                      }}
                    >
                      ✓
                    </div>
                  )}
                  {item.status === "pending" && !uploading && (
                    <button
                      onClick={() => removeFile(i)}
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        cursor: "pointer",
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Status */}
          {files.length > 0 && (
            <Text size={1} muted>
              {doneCount}/{files.length} photos uploadées
              {errorCount > 0 &&
                ` (${errorCount} erreur${errorCount > 1 ? "s" : ""})`}
            </Text>
          )}

          {/* Actions */}
          <Flex gap={3}>
            <Button
              text={
                uploading
                  ? "Upload en cours..."
                  : `Uploader ${files.length} photo${files.length !== 1 ? "s" : ""}`
              }
              tone="primary"
              onClick={handleUpload}
              disabled={!selectedCategory || files.length === 0 || uploading}
            />
            {files.length > 0 && !uploading && (
              <Button text="Réinitialiser" tone="default" onClick={reset} />
            )}
          </Flex>

          {/* Success message */}
          {done && errorCount === 0 && (
            <Card tone="positive" padding={3} radius={2}>
              <Text size={1}>
                {doneCount} photo{doneCount > 1 ? "s" : ""} uploadée
                {doneCount > 1 ? "s" : ""} avec succès ! Retrouvez-les dans
                Backoffice → Photos pour les éditer individuellement.
              </Text>
            </Card>
          )}
        </Stack>
      </Card>
    </Card>
  );
}

export const bulkUploadPlugin = definePlugin({
  name: "bulk-upload",
  tools: [
    {
      name: "bulk-upload",
      title: "Upload en masse",
      icon: () => <span style={{ fontSize: 20 }}>⬆️</span>,
      component: BulkUploadComponent,
    },
  ],
});
