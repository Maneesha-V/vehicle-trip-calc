import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import type { LatLngTuple } from "leaflet";
import MapLegend from "../components/trip/MapLegend";
import StatCards from "../components/trip/StatCards";
import TripEventsTable from "../components/trip/TripEventsTable";
import TripMap from "../components/trip/TripMap";
import TripTabs from "../components/trip/TripTabs";
import UploadTripModal from "../components/trip/UploadTripModal";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTripDetail, setActiveTrip } from "../redux/slices/tripSlice";
import type { TripWithPoints } from "../types/tripTypes";
import { pathDistance } from "../utils/geo";
import { buildEventRows, type EventRow } from "../utils/tripEvents";

const TripView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { trips, details, selectedIds, activeTripId, error } = useAppSelector((s) => s.trips);

  const [showUpload, setShowUpload] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [focus, setFocus] = useState<LatLngTuple | null>(null);

  // nothing selected (e.g. page was reloaded): go back to the list
  useEffect(() => {
    if (selectedIds.length === 0) {
      navigate("/", { replace: true });
      return;
    }
    selectedIds.forEach((id) => dispatch(fetchTripDetail(id)));
  }, [selectedIds, dispatch, navigate]);

  const items = useMemo(
    () => selectedIds.map((id) => details[id]).filter((d): d is TripWithPoints => Boolean(d)),
    [selectedIds, details],
  );

  const active = activeTripId ? details[activeTripId] : undefined;
  const rows = useMemo(() => (active ? buildEventRows(active.trip, active.points) : []), [active]);
  const selectedRow = rows.find((r) => r.id === selectedRowId) ?? rows[0] ?? null;

  const overspeedDistance = useMemo(
    () =>
      active
        ? active.trip.overspeeds.reduce(
            (sum, o) => sum + pathDistance(active.points, o.startIndex, o.endIndex),
            0,
          )
        : 0,
    [active],
  );

  const tabs = selectedIds.map((id) => ({
    id,
    name: trips.find((t) => t._id === id)?.name ?? details[id]?.trip.name ?? "Trip",
  }));

  const handleTab = (id: string) => {
    dispatch(setActiveTrip(id));
    setSelectedRowId(null);
  };

  const handleRowSelect = (row: EventRow) => {
    setSelectedRowId(row.id);
    setFocus([row.latitude, row.longitude]);
  };

  return (
    <>
      <button onClick={() => navigate("/")} aria-label="Back" className="text-xl">
        <FiArrowLeft />
      </button>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-300 px-4 py-3">
        <h1 className="truncate font-medium">
          {tabs.find((t) => t.id === activeTripId)?.name ?? "Trip"}
        </h1>
        <button onClick={() => setShowUpload(true)}
          className="rounded bg-brand px-6 py-1.5 text-sm text-white">
          New
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <MapLegend />

      <div className="h-72 sm:h-96 lg:h-[420px]">
        <TripMap items={items} activeId={activeTripId} focus={focus} />
      </div>

      <TripTabs tabs={tabs} activeId={activeTripId} onSelect={handleTab} />

      {active ? (
        <>
          <StatCards summary={active.trip.summary} overspeedDistanceMeters={overspeedDistance} />
          <TripEventsTable key={active.trip._id} rows={rows} selected={selectedRow}
            onSelect={handleRowSelect} />
        </>
      ) : (
        <p className="py-8 text-center text-sm text-gray-500">Loading trip...</p>
      )}

      {showUpload && <UploadTripModal onClose={() => setShowUpload(false)} />}
    </>
  );
};

export default TripView;