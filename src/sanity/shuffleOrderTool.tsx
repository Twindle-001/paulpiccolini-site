/**
 * Shuffle Photo Order Tool for Sanity Studio
 *
 * Allows randomizing the order of photos within a selected category.
 */
import { definePlugin } from "sanity";
import { useState, useEffect } from "react";
import { useClient } from "sanity";
import { Card, Stack, Text, Button, Select, Flex, Spinner } from "@sanity/ui";

interface Category {
  _id: string;
  title: { fr?: string; en?: string } | string;
  slug: { current: string };
}

interface Photo {
  _id: string;
  title?: string;
  order?: number;
}

function ShuffleOrderComponent() {
  const client = useClient({ apiVersion: "2023-01-01" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    client
      .fetch<Category[]>(`*[_type == "category"] | order(order asc) { _id, title, slug }`)
      .then(setCategories);
  }, [client]);

  useEffect(() => {
    if (!selectedCategory) {
      setPhotos([]);
      return;
    }
    setLoading(true);
    client
      .fetch<Photo[]>(
        `*[_type == "photo" && category->slug.current == $slug] | order(order asc) { _id, title, order }`,
        { slug: selectedCategory }
      )
      .then((p) => {
        setPhotos(p);
        setLoading(false);
      });
  }, [selectedCategory, client]);

  const handleShuffle = async () => {
    if (photos.length === 0) return;
    setShuffling(true);
    setMessage("");

    // Fisher-Yates shuffle to create random indices
    const indices = photos.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Batch update with transaction
    const tx = client.transaction();
    photos.forEach((photo, i) => {
      tx.patch(photo._id, { set: { order: indices[i] } });
    });

    try {
      await tx.commit();
      setMessage(
        `\u2705 Ordre al\u00e9atoire appliqu\u00e9 \u00e0 ${photos.length} photos !`
      );
      // Refresh photos
      const refreshed = await client.fetch<Photo[]>(
        `*[_type == "photo" && category->slug.current == $slug] | order(order asc) { _id, title, order }`,
        { slug: selectedCategory }
      );
      setPhotos(refreshed);
    } catch (err) {
      setMessage("\u274c Erreur : " + String(err));
    }
    setShuffling(false);
  };

  const getCategoryTitle = (cat: Category) => {
    if (typeof cat.title === "string") return cat.title;
    return cat.title?.fr || cat.title?.en || cat._id;
  };

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Text size={3} weight="bold">
          \ud83d\udd00 Ordre al\u00e9atoire des photos
        </Text>
        <Text size={1} muted>
          S\u00e9lectionnez une cat\u00e9gorie puis cliquez sur le bouton pour
          m\u00e9langer al\u00e9atoirement l\u2019ordre des photos.
        </Text>

        <Select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              (e.target as HTMLSelectElement).value
            )
          }
        >
          <option value="">-- Choisir une cat\u00e9gorie --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug.current}>
              {getCategoryTitle(cat)}
            </option>
          ))}
        </Select>

        {loading && (
          <Flex align="center" gap={2}>
            <Spinner />
            <Text size={1}>Chargement des photos...</Text>
          </Flex>
        )}

        {!loading && selectedCategory && (
          <Text size={1}>{photos.length} photo(s) dans cette cat\u00e9gorie</Text>
        )}

        <Button
          text={shuffling ? "M\u00e9lange en cours..." : "M\u00e9langer l\u2019ordre"}
          tone="primary"
          onClick={handleShuffle}
          disabled={photos.length === 0 || shuffling}
        />

        {message && (
          <Text size={1} style={{ whiteSpace: "pre-wrap" }}>
            {message}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

export const shuffleOrderPlugin = definePlugin({
  name: "shuffle-order",
  tools: [
    {
      name: "shuffle-order",
      title: "Ordre al\u00e9atoire",
      icon: () => <span style={{ fontSize: 20 }}>\ud83d\udd00</span>,
      component: ShuffleOrderComponent,
    },
  ],
});
