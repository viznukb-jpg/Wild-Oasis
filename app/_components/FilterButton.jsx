export default function FilterButton({
  filter,
  handleFilter,
  activeFilter,
  children,
}) {
  const btnStyleClass = "px-5 py-2 hover:bg-primary-700 transition-colors";
  const btnStyleActiveClass = "bg-primary-800 text-primary-50";

  return (
    <button
      className={`${btnStyleClass} ${filter === activeFilter ? btnStyleActiveClass : ""}`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}
