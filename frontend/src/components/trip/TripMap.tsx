import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import L, { type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { TripWithPoints } from "../../types/tripTypes";
import { formatDuration } from "../../utils/format";

const TRIP_COLORS = ["#2563eb", "#7c3aed", "#ea580c", "#16a34a", "#db2777", "#0f766e"];
const OVERSPEED_COLOR = "#00e5ff";

const dot = (color: string, size = 16) =>
  L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.35)"></span>`,
  });

const ICONS = {
  start: dot("#16a34a", 18),
  end: dot("#dc2626", 18),
  stop: dot("#1d4ed8"),
  idle: dot("#e11d9a"),
};

const FitBounds = ({ positions }: { positions: LatLngTuple[] }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) map.fitBounds(positions, { padding: [30, 30] });
  }, [map, positions]);
  return null;
};

const FlyTo = ({ target }: { target: LatLngTuple | null }) => {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 15));
  }, [map, target]);
  return null;
};

interface Props {
  items: TripWithPoints[];
  activeId: string | null;
  focus: LatLngTuple | null;
}

const TripMap = ({ items, activeId, focus }: Props) => {
  const routes = useMemo(
    () =>
      items.map((item, i) => {
        const path: LatLngTuple[] = item.points.map((p) => [p.latitude, p.longitude]);
        return {
          id: item.trip._id,
          color: TRIP_COLORS[i % TRIP_COLORS.length],
          path,
          overspeeds: item.trip.overspeeds.map((o) => path.slice(o.startIndex, o.endIndex + 1)),
          stoppages: item.trip.stoppages,
          idlings: item.trip.idlings,
        };
      }),
    [items],
  );

  const allPositions = useMemo(() => routes.flatMap((r) => r.path), [routes]);

  return (
    <MapContainer
      center={[20, 78]}
      zoom={5}
      preferCanvas
      className="z-0 h-full w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds positions={allPositions} />
      <FlyTo target={focus} />

      {/* base routes first, so cyan overspeed segments draw on top */}
      {routes.map((r) => (
        <Polyline key={r.id} positions={r.path}
          pathOptions={{ color: r.color, weight: r.id === activeId ? 5 : 3, opacity: r.id === activeId ? 1 : 0.6 }} />
      ))}
      {routes.map((r) =>
        r.overspeeds.map((seg, i) => (
          <Polyline key={`${r.id}-o${i}`} positions={seg}
            pathOptions={{ color: OVERSPEED_COLOR, weight: 6 }} />
        )),
      )}

      {routes.map((r) =>
        r.path.length > 0 ? (
          <span key={`${r.id}-ends`}>
            <Marker position={r.path[0]} icon={ICONS.start}><Tooltip>Start</Tooltip></Marker>
            <Marker position={r.path[r.path.length - 1]} icon={ICONS.end}><Tooltip>End</Tooltip></Marker>
          </span>
        ) : null,
      )}

      {routes.map((r) => (
        <span key={`${r.id}-events`}>
          {r.stoppages.map((e, i) => (
            <Marker key={`s${i}`} position={[e.latitude, e.longitude]} icon={ICONS.stop}>
              <Tooltip>Stopped for {formatDuration(e.durationSec)}</Tooltip>
            </Marker>
          ))}
          {r.idlings.map((e, i) => (
            <Marker key={`i${i}`} position={[e.latitude, e.longitude]} icon={ICONS.idle}>
              <Tooltip>Idle for {formatDuration(e.durationSec)}</Tooltip>
            </Marker>
          ))}
        </span>
      ))}
    </MapContainer>
  );
};

export default TripMap;