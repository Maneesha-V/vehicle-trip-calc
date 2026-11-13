import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMap } from "react-icons/md";
import WelcomeBar from "../components/common/WelcomeBar";
import TripTable from "../components/trip/TripTable";
import UploadTripModal from "../components/trip/UploadTripModal";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchTrips,
  removeTrip,
  setSelectedTrips,
} from "../redux/slices/tripSlice";
import toast from "react-hot-toast";
import { getAxiosErrorMessage } from "../utils/handleAxiosError";
import { confirmDialog } from "../utils/confirmDialog";

const UploadHint = () => (
  <p className="text-xs text-gray-500">
    Upload the <b className="underline">CSV</b> sheet of your trip
  </p>
);

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { trips, selectedIds, loading, error } = useAppSelector((s) => s.trips);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: "Are you sure?",
      text: `Delete ${selectedIds.length} selected trip(s)?`,
      confirmButtonText: "Yes, delete!",
    });

    if (!confirmed) return;

    try {
      for (const id of [...selectedIds]) {
        await dispatch(removeTrip(id)).unwrap();
      }

      toast.success("Selected trips deleted successfully");
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  };

  const uploadButton = (
    <button
      onClick={() => setShowUpload(true)}
      className="rounded bg-brand px-5 py-2 text-sm font-medium text-white"
    >
      Upload Trip
    </button>
  );

  return (
    <>
      <WelcomeBar />
      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading && trips.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">
          Loading trips...
        </p>
      ) : trips.length === 0 ? (
        <section className="flex flex-col items-center gap-4 rounded-lg border border-gray-300 px-4 py-12">
          {/* replace with the illustration exported from Figma */}
          <MdOutlineMap className="h-28 w-28 text-amber-400" />
          {uploadButton}
          <UploadHint />
        </section>
      ) : (
        <>
          <section className="flex flex-col items-start gap-3 rounded-lg border border-gray-300 p-4 sm:flex-row sm:items-center">
            {uploadButton}
            <UploadHint />
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Your Trips</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={selectedIds.length === 0}
                  className="rounded border border-gray-400 px-4 py-1.5 text-sm disabled:opacity-40"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate("/trips/view")}
                  disabled={selectedIds.length === 0}
                  className="rounded bg-brand px-4 py-1.5 text-sm text-white disabled:bg-gray-400"
                >
                  Open
                </button>
              </div>
            </div>
            <TripTable
              trips={trips}
              selectedIds={selectedIds}
              onChange={(ids) => dispatch(setSelectedTrips(ids))}
            />
          </section>
        </>
      )}

      {showUpload && <UploadTripModal onClose={() => setShowUpload(false)} />}
    </>
  );
};

export default Dashboard;
