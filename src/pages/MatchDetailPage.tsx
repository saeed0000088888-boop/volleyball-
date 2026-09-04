import React from 'react';
import { 
  ChevronLeft, 
  Trophy, 
  MapPin, 
  Clock, 
  Calendar, 
  Radio, 
  Award, 
  Users, 
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Match, Team, Player } from '../types';

interface MatchDetailPageProps {
  matchId: string;
  matches: Match[];
  teams: Team[];
  players: Player[];
  setCurrentPage: (page: string) => void;
  setSelectedTeamId: (teamId: string) => void;
}

export const MatchDetailPage: React.FC<MatchDetailPageProps> = ({
  matchId,
  matches,
  teams,
  players,
  setCurrentPage,
  setSelectedTeamId,
}) => {
  const match = matches.find(m => m.id === matchId);
  const teamA = match ? teams.find(t => t.id === match.team_a_id) : undefined;
  const teamB = match ? teams.find(t => t.id === match.team_b_id) : undefined;

  const squadA = match ? players.filter(p => p.team_id === match.team_a_id) : [];
  const squadB = match ? players.filter(p => p.team_id === match.team_b_id) : [];

  if (!match || !teamA || !teamB) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-heading text-2xl font-bold uppercase text-white">Match Not Found</h2>
        <button
          onClick={() => setCurrentPage('matches')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase shadow-lg shadow-indigo-500/20 transition"
        >
          Back to Matches
        </button>
      </div>
    );
  }

  const isCompleted = match.status === 'Completed';
  const isLive = match.status === 'Live';
  const aWon = match.winner_id === teamA.id;
  const bWon = match.winner_id === teamB.id;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fadeIn max-w-5xl">
      {/* Navigation Top */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('matches')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Matches</span>
        </button>

        <div className="flex items-center gap-2">
          {isLive && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800 text-xs font-black uppercase tracking-wider animate-pulse">
              <Radio className="w-3.5 h-3.5" /> Live In Progress
            </span>
          )}
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Match Completed
            </span>
          )}
        </div>
      </div>

      {/* Main Scoreboard Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 sm:p-10 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Match Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-bold text-indigo-400 uppercase tracking-wider">{match.round}</span>
            <span className="text-slate-600">•</span>
            <span>{match.court}</span>
            <span className="text-slate-600">•</span>
            <span>{match.venue}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{match.match_date}</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400 ml-2" />
            <span>{match.match_time}</span>
          </div>
        </div>

        {/* Big Teams vs Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-8">
          {/* Team A */}
          <div className="md:col-span-5 flex flex-col items-center text-center space-y-3">
            <button
              onClick={() => {
                setSelectedTeamId(teamA.id);
                setCurrentPage('team-detail');
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 p-2 border-2 border-slate-700 hover:border-indigo-500/60 hover:scale-105 transition transform flex items-center justify-center overflow-hidden shadow-lg"
            >
              <img src={teamA.logo_url} alt="" className="w-full h-full object-cover rounded-xl" />
            </button>
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                {teamA.name}
              </h2>
              <span className="text-xs text-slate-400 font-medium">{teamA.conference || 'Varsity Conference'}</span>
            </div>
            {aWon && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/20">
                <Trophy className="w-3.5 h-3.5" /> Match Winner
              </span>
            )}
          </div>

          {/* Sets Score Board */}
          <div className="md:col-span-2 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Sets Won
            </span>
            <div className="flex items-center gap-3 font-mono">
              <span className={`text-4xl sm:text-5xl font-black ${aWon ? 'text-indigo-400' : 'text-white'}`}>
                {match.sets_won_a}
              </span>
              <span className="text-2xl text-slate-600 font-normal">:</span>
              <span className={`text-4xl sm:text-5xl font-black ${bWon ? 'text-indigo-400' : 'text-white'}`}>
                {match.sets_won_b}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded">
              Best of 3 Sets
            </span>
          </div>

          {/* Team B */}
          <div className="md:col-span-5 flex flex-col items-center text-center space-y-3">
            <button
              onClick={() => {
                setSelectedTeamId(teamB.id);
                setCurrentPage('team-detail');
              }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 p-2 border-2 border-slate-700 hover:border-indigo-500/60 hover:scale-105 transition transform flex items-center justify-center overflow-hidden shadow-lg"
            >
              <img src={teamB.logo_url} alt="" className="w-full h-full object-cover rounded-xl" />
            </button>
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                {teamB.name}
              </h2>
              <span className="text-xs text-slate-400 font-medium">{teamB.conference || 'Varsity Conference'}</span>
            </div>
            {bWon && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/20">
                <Trophy className="w-3.5 h-3.5" /> Match Winner
              </span>
            )}
          </div>
        </div>

        {/* Notes */}
        {match.notes && (
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 italic">
            "{match.notes}"
          </div>
        )}
      </div>

      {/* Set-by-Set Detailed Scoresheet */}
      {match.set_scores && match.set_scores.length > 0 && (
        <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-heading text-lg font-bold uppercase text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>Official Set Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Standard 25-pt rally scoring (3rd set to 15)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-2.5 px-3 text-left">Set</th>
                  <th className="py-2.5 px-3 text-center">{teamA.name}</th>
                  <th className="py-2.5 px-3 text-center">{teamB.name}</th>
                  <th className="py-2.5 px-3 text-right">Set Winner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {match.set_scores.map((set) => {
                  const setAWon = set.score_a > set.score_b;
                  const setBWon = set.score_b > set.score_a;
                  const winnerTeam = setAWon ? teamA : setBWon ? teamB : null;

                  return (
                    <tr key={set.set_number} className="hover:bg-slate-900/40 transition">
                      <td className="py-3 px-3 font-bold text-slate-200 font-sans uppercase">
                        Set {set.set_number}
                      </td>
                      <td className={`py-3 px-3 text-center font-bold text-base ${
                        setAWon ? 'text-indigo-400 bg-indigo-950/30' : 'text-slate-300'
                      }`}>
                        {set.score_a}
                      </td>
                      <td className={`py-3 px-3 text-center font-bold text-base ${
                        setBWon ? 'text-indigo-400 bg-indigo-950/30' : 'text-slate-300'
                      }`}>
                        {set.score_b}
                      </td>
                      <td className="py-3 px-3 text-right font-sans font-semibold">
                        {winnerTeam ? (
                          <span className="inline-flex items-center gap-1 text-white">
                            <Trophy className="w-3.5 h-3.5 text-indigo-400" />
                            {winnerTeam.name}
                          </span>
                        ) : (
                          <span className="text-slate-500">In progress</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Team Rosters for this Match */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Squad A */}
        <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <img src={teamA.logo_url} alt="" className="w-6 h-6 rounded-full object-cover border border-slate-700 bg-slate-900" />
              <h4 className="font-heading text-base font-bold uppercase text-white">
                {teamA.name} Squad ({squadA.length})
              </h4>
            </div>
            <button
              onClick={() => {
                setSelectedTeamId(teamA.id);
                setCurrentPage('team-detail');
              }}
              className="text-xs text-indigo-400 font-bold hover:underline"
            >
              Full Profile
            </button>
          </div>

          <div className="space-y-2">
            {squadA.slice(0, 6).map(p => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold w-6 text-slate-400">#{p.jersey_number || '--'}</span>
                  <span className="font-semibold text-white">{p.name}</span>
                  {p.is_captain && (
                    <span className="text-[10px] bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-bold uppercase">C</span>
                  )}
                </div>
                <span className="text-slate-400">{p.position}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Squad B */}
        <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <img src={teamB.logo_url} alt="" className="w-6 h-6 rounded-full object-cover border border-slate-700 bg-slate-900" />
              <h4 className="font-heading text-base font-bold uppercase text-white">
                {teamB.name} Squad ({squadB.length})
              </h4>
            </div>
            <button
              onClick={() => {
                setSelectedTeamId(teamB.id);
                setCurrentPage('team-detail');
              }}
              className="text-xs text-indigo-400 font-bold hover:underline"
            >
              Full Profile
            </button>
          </div>

          <div className="space-y-2">
            {squadB.slice(0, 6).map(p => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold w-6 text-slate-400">#{p.jersey_number || '--'}</span>
                  <span className="font-semibold text-white">{p.name}</span>
                  {p.is_captain && (
                    <span className="text-[10px] bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-bold uppercase">C</span>
                  )}
                </div>
                <span className="text-slate-400">{p.position}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
