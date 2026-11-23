import PokemonCard from "./PokemonCard.jsx";

export default function CardList({ cards, onAdd, binderIds }) {
  if (cards.length === 0) return <p className="status">Aucune carte</p>;
  return (
    <ul className="grid">
      {cards.map((card) => (
        // key = id unique de la carte (plusieurs cartes s'appellent "Pikachu" !)
        <PokemonCard key={card.id} card={card} onAdd={onAdd} binderIds={binderIds} />
      ))}
    </ul>
  );
}
