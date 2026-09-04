import React from 'react';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  FileText, 
  Users, 
  ArrowRight,
  Flame,
  Scale
} from 'lucide-react';
import { Tournament, TournamentSettings } from '../types';

interface TournamentPageProps {
  tournament: Tournament;
  settings: TournamentSettings;
  setCurrentPage: (page: string) => void;
}

export const TournamentPage: React.FC<TournamentPageProps> = ({
  tournament,
  settings,
  setCurrentPage,
}) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="text-center sm:text-left border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5 text-indigo-400" />
          <span>Official Championship Regulations</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">
          Tournament Overview & Rules
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
          Everything you need to know about the Collegiate Volleyball Championship 2026: format, courts, scoring regulations, and tiebreaker procedures.
        </p>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-[#1E293B] rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
              Official NCAA Sanctioned
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase text-white mt-0.5">
              {tournament.name}
            </h2>
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-bold uppercase tracking-wider self-start md:self-auto">
            {tournament.status} Tournament
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Competition Dates</span>
            <strong className="text-white text-sm font-semibold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              {tournament.start_date} – {tournament.end_date}
            </strong>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Main Facility</span>
            <strong className="text-white text-sm font-semibold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" />
              {tournament.venue || 'Austin Fieldhouse'}
            </strong>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Tournament Format</span>
            <strong className="text-white text-sm font-semibold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-indigo-400" />
              {tournament.format || 'League + Knockout'}
            </strong>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Match Structure</span>
            <strong className="text-white text-sm font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-400" />
              Best of {settings.sets_to_win === 3 ? '5 Sets' : '3 Sets'}
            </strong>
          </div>
        </div>
      </div>

      {/* Rules & Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Match Scoring & Sets */}
        <div className="bg-[#1E293B] rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/40 text-indigo-400 flex items-center justify-center border border-indigo-900/50">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                Match Scoring & Set Format
              </h3>
              <p className="text-xs text-slate-400">Rally Point System</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Best of 3 Sets:</strong> First team to win 2 sets wins the match.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Sets 1 and 2:</strong> Played to 25 points. A team must win by at least 2 points (deuce rules apply without ceiling cap).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Deciding Set 3 (Tiebreaker):</strong> If tied at 1-1, Set 3 is played to 15 points (must win by 2 points).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Timeouts:</strong> Each team is granted two 30-second timeouts per set.
              </span>
            </li>
          </ul>
        </div>

        {/* Standings Points Allocation */}
        <div className="bg-[#1E293B] rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/40 text-indigo-400 flex items-center justify-center border border-indigo-900/50">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                Points Allocation System
              </h3>
              <p className="text-xs text-slate-400">Championship Table Scoring</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="font-semibold text-slate-300">Match Victory (Win)</span>
              <span className="font-mono font-bold text-sm text-emerald-400">+{settings.win_points} Points</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="font-semibold text-slate-300">Match Defeat (Loss)</span>
              <span className="font-mono font-bold text-sm text-slate-400">+{settings.loss_points} Points</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="font-semibold text-slate-300">Forfeit / Walkover</span>
              <span className="font-mono font-bold text-sm text-rose-400">{settings.forfeit_points} Point</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
              <strong className="text-indigo-400">Tiebreaker Rules:</strong> In the event of equal points, standings are determined by:
              1. Head-to-Head Result → 2. Set Ratio (Sets Won ÷ Sets Lost) → 3. Total Point Differential.
            </div>
          </div>
        </div>

        {/* Tournament Venues & Courts */}
        <div className="bg-[#1E293B] rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/40 text-indigo-400 flex items-center justify-center border border-indigo-900/50">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                Facility & Court Allocations
              </h3>
              <p className="text-xs text-slate-400">Official Venues</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <strong className="text-white block font-heading text-sm uppercase">Court 1 — Main Arena</strong>
              <p className="text-slate-400">
                Hardwood flooring with Taraflex overlay. Equipped with digital scoreboard, TV broadcast stands, and official video challenge replay.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <strong className="text-white block font-heading text-sm uppercase">Court 2 — West Pavilion</strong>
              <p className="text-slate-400">
                Full competition standard synthetic court. Hosted simultaneous round-robin fixtures and warm-up transitions.
              </p>
            </div>
          </div>
        </div>

        {/* Code of Conduct & Student Eligibility */}
        <div className="bg-[#1E293B] rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/40 text-indigo-400 flex items-center justify-center border border-indigo-900/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                Eligibility & Conduct Code
              </h3>
              <p className="text-xs text-slate-400">Varsity Athlete Standards</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Only officially registered students with verified Roll Numbers can participate.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>A player cannot represent multiple teams simultaneously in the championship.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Full varsity uniform (with visible numbered jersey) is mandatory on court.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Zero-tolerance sportsmanship policy regarding referees and line judges.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-6 rounded-2xl bg-[#1E293B] border border-indigo-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-heading text-base font-bold uppercase text-white">
            Want to Participate in the Championship?
          </h4>
          <p className="text-xs text-slate-400">
            Submit your student application online and get reviewed by team coaches.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('apply')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-500/20"
        >
          <span>Apply for Team</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
