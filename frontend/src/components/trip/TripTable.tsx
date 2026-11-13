import { useState } from "react";
import Pagination from "../common/Pagination";
import type { TripDTO } from "../../types/tripTypes";

const PAGE_SIZE = 10;

interface Props {
  trips: TripDTO[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const TripTable = ({ trips, selectedIds, onChange }: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(trips.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageTrips = trips.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const pageIds = pageTrips.map((t) => t._id);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  const toggleAll = () =>
    onChange(
      allSelected
        ? selectedIds.filter((id) => !pageIds.includes(id))
        : [...new Set([...selectedIds, ...pageIds])],
    );

  const toggleOne = (id: string) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);

  return (
    <div>
      <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 text-xs font-medium">
        <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
        <span>Trips</span>
      </div>

      <ul>
        {pageTrips.map((trip) => (
          <li key={trip._id}>
            <label className="flex cursor-pointer items-center gap-3 border-b border-gray-200 px-3 py-3 text-xs hover:bg-gray-50">
              <input type="checkbox" checked={selectedIds.includes(trip._id)}
                onChange={() => toggleOne(trip._id)} />
              <span className="flex-1 truncate">{trip.name}</span>
              <span className="hidden text-gray-400 sm:inline">
                {new Date(trip.createdAt).toLocaleDateString("en-GB")}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <Pagination page={current} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};

export default TripTable;