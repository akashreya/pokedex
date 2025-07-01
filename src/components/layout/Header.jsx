import { Link } from "react-router-dom";
import DarkModeToggle from "../ui/DarkModeToggle";

export default function Header() {
  return (
    <header
      className="w-full py-4 bg-gradient-to-tr from-emerald-200 to-[#0085CA]
     dark:from-gray-800  dark:via-slate-900  dark:to-indigo-800 flex justify-between items-center px-4"
    >
      <div className="text-xl font-bold">
        <Link
          to="/"
          className="text-gray-900 dark:text-gray-300 text-sm md:text-3xl"
        >
          PokéDex
        </Link>
      </div>
      <nav className="flex gap-4 items-center">
        <Link
          to="/"
          className="hover:underline text-gray-900 dark:text-gray-300 text-sm md:text-3xl"
        >
          Home
        </Link>
        <Link
          to="/pokemon"
          className="hover:underline text-gray-900 dark:text-gray-300 text-sm md:text-3xl"
        >
          Pokémon
        </Link>
        <Link
          to="/wordle"
          className="hover:underline text-gray-900 dark:text-gray-300 text-sm md:text-3xl"
        >
          Wordle
        </Link>
        <DarkModeToggle />
      </nav>
    </header>
  );
}
