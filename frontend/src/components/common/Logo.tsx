import { MdSpeed } from "react-icons/md";

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-1.5 text-brand ${className}`}>
    <MdSpeed className="h-7 w-7" />
    <span className="text-lg font-bold tracking-tight">Speedo</span>
  </div>
);

export default Logo;