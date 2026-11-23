import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCard, cardImage } from "../src/services/api.js";
import Price from "../src/components/Price.jsx";

export default function CardPage({ onAdd, binderIds }) {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getCard(id)
      .then((data) => !cancelled && setCard(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p className="status">Chargement…</p>;
  if (error) return <p className="status">Carte introuvable ({error}) — <Link to="/">retour aux cartes</Link></p>;

  const owned = binderIds.includes(card.id);
  const img = cardImage(card, "high");
  return (
    <article className="card-page">
      <Link to="/">← Retour aux cartes</Link>
      <div className="card-page-body">
        {img && <img src={img} alt={card.name} />}
        <div>
          <h2>{card.name}</h2>
          <p className="muted">{card.set} · {card.id}</p>
          <ul className="specs">
            <li>Catégorie : {card.category}</li>
            {card.hp && <li>PV : {card.hp}</li>}
            {card.types.length > 0 && <li>Type : {card.types.join(", ")}</li>}
            {card.rarity && <li>Rareté : {card.rarity}</li>}
            {card.illustrator && <li>Illustrateur : {card.illustrator}</li>}
          </ul>
          {card.description && <p>{card.description}</p>}
          <p className="price">Cote Cardmarket : <Price value={card.price} /></p>
          <button type="button" disabled={owned} onClick={() => onAdd(card)}>
            {owned ? "Dans le classeur" : "Ajouter au classeur"}
          </button>
        </div>
      </div>
    </article>
  );
}
