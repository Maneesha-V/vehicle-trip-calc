import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppDispatch } from "./redux/hooks";
import { restoreSession } from "./redux/slices/authSlice";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./components/layout/AppLayout";
import TripView from "./pages/TripView";
import { Toaster } from "react-hot-toast";

const App = () => {
  const dispatch = useAppDispatch();

  // restore the session from the refresh-token cookie on page load
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <>
    <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trips/view" element={<TripView />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;
