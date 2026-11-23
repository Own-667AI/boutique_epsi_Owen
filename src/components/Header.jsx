import { NavLink } from "react-router-dom";

export default function Header({ binderCount }) {
  return (
    <>
      <h1>Pokédex TCG</h1>
      <nav>
        <NavLink to="/" end>Cartes</NavLink>{" "}
        <NavLink to="/cartes/nouvelle">Ajouter une carte</NavLink>{" "}
        <NavLink to="/classeur">Classeur · {binderCount}</NavLink>
      </nav>
    </>
  );
}
