import { useState } from "react";
import Pagination from "../common/Pagination";
import { EVENT_LABEL, type EventRow } from "../../utils/tripEvents";
import { formatDate, formatDistance, formatDuration, formatPoint, formatTime } from "../../utils/format";

const PAGE_SIZE = 5;

interface Props {
  rows: EventRow[];
  selected: EventRow | null;
  onSelect: (row: EventRow) => void;
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-3 text-xs">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const TripEventsTable = ({ rows, selected, onSelect }: Props) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageRows = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-gray-300 p-6 text-center text-sm text-gray-500">
        No stoppages, idling or over speeding in this trip.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-gray-300">
      <div className="grid lg:grid-cols-[1fr_280px]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-3 py-3 font-medium">Time</th>
                <th className="px-3 py-3 font-medium">Point</th>
                <th className="px-3 py-3 font-medium">Ignition</th>
                <th className="px-3 py-3 font-medium">Speed</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id} onClick={() => onSelect(row)}
                  className={`cursor-pointer border-b border-gray-200 hover:bg-gray-50 ${
                    selected?.id === row.id ? "bg-blue-50" : ""
                  }`}>
                  <td className="px-3 py-4">{formatTime(row.startTime)} to {formatTime(row.endTime)}</td>
                  <td className="px-3 py-4">{formatPoint(row.latitude, row.longitude)}</td>
                  <td className={`px-3 py-4 font-semibold ${row.ignition ? "text-green-600" : "text-red-600"}`}>
                    {row.ignition ? "ON" : "OFF"}
                  </td>
                  <td className="px-3 py-4">{row.speed} KM/H</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <aside className="space-y-3 border-t border-gray-300 p-4 lg:border-l lg:border-t-0">
            <Detail label="Event" value={EVENT_LABEL[selected.kind]} />
            <Detail label="Date" value={formatDate(selected.startTime)} />
            <Detail label="Duration" value={formatDuration(selected.durationSec)} />
            {selected.kind === "overspeed" && (
              <>
                <Detail label="Distance" value={formatDistance(selected.distanceMeters)} />
                <Detail label="Max speed" value={`${selected.speed} KM/H`} />
              </>
            )}
          </aside>
        )}
      </div>
      <Pagination page={current} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};

export default TripEventsTable;