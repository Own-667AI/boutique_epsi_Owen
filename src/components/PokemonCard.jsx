import { Link } from "react-router-dom";
import { cardImage } from "../services/api.js";

export default function PokemonCard({ card, onAdd, binderIds }) {
  const owned = binderIds.includes(card.id);
  const img = cardImage(card);
  return (
    <li className="card">
      <Link to={`/cartes/${card.id}`}>
        {img ? <img src={img} alt={card.name} loading="lazy" /> : <div className="no-img">Pas d'image</div>}
      </Link>
      <h3><Link to={`/cartes/${card.id}`}>{card.name}</Link></h3>
      <p className="muted">{card.id}</p>
      <button type="button" disabled={owned} onClick={() => onAdd(card)}>
        {owned ? "Dans le classeur" : "Ajouter au classeur"}
      </button>
    </li>
  );
}
