import React from 'react';
import { 
  ChevronLeft, 
  Trophy, 
  Award, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Radio, 
  ShieldCheck 
} from 'lucide-react';
import { Team, Player, Match, TeamStanding } from '../types';

interface TeamDetailPageProps {
  teamId: string;
  teams: Team[];
  players: Player[];
  matches: Match[];
  standings: TeamStanding[];
  setCurrentPage: (page: string) => void;
  setSelectedMatchId: (matchId: string) => void;
}

export const TeamDetailPage: React.FC<TeamDetailPageProps> = ({
  teamId,
  teams,
  players,
  matches,
  standings,
  setCurrentPage,
  setSelectedMatchId,
}) => {
  const team = teams.find(t => t.id === teamId);
  const teamSquad = players.filter(p => p.team_id === teamId);
  const standing = standings.find(s => s.team_id === teamId);
  const teamMatches = matches.filter(m => m.team_a_id === teamId || m.team_b_id === teamId);

  const getOpponent = (match: Match) => {
    const oppId = match.team_a_id === teamId ? match.team_b_id : match.team_a_id;
    return teams.find(t => t.id === oppId);
  };

  if (!team) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-heading text-2xl font-bold uppercase text-white">Team Not Found</h2>
        <button
          onClick={() => setCurrentPage('teams')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase shadow-lg shadow-indigo-500/20 transition"
        >
          Back to Teams
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => setCurrentPage('teams')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to All Teams</span>
      </button>

      {/* Team Hero Header */}
      <div className="bg-[#1E293B] rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 p-2 border-2 border-slate-700 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
            <img 
              src={team.logo_url} 
              alt={team.name} 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-600 text-white uppercase font-mono shadow-sm shadow-indigo-500/20">
                {team.short_code} • #{team.seed || 1} Seed
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                {team.division || 'Pool A'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
                {team.conference || 'Varsity Conference'}
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              {team.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-1">
              <span>
                <strong className="text-slate-200">Captain:</strong> {team.captain_name || 'Designated in Squad'}
              </span>
              <span className="text-slate-600">•</span>
              <span>
                <strong className="text-slate-200">Head Coach:</strong> {team.manager_name || 'Athletic Staff'}
              </span>
              <span className="text-slate-600">•</span>
              <span>
                <strong className="text-slate-200">Roster Size:</strong> {teamSquad.length} Athletes
              </span>
            </div>
          </div>

          {/* Quick Record Box */}
          {standing && (
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-center min-w-[160px] shrink-0">
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Tournament Record</div>
              <div className="text-3xl font-black text-white font-mono mt-1">
                {standing.won}W - {standing.lost}L
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {standing.points} Total Points ({standing.sets_won} Sets Won)
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Squad Roster */}
        <div className="lg:col-span-8 bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Athletes</span>
              <h2 className="font-heading text-2xl font-bold uppercase text-white">
                Official Squad Roster ({teamSquad.length})
              </h2>
            </div>
          </div>

          {teamSquad.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs">No student athletes assigned to this team squad yet.</p>
              <p className="text-[11px] text-slate-500">
                The administrator can assign players from approved applications in the Admin Dashboard.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-3 text-left">#</th>
                    <th className="py-3 px-3 text-left">Player</th>
                    <th className="py-3 px-3 text-left">Position</th>
                    <th className="py-3 px-3 text-left">Class & Sec</th>
                    <th className="py-3 px-3 text-left">Height</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {teamSquad.map((player) => (
                    <tr key={player.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3 px-3 font-mono font-bold text-indigo-400 text-sm">
                        {player.jersey_number || '--'}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={player.profile_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                            alt="" 
                            className="w-8 h-8 rounded-full object-cover border border-slate-700 bg-slate-900 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{player.name}</span>
                              {player.is_captain && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase">
                                  <Award className="w-3 h-3" /> Captain
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {player.roll_number}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-300">
                        {player.position}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {player.class_name} • {player.section}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {player.height || "6'2\""}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                          {player.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Team Schedule & Fixtures */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-heading text-lg font-bold uppercase text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Fixtures & Results ({teamMatches.length})</span>
            </h3>

            {teamMatches.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No fixtures scheduled for this team yet.
              </p>
            ) : (
              <div className="space-y-3">
                {teamMatches.map((match) => {
                  const opp = getOpponent(match);
                  const isWinner = match.winner_id === teamId;
                  const isCompleted = match.status === 'Completed';
                  const isLive = match.status === 'Live';

                  return (
                    <div
                      key={match.id}
                      onClick={() => {
                        setSelectedMatchId(match.id);
                        setCurrentPage('match-detail');
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 hover:border-slate-700 transition cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{match.match_date} • {match.match_time}</span>
                        {isLive ? (
                          <span className="text-rose-400 font-bold uppercase flex items-center gap-1">
                            <Radio className="w-3 h-3 animate-ping" /> Live
                          </span>
                        ) : isCompleted ? (
                          <span className={`font-bold uppercase text-[10px] px-1.5 py-0.5 rounded border ${
                            isWinner ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {isWinner ? 'Won' : 'Lost'}
                          </span>
                        ) : (
                          <span className="text-indigo-400 font-semibold uppercase text-[10px]">
                            Scheduled
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-slate-500 font-medium">vs</span>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <img src={opp?.logo_url} alt="" className="w-5 h-5 rounded-full object-cover border border-slate-700 bg-slate-950 shrink-0" />
                          <span className="font-bold text-white truncate">{opp?.name}</span>
                        </div>

                        {isCompleted && (
                          <div className="font-mono font-bold text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-indigo-400">
                            {match.team_a_id === teamId ? match.sets_won_a : match.sets_won_b} - {match.team_a_id === teamId ? match.sets_won_b : match.sets_won_a}
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-500">
                        {match.court} • {match.round}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
