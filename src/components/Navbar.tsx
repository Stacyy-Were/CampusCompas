import { Link } from "react-router-dom";
import { motion } from "motion/react";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Find an Institution", to: "/find" },
  { label: "Institutions", to: "/institutions" },
  { label: "About Us", to: "/about" },
];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed inset-x-0 top-6 z-20 flex justify-center"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2 py-2 backdrop-blur-md">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-full px-4 py-2 font-mono text-xs text-white/80 transition-all duration-300 hover:bg-white/15 hover:text-white md:text-sm"
          >
            {item.label}
          </Link>
        ))}

        <Link
          to="/login"
          className="ml-1 rounded-full bg-white px-5 py-2 font-mono text-xs text-black transition-transform duration-300 hover:scale-105 md:text-sm"
        >
          Login
        </Link>
      </div>
    </motion.nav>
  );
}
