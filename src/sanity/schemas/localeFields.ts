import { defineField } from "sanity";

/**
 * Helper function to create bilingual text fields (FR/EN)
 */
export function createLocaleField(
  name: string,
  title: string,
  type: "string" | "text" | "array" = "string",
  options?: {
    description?: string;
    rows?: number;
    required?: boolean;
  }
) {
  const baseField = {
    description: options?.description,
    validation: options?.required
      ? (Rule: any) => Rule.required()
      : undefined,
  };

  if (type === "array") {
    return defineField({
      name,
      title,
      type: "object",
      fields: [
        defineField({
          name: "fr",
          title: "Français",
          type: "array",
          of: [{ type: "block" }],
          ...baseField,
        }),
        defineField({
          name: "en",
          title: "English",
          type: "array",
          of: [{ type: "block" }],
        }),
      ],
    });
  }

  if (type === "text") {
    return defineField({
      name,
      title,
      type: "object",
      fields: [
        defineField({
          name: "fr",
          title: "Français",
          type: "text",
          rows: options?.rows || 3,
          ...baseField,
        }),
        defineField({
          name: "en",
          title: "English",
          type: "text",
          rows: options?.rows || 3,
        }),
      ],
    });
  }

  // Default: string type
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "fr",
        title: "Français",
        type: "string",
        ...baseField,
      }),
      defineField({
        name: "en",
        title: "English",
        type: "string",
      }),
    ],
  });
}
