export default function Layout({ header, aside, children }) {
  return (
    <>
      <header>{header}</header>
      <main>{children}</main>
      <aside className="cart">{aside}</aside>
    </>
  );
}
