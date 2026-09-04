import React from 'react';
import { Flame, Shield, MapPin, Calendar, Award, ExternalLink } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-[#1E293B] text-slate-400 border-t border-slate-800 text-sm">
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/20">
                <Flame className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white uppercase">
                  VolleySpike 2026
                </span>
                <p className="text-[11px] text-indigo-400 uppercase tracking-wider font-semibold">
                  Collegiate Championship
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The premier inter-collegiate volleyball championship platform connecting student athletes, varsity squads, schedules, and live courtside results.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                NCAA Standard Best of 3
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-l-2 border-indigo-500 pl-2.5">
              Tournament Navigation
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="hover:text-indigo-400 transition"
                >
                  Championship Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('apply')}
                  className="hover:text-indigo-300 transition text-indigo-400 font-semibold"
                >
                  Student Athlete Application
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('teams')}
                  className="hover:text-indigo-400 transition"
                >
                  Varsity Teams & Squads
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('matches')}
                  className="hover:text-indigo-400 transition"
                >
                  Match Fixtures & Set Scores
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('standings')}
                  className="hover:text-indigo-400 transition"
                >
                  Championship Points Table
                </button>
              </li>
            </ul>
          </div>

          {/* Venue & Event Details */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-l-2 border-indigo-500 pl-2.5">
              Event Details
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Austin Collegiate Fieldhouse</strong>
                  <span className="text-slate-400">Court 1 (Main Arena) & Court 2 (West Pavilion)</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Sept 10 - Sept 18, 2026</strong>
                  <span className="text-slate-400">League Stage followed by Grand Finals</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin & Tech Details */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-l-2 border-indigo-500 pl-2.5">
              Administrative Portal
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Restricted management area for tournament directors to review student applications, draft squads, schedule matches, and record set results.
            </p>
            <button
              id="footer-admin-portal-btn"
              onClick={() => setCurrentPage('admin-login')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold border border-indigo-500/30 transition w-full justify-center shadow-sm"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard Login</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
            </button>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-medium">
          <div>Connected to <span className="text-emerald-400">supabase-prod-01</span></div>
          <div>Spike Off Collegiate Athletics Network • &copy; 2026</div>
          <div>System Load: <span className="text-emerald-400">Normal</span></div>
        </div>
      </div>
    </footer>
  );
};
