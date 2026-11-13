import { useEffect, useState, type DragEvent } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearTripError, uploadTrip } from "../../redux/slices/tripSlice";
import toast from "react-hot-toast";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";

const UploadTripModal = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const { uploading, error } = useAppSelector((s) => s.trips);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    dispatch(clearTripError());
  }, [dispatch]);

  // useEffect(() => {
  //   const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
  //   window.addEventListener("keydown", onKey);
  //   return () => window.removeEventListener("keydown", onKey);
  // }, [onClose]);

  const pickFile = (f?: File) => {
    if (!f) return;
    if (!/\.(csv|txt)$/i.test(f.name))
      return setLocalError("Please choose a .csv file");
    setLocalError(null);
    setFile(f);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  };

  // const handleSave = async () => {
  //   if (!name.trim()) return setLocalError("Trip name is required");
  //   if (!file) return setLocalError("Please choose a CSV file");
  //   setLocalError(null);
  //   const result = await dispatch(uploadTrip({ file, name: name.trim() }));
  //   if (uploadTrip.fulfilled.match(result)) onClose();
  // };
  const handleSave = async () => {
    if (!name.trim()) return setLocalError("Trip name is required");
    if (!file) return setLocalError("Please choose a CSV file");

    setLocalError(null);

    try {
      const result = await dispatch(
        uploadTrip({ file, name: name.trim() }),
      ).unwrap();

      toast.success("Trip uploaded successfully!");
      onClose();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  };
  const shownError = localError ?? error;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-lg bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 text-gray-500"
        >
          <FiX />
        </button>

        <div className="mt-4 space-y-4">
          <input
            placeholder="Trip Name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex cursor-pointer flex-col items-center gap-2 rounded border border-accent px-4 py-6 text-center text-xs text-accent ${
              dragging ? "bg-cyan-50" : ""
            }`}
          >
            <FiUpload className="h-6 w-6" />
            {file ? (
              <span className="break-all font-medium">{file.name}</span>
            ) : (
              <span>
                Click here to upload the <b className="underline">CSV</b> sheet
                of your trip
              </span>
            )}
            <input
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </label>

          {shownError && <p className="text-sm text-red-600">{shownError}</p>}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={uploading}
              className="flex-1 rounded border border-gray-400 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="flex-1 rounded bg-brand py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {uploading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTripModal;
