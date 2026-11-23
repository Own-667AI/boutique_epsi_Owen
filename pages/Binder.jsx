import Price from "../src/components/Price.jsx";

// Le classeur : les cartes que l'on possède
export default function Binder({ cards, onRemove, onClear }) {
  // dérivé, jamais stocké : si cards change, la valeur change
  const value = cards.reduce((sum, c) => sum + (c.price ?? 0), 0);
  return (
    <>
      <h2>Mon classeur</h2>
      {cards.length === 0 ? (
        <p className="muted">Votre classeur est vide</p>
      ) : (
        <ul>
          {cards.map((c) => (
            <li key={c.id}>
              <span>{c.name}</span>
              <span>
                <Price value={c.price} />{" "}
                <button type="button" onClick={() => onRemove(c.id)} aria-label={`Retirer ${c.name}`}>✕</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="total">{cards.length} carte{cards.length > 1 ? "s" : ""}</p>
      <p className="total">Valeur estimée : <Price value={value} /></p>
      {cards.length > 0 && (
        <button type="button" className="clear" onClick={onClear}>Vider</button>
      )}
    </>
  );
}
