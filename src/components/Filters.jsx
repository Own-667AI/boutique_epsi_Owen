import { useEffect, useState } from "react";
import { getRarities } from "../services/api.js";

const HP_OPTIONS = [60, 100, 150, 200, 300];

export default function Filters({ value, onChange }) {
  const [rarities, setRarities] = useState([]);

  useEffect(() => {
    getRarities().then(setRarities).catch(() => setRarities([]));
  }, []);

  const update = (e) => onChange({ ...value, [e.target.name]: e.target.value });

  return (
    <div className="filters">
      <label>
        Rareté
        <select name="rarity" value={value.rarity} onChange={update}>
          <option value="">Toutes</option>
          {rarities.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      <label>
        PV minimum
        <select name="minHp" value={value.minHp} onChange={update}>
          <option value="">Tous</option>
          {HP_OPTIONS.map((hp) => <option key={hp} value={hp}>{hp}+</option>)}
        </select>
      </label>
      <label>
        Tri
        <select name="sort" value={value.sort} onChange={update}>
          <option value="">Par défaut</option>
          <option value="hp-asc">PV croissants</option>
          <option value="hp-desc">PV décroissants</option>
        </select>
      </label>
    </div>
  );
}
