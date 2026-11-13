interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const WINDOW = 5;

const Pagination = ({ page, totalPages, onChange }: Props) => {
  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(page - Math.floor(WINDOW / 2), totalPages - WINDOW + 1));
  const pages = Array.from({ length: Math.min(WINDOW, totalPages) }, (_, i) => start + i);

  const btn = "h-6 min-w-6 rounded border px-1.5 text-xs disabled:opacity-40";

  return (
    <nav className="flex items-center justify-center gap-1.5 py-4" aria-label="Pagination">
      <button className={`${btn} border-gray-300`} disabled={page === 1} onClick={() => onChange(page - 1)}>
        &lt;
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`${btn} ${p === page ? "border-blue-500 text-blue-600" : "border-gray-300"}`}
        >
          {p}
        </button>
      ))}
      <button
        className={`${btn} border-gray-300`}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        &gt;
      </button>
    </nav>
  );
};

export default Pagination;