import React, { useState } from 'react';
import { 
  TableProperties, 
  RefreshCw, 
  CheckCircle2, 
  Trophy, 
  TrendingUp, 
  Scale, 
  Award,
  AlertCircle
} from 'lucide-react';
import { TeamStanding } from '../../types';
import { supabaseService } from '../../lib/supabase';

interface AdminStandingsTabProps {
  standings: TeamStanding[];
  onDataChanged: () => void;
}

export const AdminStandingsTab: React.FC<AdminStandingsTabProps> = ({
  standings,
  onDataChanged,
}) => {
  const [recalculating, setRecalculating] = useState(false);
  const [recalcSuccess, setRecalcSuccess] = useState(false);

  const handleRecalculate = async () => {
    setRecalculating(true);
    setRecalcSuccess(false);

    try {
      await supabaseService.recalculateStandings();
      onDataChanged();
      setRecalcSuccess(true);
      setTimeout(() => setRecalcSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Recalculate Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h3 className="font-heading text-lg font-bold uppercase text-white">
            Official Championship Standings
          </h3>
          <p className="text-xs text-slate-400">
            Leaderboard calculated from completed match scores (2 pts for Win, 0 for Loss).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {recalcSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Re-computed!
            </span>
          )}
          <button
            onClick={handleRecalculate}
            disabled={recalculating}
            id="recalculate-standings-btn"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
            <span>{recalculating ? 'Recalculating...' : 'Recalculate Standings'}</span>
          </button>
        </div>
      </div>

      {/* Standings Table */}
      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {standings.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="font-heading text-base font-bold uppercase text-white">
              No Standings Records
            </h4>
            <p className="text-xs text-slate-400">
              Teams will appear here once registered. Points update automatically as matches finish.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-3 text-center w-12">Pos</th>
                  <th className="py-3 px-4 text-left">Team Name</th>
                  <th className="py-3 px-3 text-center">Played</th>
                  <th className="py-3 px-3 text-center text-emerald-400">Won</th>
                  <th className="py-3 px-3 text-center text-rose-400">Lost</th>
                  <th className="py-3 px-3 text-center">Sets Won</th>
                  <th className="py-3 px-3 text-center">Sets Lost</th>
                  <th className="py-3 px-3 text-center">Set Ratio</th>
                  <th className="py-3 px-3 text-center">Pts +</th>
                  <th className="py-3 px-3 text-center">Pts -</th>
                  <th className="py-3 px-3 text-center">Diff</th>
                  <th className="py-3 px-4 text-center font-black text-indigo-400 text-sm">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {standings.map((item, index) => (
                  <tr key={item.team_id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-3 text-center font-sans font-bold">
                      <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[11px] font-black ${
                        index === 0 ? 'bg-indigo-600 text-white shadow-sm' :
                        index === 1 ? 'bg-slate-800 text-slate-200' : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2.5">
                        <img src={item.logo_url} alt="" className="w-7 h-7 rounded-lg object-cover border border-slate-700" />
                        <div>
                          <strong className="block text-white font-bold">{item.team_name}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">{item.short_code} • {item.division || 'Pool A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center text-white font-bold">{item.played}</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold text-sm bg-emerald-950/20">{item.won}</td>
                    <td className="py-3 px-3 text-center text-rose-400 font-bold text-sm bg-rose-950/20">{item.lost}</td>
                    <td className="py-3 px-3 text-center text-slate-200">{item.sets_won}</td>
                    <td className="py-3 px-3 text-center text-slate-400">{item.sets_lost}</td>
                    <td className="py-3 px-3 text-center text-white font-semibold">{item.set_ratio}</td>
                    <td className="py-3 px-3 text-center text-slate-300">{item.points_scored}</td>
                    <td className="py-3 px-3 text-center text-slate-400">{item.points_conceded}</td>
                    <td className="py-3 px-3 text-center font-bold">
                      <span className={item.point_differential > 0 ? 'text-emerald-400' : item.point_differential < 0 ? 'text-rose-400' : 'text-slate-400'}>
                        {item.point_differential > 0 ? `+${item.point_differential}` : item.point_differential}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-black text-white text-base bg-indigo-950/40 border-x border-indigo-900/40">
                      {item.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Scoring Explanation */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-1">
        <strong className="font-heading uppercase tracking-wide block text-slate-200">Mathematical Standings Sorting Logic:</strong>
        <p>1. Total Championship Points (Win = 2 pts, Loss = 0 pts)</p>
        <p>2. Set Ratio (Sets Won ÷ Sets Lost)</p>
        <p>3. Point Differential (Total points scored in sets minus total points conceded)</p>
      </div>
    </div>
  );
};
