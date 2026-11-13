import type { ReactNode } from "react";
import Logo from "../common/Logo";

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-[#b2deb0] to-[#7ec3e0] px-4 py-8">
    <div className="w-full max-w-md rounded-lg bg-white px-6 py-10 shadow-lg sm:px-10">
      <Logo className="mb-8 justify-center" />
      {children}
    </div>
  </div>
);

export default AuthLayout;