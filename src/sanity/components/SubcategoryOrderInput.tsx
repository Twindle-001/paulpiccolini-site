"use client";

import React, { useCallback, useEffect, useState } from "react";
import { type ArrayOfPrimitivesInputProps, set, useClient, useFormValue } from "sanity";
import { Box, Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { AddIcon, ResetIcon, DragHandleIcon } from "@sanity/icons";

/**
 * Custom input for subcategoryOrder on category documents.
 * Shows all existing subcategories (from photos) and lets the user
 * reorder them via drag & drop, or load them with one click.
 */
export default function SubcategoryOrderInput(props: ArrayOfPrimitivesInputProps) {
  const { value = [], onChange } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const [existingSubs, setExistingSubs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Get the current document's slug to find its photos
  const slug = useFormValue(["slug", "current"]) as string | undefined;
  const docId = useFormValue(["_id"]) as string | undefined;

  useEffect(() => {
    if (!docId && !slug) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Fetch subcategories from photos that belong to this category
    const query = slug
      ? `array::unique(*[_type == "photo" && category->slug.current == $slug && defined(subcategory) && subcategory != ""].subcategory) | order(@ asc)`
      : `array::unique(*[_type == "photo" && category._ref == $docId && defined(subcategory) && subcategory != ""].subcategory) | order(@ asc)`;

    const params = slug ? { slug } : { docId };

    client
      .fetch<string[]>(query, params)
      .then((results) => setExistingSubs(results || []))
      .catch((err) => console.error("Erreur chargement sous-catégories:", err))
      .finally(() => setIsLoading(false));
  }, [client, slug, docId]);

  const currentOrder = (value as string[]) || [];

  // Load all existing subcategories into the order list
  const handleLoadAll = useCallback(() => {
    // Keep current order for items already in the list, append new ones
    const existing = new Set(currentOrder);
    const newItems = existingSubs.filter((s) => !existing.has(s));
    const merged = [...currentOrder, ...newItems];
    onChange(set(merged));
  }, [currentOrder, existingSubs, onChange]);

  // Reset to alphabetical order
  const handleReset = useCallback(() => {
    const sorted = [...existingSubs].sort((a, b) => a.localeCompare(b));
    onChange(set(sorted));
  }, [existingSubs, onChange]);

  // Remove an item
  const handleRemove = useCallback(
    (idx: number) => {
      const updated = currentOrder.filter((_, i) => i !== idx);
      onChange(set(updated));
    },
    [currentOrder, onChange]
  );

  // Move an item up
  const handleMoveUp = useCallback(
    (idx: number) => {
      if (idx === 0) return;
      const updated = [...currentOrder];
      [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
      onChange(set(updated));
    },
    [currentOrder, onChange]
  );

  // Move an item down
  const handleMoveDown = useCallback(
    (idx: number) => {
      if (idx >= currentOrder.length - 1) return;
      const updated = [...currentOrder];
      [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
      onChange(set(updated));
    },
    [currentOrder, onChange]
  );

  // Drag & drop handlers
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = useCallback(
    (targetIdx: number) => {
      if (dragIdx === null || dragIdx === targetIdx) {
        setDragIdx(null);
        setDragOverIdx(null);
        return;
      }
      const updated = [...currentOrder];
      const [moved] = updated.splice(dragIdx, 1);
      updated.splice(targetIdx, 0, moved);
      onChange(set(updated));
      setDragIdx(null);
      setDragOverIdx(null);
    },
    [dragIdx, currentOrder, onChange]
  );
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  // Items not yet in the order list
  const missingItems = existingSubs.filter((s) => !currentOrder.includes(s));

  return (
    <Stack space={3}>
      {/* Action buttons */}
      <Flex gap={2} wrap="wrap">
        <Button
          icon={AddIcon}
          text={currentOrder.length === 0 ? "Charger toutes les sous-catégories" : "Ajouter les manquantes"}
          tone="primary"
          mode="ghost"
          fontSize={1}
          padding={3}
          onClick={handleLoadAll}
          disabled={isLoading || existingSubs.length === 0}
        />
        <Button
          icon={ResetIcon}
          text="Réinitialiser (A-Z)"
          tone="caution"
          mode="ghost"
          fontSize={1}
          padding={3}
          onClick={handleReset}
          disabled={isLoading || existingSubs.length === 0}
        />
      </Flex>

      {isLoading && (
        <Text size={1} muted>
          Chargement des sous-catégories...
        </Text>
      )}

      {/* Sortable list */}
      {currentOrder.length > 0 && (
        <Stack space={1}>
          {currentOrder.map((item, idx) => (
            <Card
              key={item}
              padding={2}
              radius={2}
              tone={dragOverIdx === idx ? "primary" : "default"}
              shadow={dragIdx === idx ? 2 : 0}
              style={{
                cursor: "grab",
                opacity: dragIdx === idx ? 0.5 : 1,
                border: dragOverIdx === idx ? "1px solid var(--card-focus-ring-color)" : "1px solid transparent",
                transition: "all 0.15s ease",
              }}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e: React.DragEvent) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={handleDragEnd}
            >
              <Flex align="center" gap={2}>
                <Text size={1} muted>
                  <DragHandleIcon />
                </Text>
                <Box flex={1}>
                  <Text size={1} weight="medium">
                    {idx + 1}. {item}
                  </Text>
                </Box>
                <Flex gap={1}>
                  <Button
                    text="▲"
                    mode="bleed"
                    fontSize={0}
                    padding={1}
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                  />
                  <Button
                    text="▼"
                    mode="bleed"
                    fontSize={0}
                    padding={1}
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === currentOrder.length - 1}
                  />
                  <Button
                    text="✕"
                    mode="bleed"
                    tone="critical"
                    fontSize={0}
                    padding={1}
                    onClick={() => handleRemove(idx)}
                  />
                </Flex>
              </Flex>
            </Card>
          ))}
        </Stack>
      )}

      {/* Missing items notice */}
      {missingItems.length > 0 && currentOrder.length > 0 && (
        <Card padding={2} radius={2} tone="caution">
          <Text size={0} muted>
            Sous-catégories non classées : {missingItems.join(", ")}
          </Text>
        </Card>
      )}

      {currentOrder.length === 0 && !isLoading && existingSubs.length > 0 && (
        <Card padding={3} radius={2} tone="transparent">
          <Text size={1} muted align="center">
            {existingSubs.length} sous-catégorie(s) trouvée(s). Cliquez sur "Charger" pour les ajouter et les réordonner.
          </Text>
        </Card>
      )}
    </Stack>
  );
}
