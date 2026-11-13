import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearAuthMessages, registerUser } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { getAxiosErrorMessage } from "../utils/handleAxiosError";

const input =
  "w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-brand";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try{
      await dispatch(registerUser(form)).unwrap();
      toast.success("Account created. Please sign in.");
      navigate("/login");
    }catch(err){
      getAxiosErrorMessage(err)
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-medium">Name</label>
          <input id="name" required placeholder="Your name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium">Email</label>
          <input id="email" type="email" required placeholder="Enter email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium">Password</label>
          <input id="password" type="password" required placeholder="At least 8 characters" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} className={input} />
        </div>

        <button type="submit" disabled={loading}
          className="w-full rounded bg-brand py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-center text-xs text-gray-600">
          Have an account? <Link to="/login" className="font-medium text-brand underline">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;