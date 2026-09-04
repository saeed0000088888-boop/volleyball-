import React, { useState } from 'react';
import { 
  TableProperties, 
  Trophy, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  ChevronRight 
} from 'lucide-react';
import { TeamStanding } from '../types';

interface PointsTablePageProps {
  standings: TeamStanding[];
  setSelectedTeamId: (teamId: string) => void;
  setCurrentPage: (page: string) => void;
}

export const PointsTablePage: React.FC<PointsTablePageProps> = ({
  standings,
  setSelectedTeamId,
  setCurrentPage,
}) => {
  const [selectedDivision, setSelectedDivision] = useState<string>('All');

  const divisions = ['All', ...Array.from(new Set(standings.map(s => s.division || 'Pool A')))];

  const filteredStandings = standings.filter(s => {
    return selectedDivision === 'All' || (s.division || 'Pool A') === selectedDivision;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fadeIn max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <TableProperties className="w-3.5 h-3.5 text-indigo-400" />
            <span>Official Tournament Leaderboard</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
            Championship Points Table
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
            Live standings calculated automatically from verified match results. Ranked by Points, Set Ratio, and Point Differential.
          </p>
        </div>

        {/* Division Filter */}
        <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-xl border border-slate-800 shadow-sm self-start md:self-auto">
          {divisions.map((div) => (
            <button
              key={div}
              onClick={() => setSelectedDivision(div)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition uppercase tracking-wider ${
                selectedDivision === div
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {filteredStandings.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-heading text-lg font-bold uppercase text-white">
              No Standings Available
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Standings will populate automatically as teams are formed and match scores are submitted.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-4 px-4 text-center w-12">Pos</th>
                  <th className="py-4 px-4 text-left">Team Name</th>
                  <th className="py-4 px-3 text-center" title="Matches Played">P</th>
                  <th className="py-4 px-3 text-center text-emerald-400" title="Matches Won">W</th>
                  <th className="py-4 px-3 text-center text-rose-400" title="Matches Lost">L</th>
                  <th className="py-4 px-3 text-center" title="Sets Won">SW</th>
                  <th className="py-4 px-3 text-center" title="Sets Lost">SL</th>
                  <th className="py-4 px-3 text-center" title="Set Ratio (SW / SL)">Ratio</th>
                  <th className="py-4 px-3 text-center" title="Total Points Scored">Pts+</th>
                  <th className="py-4 px-3 text-center" title="Total Points Conceded">Pts-</th>
                  <th className="py-4 px-3 text-center" title="Point Differential">Diff</th>
                  <th className="py-4 px-4 text-center font-black text-indigo-400 text-sm" title="Tournament Points">PTS</th>
                  <th className="py-4 px-4 text-center">Recent Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredStandings.map((item, index) => {
                  const isGold = index === 0;
                  const isSilver = index === 1;

                  return (
                    <tr
                      key={item.team_id}
                      onClick={() => {
                        setSelectedTeamId(item.team_id);
                        setCurrentPage('team-detail');
                      }}
                      className="hover:bg-slate-900/40 transition cursor-pointer group"
                    >
                      {/* Rank Position */}
                      <td className="py-4 px-4 text-center font-bold">
                        <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-black ${
                          isGold 
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20' 
                            : isSilver 
                            ? 'bg-slate-700 text-slate-200' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {index + 1}
                        </div>
                      </td>

                      {/* Team Name & Logo */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.logo_url} 
                            alt="" 
                            className="w-9 h-9 rounded-xl object-cover border border-slate-700 bg-slate-900 shrink-0"
                          />
                          <div>
                            <span className="font-heading text-base font-bold uppercase text-white group-hover:text-indigo-400 transition block">
                              {item.team_name}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              {item.division || 'Pool A'} • Code: {item.short_code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Played */}
                      <td className="py-4 px-3 text-center font-mono font-bold text-slate-300">
                        {item.played}
                      </td>

                      {/* Won */}
                      <td className="py-4 px-3 text-center font-mono font-bold text-emerald-400 text-sm bg-emerald-950/20">
                        {item.won}
                      </td>

                      {/* Lost */}
                      <td className="py-4 px-3 text-center font-mono font-bold text-rose-400 text-sm bg-rose-950/20">
                        {item.lost}
                      </td>

                      {/* Sets Won */}
                      <td className="py-4 px-3 text-center font-mono text-slate-300">
                        {item.sets_won}
                      </td>

                      {/* Sets Lost */}
                      <td className="py-4 px-3 text-center font-mono text-slate-500">
                        {item.sets_lost}
                      </td>

                      {/* Set Ratio */}
                      <td className="py-4 px-3 text-center font-mono text-slate-200 font-semibold">
                        {item.set_ratio}
                      </td>

                      {/* Points + */}
                      <td className="py-4 px-3 text-center font-mono text-slate-400">
                        {item.points_scored}
                      </td>

                      {/* Points - */}
                      <td className="py-4 px-3 text-center font-mono text-slate-500">
                        {item.points_conceded}
                      </td>

                      {/* Differential */}
                      <td className="py-4 px-3 text-center font-mono font-bold">
                        <span className={item.point_differential > 0 ? 'text-emerald-400' : item.point_differential < 0 ? 'text-rose-400' : 'text-slate-400'}>
                          {item.point_differential > 0 ? `+${item.point_differential}` : item.point_differential}
                        </span>
                      </td>

                      {/* PTS */}
                      <td className="py-4 px-4 text-center font-mono font-black text-indigo-400 text-base bg-indigo-950/30 border-x border-indigo-900/40">
                        {item.points}
                      </td>

                      {/* Form */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {item.form.length === 0 ? (
                            <span className="text-slate-500 font-mono text-[10px]">--</span>
                          ) : (
                            item.form.map((f, i) => (
                              <span
                                key={i}
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                                  f === 'W' ? 'bg-emerald-600' : 'bg-slate-700'
                                }`}
                              >
                                {f}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rules Explanatory Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-3">
          <h4 className="font-heading text-sm font-bold uppercase text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>Championship Points System</span>
          </h4>
          <div className="grid grid-cols-3 gap-3 text-xs text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block">Match Win</span>
              <strong className="text-emerald-400 font-mono font-bold text-sm">2 Points</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block">Match Loss</span>
              <strong className="text-slate-400 font-mono font-bold text-sm">0 Points</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block">Walkover / Forfeit</span>
              <strong className="text-rose-400 font-mono font-bold text-sm">-1 Point</strong>
            </div>
          </div>
        </div>

        <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-2 text-xs text-slate-400">
          <h4 className="font-heading text-sm font-bold uppercase text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>NCAA Tiebreaker Hierarchy</span>
          </h4>
          <p className="leading-relaxed">
            If two or more teams finish tied on equal points, the rankings are settled sequentially by:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 font-medium">
            <li><strong className="text-white">Head-to-head match result</strong> between tied teams</li>
            <li><strong className="text-white">Set Ratio:</strong> Total Sets Won divided by Total Sets Lost</li>
            <li><strong className="text-white">Point Differential:</strong> Total points scored minus total points conceded</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
