import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Header from "./components/Header.jsx";
import CardList from "./components/CardList.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Binder from "../pages/Binder.jsx";
import CardPage from "../pages/CardPage.jsx";
import NewCard from "../pages/NewCard.jsx";
import Filters from "./components/Filters.jsx";
import Pagination from "./components/Pagination.jsx";
import { getCards } from "./services/api.js";

const BINDER_KEY = "binder";

export default function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ rarity: "", minHp: "", sort: "" });
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  // Initialisation paresseuse : on relit le classeur sauvegardé une seule fois, au montage
  const [binder, setBinder] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(BINDER_KEY)) ?? [];
    } catch {
      return [];
    }
  });

  // Sauvegarde à chaque modification du classeur
  useEffect(() => {
    localStorage.setItem(BINDER_KEY, JSON.stringify(binder));
  }, [binder]);

  // Chargement des cartes (recherche + filtres + page), avec un délai (debounce) de 300 ms
  useEffect(() => {
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      getCards({ name: query.trim(), ...filters, page })
        .then(({ cards, hasNext }) => {
          setCards(cards);
          setHasNext(hasNext);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters, page]);

  // Nouvelle recherche ou nouveaux filtres → on revient à la page 1
  const handleQuery = (q) => {
    setQuery(q);
    setPage(1);
  };
  const handleFilters = (f) => {
    setFilters(f);
    setPage(1);
  };
  const handlePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const binderIds = binder.map((c) => c.id);

  const handleAdd = (card) => {
    // on ne garde que des champs simples (sérialisables en JSON)
    const { id, name, image = null, price = null } = card;
    setBinder((prev) => [...prev, { id, name, image, price }]);
  };
  const handleRemove = (id) => {
    setBinder((prev) => prev.filter((c) => c.id !== id));
  };
  const handleClear = () => setBinder([]);

  const cardsPage = (
    <>
      <SearchBar value={query} onChange={handleQuery} />
      <Filters value={filters} onChange={handleFilters} />
      {loading && <p className="status">Chargement…</p>}
      {error && <p className="status">Erreur : {error}</p>}
      {!loading && !error && (
        <>
          <CardList cards={cards} onAdd={handleAdd} binderIds={binderIds} />
          <Pagination page={page} hasNext={hasNext} onChange={handlePage} />
        </>
      )}
    </>
  );

  const binderView = <Binder cards={binder} onRemove={handleRemove} onClear={handleClear} />;

  return (
    <Layout header={<Header binderCount={binder.length} />} aside={binderView}>
      <Routes>
        <Route path="/" element={cardsPage} />
        <Route path="/cartes/nouvelle" element={<NewCard onCreated={(c) => setCards((prev) => [c, ...prev])} />} />
        <Route path="/cartes/:id" element={<CardPage onAdd={handleAdd} binderIds={binderIds} />} />
        <Route path="/classeur" element={binderView} />
        <Route path="*" element={<p className="status">Page introuvable</p>} />
      </Routes>
    </Layout>
  );
}
