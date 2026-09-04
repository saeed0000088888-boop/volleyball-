import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  TableProperties, 
  FileText, 
  Shield, 
  Menu, 
  X, 
  Radio, 
  Flame, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { AdminUser } from '../types';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  adminUser: AdminUser | null;
  onLogout: () => void;
  liveMatchCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  adminUser,
  onLogout,
  liveMatchCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Trophy },
    { id: 'apply', label: 'Apply for Team', icon: FileText, badge: 'Open' },
    { id: 'teams', label: 'Teams & Squads', icon: Users },
    { id: 'tournament', label: 'Tournament Info', icon: Trophy },
    { id: 'matches', label: 'Matches & Results', icon: Calendar, hasLive: liveMatchCount > 0 },
    { id: 'standings', label: 'Points Table', icon: TableProperties },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1E293B] border-b border-slate-800 text-slate-200 shadow-md">
      {/* Top Banner with Championship announcement */}
      <div className="bg-[#0F172A] border-b border-slate-800/80 py-1.5 px-4 text-xs font-medium text-slate-400 flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              NCAA Division 1 Format
            </span>
            <span className="hidden sm:inline text-slate-300">Collegiate Volleyball Championship 2026 • Official Portal</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            {liveMatchCount > 0 && (
              <span className="flex items-center gap-1.5 font-bold text-rose-400 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                {liveMatchCount} Match In Progress
              </span>
            )}
            <span className="text-slate-400 font-medium hidden md:inline">Venue: Austin Collegiate Fieldhouse</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <button 
            id="nav-brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left transition"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-500 transition">
              <Flame className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition">
                  VolleySpike
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wider uppercase font-medium hidden sm:block">
                Collegiate Volleyball Tournament
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.hasLive && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-2 right-2" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Action (Admin Area) */}
          <div className="hidden lg:flex items-center gap-3">
            {adminUser ? (
              <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 pl-3 rounded-xl border border-slate-700/80">
                <button
                  id="nav-admin-dashboard-btn"
                  onClick={() => handleNavClick('admin')}
                  className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                    currentPage === 'admin'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
                <button
                  id="nav-admin-logout-btn"
                  onClick={onLogout}
                  title="Log out of Admin"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-admin-login-btn"
                onClick={() => handleNavClick('admin-login')}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-600/10 transition"
              >
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {adminUser && (
              <button
                onClick={() => handleNavClick('admin')}
                className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </button>
            )}
            <button
              id="nav-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1E293B] border-b border-slate-800 px-4 pt-2 pb-6 space-y-1.5 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-mobile-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.hasLive && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-rose-500 text-white">
                      LIVE
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </div>
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-800">
            {adminUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-500/20"
                >
                  <Shield className="w-4 h-4" />
                  Open Admin Dashboard
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('admin-login')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-indigo-400 font-bold text-sm hover:bg-slate-700"
              >
                <Shield className="w-4 h-4" />
                Administrator Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
