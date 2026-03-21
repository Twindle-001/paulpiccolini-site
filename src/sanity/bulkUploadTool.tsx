"use client";

import React, { useCallback, useEffect, useState } from "react";
import { definePlugin, useClient } from "sanity";
import {
  Card,
  Stack,
  Text,
  Button,
  Select,
  Flex,
  Spinner,
  Box,
  Badge,
  TextInput,
} from "@sanity/ui";

interface Category {
  _id: string;
  title: { fr?: string; en?: string };
}

interface UploadItem {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  preview: string;
  docId?: string;
  error?: string;
}

const BulkUploadComponent = () => {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [existingSubcategories, setExistingSubcategories] = useState<string[]>(
    []
  );
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const docs = await client.fetch<Category[]>(
          `*[_type == "category"] | order(title.fr asc)`
        );
        setCategories(docs);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [client]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) {
        setExistingSubcategories([]);
        setSelectedSubcategory("");
        return;
      }
      try {
        setSubcategoriesLoading(true);
        const subcategories = await client.fetch<string[]>(
          `array::unique(*[_type == "photo" && category._ref == $categoryId && defined(subcategory) && subcategory != ""].subcategory) | order(@ asc)`,
          { categoryId: selectedCategory }
        );
        setExistingSubcategories(subcategories || []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setSubcategoriesLoading(false);
      }
    };
    fetchSubcategories();
  }, [selectedCategory, client]);

  // Cleanup preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      uploadItems.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [uploadItems]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.currentTarget.files;
      if (!files) return;
      const newItems: UploadItem[] = Array.from(files).map((file) => ({
        file,
        status: "pending" as const,
        preview: URL.createObjectURL(file),
      }));
      setUploadItems(newItems);
      setUploadProgress(0);
      setSuccessCount(0);
    },
    []
  );

  const uploadInBatches = useCallback(
    async (items: UploadItem[], batchSize: number = 3) => {
      const BATCH_DELAY = 500;
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchPromises = batch.map(async (item) => {
          setUploadItems((prev) =>
            prev.map((u) =>
              u.file === item.file ? { ...u, status: "uploading" as const } : u
            )
          );
          try {
            const imageAsset = await client.assets.upload("image", item.file);
            const photoDoc: Record<string, unknown> = {
              _type: "photo",
              image: {
                _type: "image",
                asset: { _type: "reference", _ref: imageAsset._id },
              },
              category: { _type: "reference", _ref: selectedCategory },
              order: Date.now() + Math.random(),
            };
            if (selectedSubcategory) {
              photoDoc.subcategory = selectedSubcategory;
            }
            const createdDoc = await client.create(photoDoc);
            setUploadItems((prev) =>
              prev.map((u) =>
                u.file === item.file
                  ? { ...u, status: "success" as const, docId: createdDoc._id }
                  : u
              )
            );
            setSuccessCount((prev) => prev + 1);
            setUploadProgress((prev) => prev + 1);
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Erreur inconnue";
            setUploadItems((prev) =>
              prev.map((u) =>
                u.file === item.file
                  ? { ...u, status: "error" as const, error: errorMessage }
                  : u
              )
            );
            setUploadProgress((prev) => prev + 1);
          }
        });
        await Promise.all(batchPromises);
        if (i + batchSize < items.length) {
          await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
        }
      }
    },
    [client, selectedCategory, selectedSubcategory]
  );

  const handleUpload = async () => {
    if (!selectedCategory || uploadItems.length === 0) {
      alert("Sélectionnez une catégorie et des photos");
      return;
    }
    setIsUploading(true);
    await uploadInBatches(uploadItems);
    setIsUploading(false);
  };

  const getCategoryTitle = (cat: Category): string => {
    return cat.title?.fr || cat.title?.en || "Sans titre";
  };

  const filteredSubcategories = selectedSubcategory
    ? existingSubcategories.filter((s) =>
        s.toLowerCase().includes(selectedSubcategory.toLowerCase())
      )
    : existingSubcategories;

  const totalPhotos = uploadItems.length;
  const progressPercent =
    totalPhotos > 0 ? Math.round((uploadProgress / totalPhotos) * 100) : 0;

  return (
    <Card>
      <Stack space={4} padding={4}>
        <Box>
          <Text as="h2" size={1} weight="bold">
            Import en masse
          </Text>
        </Box>
        <Stack space={3}>
          <Box>
            <Text size={0} weight="semibold" as="label">
              Catégorie *
            </Text>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.currentTarget.value)}
              disabled={isUploading}
            >
              <option value="">-- Sélectionner une catégorie --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {getCategoryTitle(cat)}
                </option>
              ))}
            </Select>
          </Box>
          {selectedCategory && (
            <Box>
              <Stack space={2}>
                <Text size={0} weight="semibold" as="label">
                  Sous-catégorie (optionnel)
                </Text>
                <TextInput
                  value={selectedSubcategory}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedSubcategory(e.currentTarget.value)
                  }
                  placeholder="Taper ou sélectionner une sous-catégorie..."
                  disabled={isUploading}
                  fontSize={1}
                />
                {subcategoriesLoading && (
                  <Text size={0} muted>
                    Chargement...
                  </Text>
                )}
                {!subcategoriesLoading && filteredSubcategories.length > 0 && (
                  <Card padding={2} radius={2} tone="transparent">
                    <Stack space={2}>
                      <Text size={0} muted>
                        Sous-catégories existantes :
                      </Text>
                      <Flex wrap="wrap" gap={2}>
                        {filteredSubcategories.map((sub) => (
                          <Button
                            key={sub}
                            text={sub}
                            mode={selectedSubcategory === sub ? "default" : "ghost"}
                            tone={selectedSubcategory === sub ? "primary" : "default"}
                            fontSize={1}
                            padding={2}
                            onClick={() => setSelectedSubcategory(sub)}
                            disabled={isUploading}
                            style={{ cursor: "pointer" }}
                          />
                        ))}
                      </Flex>
                    </Stack>
                  </Card>
                )}
                {selectedSubcategory && (
                  <Flex align="center" gap={2}>
                    <Text size={0} muted>
                      Sélection : <strong>{selectedSubcategory}</strong>
                    </Text>
                    <Button
                      text="\u2715"
                      mode="bleed"
                      tone="critical"
                      fontSize={0}
                      padding={1}
                      onClick={() => setSelectedSubcategory("")}
                      disabled={isUploading}
                    />
                  </Flex>
                )}
              </Stack>
            </Box>
          )}
          <Box>
            <Text size={0} weight="semibold" as="label" htmlFor="fileInput">
              Fichiers
            </Text>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              style={{ width: "100%", marginTop: "8px" }}
            />
          </Box>
        </Stack>
        {uploadItems.length > 0 && (
          <Box>
            <Text size={0} weight="semibold" muted>
              Aperçu des photos ({uploadItems.length})
            </Text>
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              {uploadItems.map((item, idx) => (
                <Box key={idx} style={{ position: "relative" }}>
                  <img
                    src={item.preview}
                    alt={`Preview ${idx}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      border: "1px solid #e0e0e0",
                    }}
                  />
                  {item.status === "uploading" && (
                    <Box
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                      }}
                    >
                      <Spinner />
                    </Box>
                  )}
                  {item.status === "success" && (
                    <Badge tone="positive" style={{ position: "absolute", top: 4, right: 4 }}>
                      ✓
                    </Badge>
                  )}
                  {item.status === "error" && (
                    <Badge tone="critical" style={{ position: "absolute", top: 4, right: 4 }}>
                      ✕
                    </Badge>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {isUploading && totalPhotos > 0 && (
          <Box>
            <Flex justify="space-between" style={{ marginBottom: "8px" }}>
              <Text size={0} weight="semibold">
                Progression
              </Text>
              <Text size={0} muted>
                {uploadProgress}/{totalPhotos}
              </Text>
            </Flex>
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  backgroundColor: "#2276fc",
                  borderRadius: "4px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </Box>
        )}
        {uploadProgress > 0 && !isUploading && (
          <Box>
            <Badge tone={successCount === totalPhotos ? "positive" : "caution"}>
              {successCount}/{totalPhotos} photos importées
            </Badge>
          </Box>
        )}
        <Flex gap={2}>
          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedCategory || uploadItems.length === 0}
            tone="primary"
            text="Importer"
          />
          <Button
            onClick={() => {
              setUploadItems([]);
              setUploadProgress(0);
              setSuccessCount(0);
            }}
            disabled={isUploading}
            mode="ghost"
            text="Réinitialiser"
          />
        </Flex>
        {uploadItems.some((item) => item.status === "error") && (
          <Card tone="critical" padding={3}>
            <Stack space={2}>
              <Text weight="semibold" size={0}>
                Erreurs
              </Text>
              {uploadItems
                .filter((item) => item.status === "error")
                .map((item, idx) => (
                  <Text key={idx} size={0} muted>
                    {item.file.name}: {item.error}
                  </Text>
                ))}
            </Stack>
          </Card>
        )}
      </Stack>
    </Card>
  );
};

export const bulkUploadPlugin = definePlugin({
  name: "bulk-upload",
  tools: [
    {
      name: "bulk-upload",
      title: "Upload en masse",
      icon: () => React.createElement("span", null, "📤"),
      component: BulkUploadComponent,
    },
  ],
});

export default BulkUploadComponent;
