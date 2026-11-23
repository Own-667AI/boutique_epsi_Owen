export default function Pagination({ page, hasNext, onChange }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>← Précédente</button>
      <span>Page {page}</span>
      <button type="button" disabled={!hasNext} onClick={() => onChange(page + 1)}>Suivante →</button>
    </nav>
  );
}
