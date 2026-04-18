import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Timeline" },
  { to: "/people", label: "People" },
  { to: "/locations", label: "Locations" },
];

export default function Navbar({ title }) {
  const [isOpen, setIsOpen] = useState(false);

  const desktopLinkStyles = ({ isActive }) => `
        relative text-sm font-medium transition-all duration-200 py-1
        ${isActive ? "text-primary after:scale-x-100" : "text-muted-foreground hover:text-primary after:scale-x-0"}
        after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-left after:transition-transform after:duration-300 hover:after:scale-x-100
    `;

  const mobileLinkStyles = ({ isActive }) => `
        text-lg font-medium transition-colors
        ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}
    `;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-foreground shrink-0"
          >
            {title}
          </Link>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={desktopLinkStyles}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border/40 px-6 py-6 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={mobileLinkStyles}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
