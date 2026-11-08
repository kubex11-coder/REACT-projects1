import "./sectionpage.css";

function SectionPage({ title, children }) {
  return (
    <main className="section">
      <h1 className="section__title">{title}</h1>
      {children}
    </main>
  );
}

export default SectionPage;
