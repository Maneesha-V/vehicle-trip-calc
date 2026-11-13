import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearAuthMessages, loginUser } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { getAxiosErrorMessage } from "../utils/handleAxiosError";

const input =
  "w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-brand";

const Login = () => {
  const dispatch = useAppDispatch();
  const { loading, error, message } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearAuthMessages());
    };
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try{
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success("Login successful");
    }catch(err){
      toast.error(getAxiosErrorMessage(err))
    }

  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <p className="text-sm text-green-600">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium">Email</label>
          <input id="email" type="email" required placeholder="Enter email"
            value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium">Password</label>
          <input id="password" type="password" required placeholder="At least 8 characters"
            value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
        </div>

        <button type="submit" disabled={loading}
          className="w-full rounded bg-brand py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-xs text-gray-600">
          No account? <Link to="/register" className="font-medium text-brand underline">Register</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;