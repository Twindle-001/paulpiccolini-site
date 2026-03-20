"use client";

import React, { useCallback, useEffect, useState } from "react";
import { type StringInputProps, set, unset, useClient } from "sanity";
import { Box, Button, Card, Flex, Stack, Text, TextInput } from "@sanity/ui";

export default function SubcategoryInput(props: StringInputProps) {
  const { value, onChange, schemaType } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const [existingSubs, setExistingSubs] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(value || "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    client
      .fetch<string[]>(
        `array::unique(*[_type == "photo" && defined(subcategory) && subcategory != ""].subcategory) | order(@ asc)`
      )
      .then((results) => {
        setExistingSubs(results || []);
      })
      .catch((err) => console.error("Erreur chargement sous-catégories:", err))
      .finally(() => setIsLoading(false));
  }, [client]);

  const handleSelect = useCallback(
    (sub: string) => {
      setInputValue(sub);
      onChange(set(sub));
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    onChange(unset());
  }, [onChange]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.currentTarget.value;
      setInputValue(val);
      if (val === "") {
        onChange(unset());
      } else {
        onChange(set(val));
      }
    },
    [onChange]
  );

  // Filter suggestions based on current input
  const filtered = inputValue
    ? existingSubs.filter((s) =>
        s.toLowerCase().includes(inputValue.toLowerCase())
      )
    : existingSubs;

  return (
    <Stack space={3}>
      <TextInput
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Taper ou sélectionner une sous-catégorie..."
        fontSize={1}
      />

      {/* Existing subcategories as clickable chips */}
      {!isLoading && filtered.length > 0 && (
        <Card padding={2} radius={2} tone="transparent">
          <Stack space={2}>
            <Text size={0} muted>
              Sous-catégories existantes :
            </Text>
            <Flex wrap="wrap" gap={2}>
              {filtered.map((sub) => (
                <Button
                  key={sub}
                  text={sub}
                  mode={value === sub ? "default" : "ghost"}
                  tone={value === sub ? "primary" : "default"}
                  fontSize={1}
                  padding={2}
                  onClick={() => handleSelect(sub)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Flex>
          </Stack>
        </Card>
      )}

      {isLoading && (
        <Text size={0} muted>
          Chargement des sous-catégories...
        </Text>
      )}

      {value && (
        <Flex align="center" gap={2}>
          <Text size={0} muted>
            Sélection : <strong>{value}</strong>
          </Text>
          <Button
            text="\u2715"
            mode="bleed"
            tone="critical"
            fontSize={0}
            padding={1}
            onClick={handleClear}
          />
        </Flex>
      )}
    </Stack>
  );
}
