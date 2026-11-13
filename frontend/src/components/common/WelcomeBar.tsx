import { useAppSelector } from "../../redux/hooks";

const WelcomeBar = () => {
  const name = useAppSelector((s) => s.auth.user?.name);
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium sm:text-base">
      <span aria-hidden>👋</span>
      <span>Welcome, {name ?? "User"}</span>
    </div>
  );
};

export default WelcomeBar;