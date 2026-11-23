import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCard } from "../src/services/api.js";

const EMPTY = { name: "", hp: "", rarity: "", image: "" };

export default function NewCard({ onCreated }) {
  const navigate = useNavigate();
  // Champs contrôlés : la valeur de chaque input vient du state
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim() === "") {
      setError("Le nom est obligatoire.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      // POST (voir createCard dans services/api.js)
      const created = await createCard({
        name: form.name.trim(),
        hp: form.hp === "" ? null : Number(form.hp),
        rarity: form.rarity,
        image: form.image.trim() || null, // URL TCGdex sans /low.webp
      });
      onCreated?.(created);
      navigate("/"); // redirection vers la liste des cartes
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Nouvelle carte</h2>
      <label>
        Nom
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        PV
        <input name="hp" type="number" min="0" step="10" value={form.hp} onChange={handleChange} />
      </label>
      <label>
        Rareté
        <input name="rarity" value={form.rarity} onChange={handleChange} />
      </label>
      <label>
        Image (URL TCGdex, ex. https://assets.tcgdex.net/fr/swsh/swsh3/136)
        <input name="image" type="url" value={form.image} onChange={handleChange} />
      </label>
      {error && <p className="status">Erreur : {error}</p>}
      <button type="submit" disabled={sending}>{sending ? "Envoi…" : "Créer la carte"}</button>
    </form>
  );
}
