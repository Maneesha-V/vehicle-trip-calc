interface Props {
  tabs: { id: string; name: string }[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const TripTabs = ({ tabs, activeId, onSelect }: Props) => (
  <div className="flex gap-1 overflow-x-auto border-b border-gray-200" role="tablist">
    {tabs.map((t) => (
      <button
        key={t.id}
        role="tab"
        aria-selected={t.id === activeId}
        onClick={() => onSelect(t.id)}
        className={`whitespace-nowrap border-b-2 px-3 py-2 text-xs ${
          t.id === activeId ? "border-blue-600 font-medium text-blue-600" : "border-transparent text-gray-500"
        }`}
      >
        {t.name}
      </button>
    ))}
  </div>
);

export default TripTabs;