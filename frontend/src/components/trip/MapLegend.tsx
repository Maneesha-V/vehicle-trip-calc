const items = [
  { label: "Stopped", color: "bg-blue-700" },
  { label: "Idle", color: "bg-pink-600" },
  { label: "Over speeding", color: "bg-cyan-400" },
];

const MapLegend = () => (
  <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
    {items.map((i) => (
      <li key={i.label} className="flex items-center gap-1.5">
        <span className={`h-3.5 w-3.5 rounded-full ${i.color}`} />
        {i.label}
      </li>
    ))}
  </ul>
);

export default MapLegend;