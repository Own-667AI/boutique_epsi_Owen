export default function SearchBar({ value, onChange }) {
    function handleSubmit(e) {
        e.preventDefault();
        onChange(value);
    }

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input type="search" placeholder="Rechercher une carte (ex. Pikachu)" value={value} onChange={(e) => onChange(e.target.value)} />
            <button type="submit">Rechercher</button>
        </form>
    );
}