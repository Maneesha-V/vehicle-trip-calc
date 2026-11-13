import { Outlet } from "react-router-dom";
import Header from "./Header";

const AppLayout = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-4 sm:px-6">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;