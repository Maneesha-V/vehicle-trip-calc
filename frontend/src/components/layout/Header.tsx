import { useAppDispatch } from "../../redux/hooks";
import { logoutUser } from "../../redux/slices/authSlice";
import { resetTrips } from "../../redux/slices/tripSlice";
import Logo from "../common/Logo";

const Header = () => {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(resetTrips());
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />
        <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-brand">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;