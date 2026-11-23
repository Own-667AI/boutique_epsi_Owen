// Couche d'accès à l'API TCGdex (cartes Pokémon) via le SDK officiel.
// https://tcgdex.dev/fr/sdks/typescript
import TCGdex, { Query } from "@tcgdex/sdk";

const tcgdex = new TCGdex("fr");
const PAGE_SIZE = 20;

// URL d'image TCGdex : `${card.image}/{low|high}.{webp|png}`
export const cardImage = (card, quality = "low") =>
  card.image ? `${card.image}/${quality}.webp` : null;

// Le SDK renvoie des objets de classe (avec une référence vers le SDK) :
// on les convertit en objets simples pour React et pour le localStorage.
const toBrief = (c) => ({ id: c.id, name: c.name, image: c.image ?? null });

const toDetail = (c) => ({
  ...toBrief(c),
  category: c.category,
  hp: c.hp,
  types: c.types ?? [],
  rarity: c.rarity,
  illustrator: c.illustrator,
  description: c.description ?? c.effect,
  set: c.set?.name,
  // prix moyen Cardmarket (en €), quand il existe
  price: c.pricing?.cardmarket?.avg ?? null,
});

export { PAGE_SIZE };

// Liste paginée + recherche + filtres + tri.
// Pagination : TCGdex n'a pas skip/limit comme dummyjson mais paginate(page, itemsPerPage),
// ce qui revient au même : skip = (page - 1) * PAGE_SIZE, limit = PAGE_SIZE.
export const getCards = async ({ name = "", rarity = "", minHp = "", sort = "", page = 1 } = {}) => {
  const query = Query.create().not.isNull("image"); // seulement les cartes qui ont une image
  if (name) query.contains("name", name);
  if (rarity) query.equal("rarity", rarity);
  if (minHp) query.greaterOrEqualThan("hp", Number(minHp));
  // ⚠️ L'API TCGdex inverse le tri sur les PV (constaté le 23/11/2026 :
  // "ASC" renvoie 310 PV en premier). On envoie donc l'ordre inverse.
  if (sort === "hp-asc") query.sort("hp", "DESC");
  if (sort === "hp-desc") query.sort("hp", "ASC");
  query.paginate(page, PAGE_SIZE);

  const list = await tcgdex.card.list(query);
  // pas de total renvoyé : une page pleine laisse supposer qu'il y en a une suivante
  return { cards: list.map(toBrief), hasNext: list.length === PAGE_SIZE };
};

export const getRarities = async () => (await tcgdex.fetch("rarities")) ?? [];

export const getCard = async (id) => {
  const card = await tcgdex.card.get(id);
  if (!card) throw new Error(`Carte ${id} introuvable`);
  return toDetail(card);
};

// TCGdex est en lecture seule : pas de POST possible.
// Le formulaire de création envoie donc son POST à l'API de démo dummyjson.
export const createCard = async (card) => {
  const res = await fetch("https://dummyjson.com/products/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  await res.json();
  // id unique côté front (dummyjson renvoie toujours le même)
  return { ...card, id: `perso-${Date.now()}` };
};
