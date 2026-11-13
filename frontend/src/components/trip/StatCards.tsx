import type { ReactNode } from "react";
import { FiActivity, FiClock, FiMapPin, FiPauseCircle, FiStopCircle, FiTrendingUp } from "react-icons/fi";
import type { TripSummary } from "../../types/tripTypes";
import { formatDistance, formatDuration } from "../../utils/format";

interface CardProps {
  icon: ReactNode;
  tone: string;
  value: string;
  label: string;
}

const Card = ({ icon, tone, value, label }: CardProps) => (
  <div className="rounded-lg border border-gray-300 p-3">
    <span className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full text-white ${tone}`}>
      {icon}
    </span>
    <p className="text-lg font-bold leading-tight">{value}</p>
    <p className="mt-1 text-[11px] text-gray-600">{label}</p>
  </div>
);

interface Props {
  summary: TripSummary;
  overspeedDistanceMeters: number;
}

const StatCards = ({ summary, overspeedDistanceMeters }: Props) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
    <Card icon={<FiMapPin />} tone="bg-blue-600" value={formatDistance(summary.totalDistanceMeters)} label="Total Distance Travelled" />
    <Card icon={<FiClock />} tone="bg-blue-600" value={formatDuration(summary.totalDurationSec)} label="Total Travelled Duration" />
    <Card icon={<FiActivity />} tone="bg-cyan-500" value={formatDuration(summary.overspeedDurationSec)} label="Over Speeding Duration" />
    <Card icon={<FiTrendingUp />} tone="bg-cyan-500" value={formatDistance(overspeedDistanceMeters)} label="Over Speeding Distance" />
    <Card icon={<FiPauseCircle />} tone="bg-pink-600" value={formatDuration(summary.idlingDurationSec)} label="Idling Duration" />
    <Card icon={<FiStopCircle />} tone="bg-blue-800" value={formatDuration(summary.stoppageDurationSec)} label="Stopped Duration" />
  </div>
);

export default StatCards;