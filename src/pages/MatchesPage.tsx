import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Radio, 
  Trophy, 
  ChevronRight, 
  Filter, 
  CheckCircle2 
} from 'lucide-react';
import { Match, Team, MatchStatus } from '../types';

interface MatchesPageProps {
  matches: Match[];
  teams: Team[];
  setSelectedMatchId: (id: string) => void;
  setCurrentPage: (page: string) => void;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({
  matches,
  teams,
  setSelectedMatchId,
  setCurrentPage,
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | MatchStatus>('All');
  const [courtFilter, setCourtFilter] = useState<string>('All');

  const courts = ['All', 'Court 1 (Main Arena)', 'Court 2 (West Pavilion)'];

  const getTeam = (teamId: string) => teams.find(t => t.id === teamId);

  const filteredMatches = matches.filter(m => {
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesCourt = courtFilter === 'All' || m.court === courtFilter;
    return matchesStatus && matchesCourt;
  });

  const liveCount = matches.filter(m => m.status === 'Live').length;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fadeIn space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Collegiate Match Center</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
            Fixtures & Set Results
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
            Live courtside action, upcoming scheduled fixtures, and verified set scores for the championship.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center bg-[#1E293B] p-1 rounded-xl border border-slate-800 shadow-sm">
            {(['All', 'Live', 'Scheduled', 'Completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-bold transition uppercase tracking-wider ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{st}</span>
                {st === 'Live' && liveCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1.5 right-1.5" />
                )}
              </button>
            ))}
          </div>

          {/* Court Filter */}
          <div className="flex items-center bg-[#1E293B] px-3 py-1.5 rounded-xl border border-slate-800 shadow-sm text-xs">
            <span className="text-slate-400 mr-2 font-semibold">Court:</span>
            <select
              value={courtFilter}
              onChange={(e) => setCourtFilter(e.target.value)}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
            >
              {courts.map(c => (
                <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl p-12 text-center border border-slate-800 max-w-lg mx-auto space-y-3 shadow-lg">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-heading text-lg font-bold uppercase text-white">
            No Matches Found
          </h3>
          <p className="text-xs text-slate-400">
            No matches match your active filter settings. Try switching to "All" status or another court.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMatches.map((match) => {
            const teamA = getTeam(match.team_a_id);
            const teamB = getTeam(match.team_b_id);
            const isCompleted = match.status === 'Completed';
            const isLive = match.status === 'Live';
            const aWon = match.winner_id === match.team_a_id;
            const bWon = match.winner_id === match.team_b_id;

            return (
              <div
                key={match.id}
                id={`match-card-${match.id}`}
                onClick={() => {
                  setSelectedMatchId(match.id);
                  setCurrentPage('match-detail');
                }}
                className={`rounded-2xl border bg-[#1E293B] p-5 sm:p-6 shadow-lg hover:shadow-indigo-500/10 transition cursor-pointer group flex flex-col justify-between space-y-4 ${
                  isLive
                    ? 'border-rose-500/80 ring-2 ring-rose-500/20'
                    : 'border-slate-800 hover:border-indigo-500/60'
                }`}
              >
                <div>
                  {/* Card Meta Row */}
                  <div className="flex items-center justify-between gap-2 text-xs mb-4 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{match.round}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{match.court}</span>
                    </div>

                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800 text-[11px] font-black uppercase tracking-wider animate-pulse">
                        <Radio className="w-3.5 h-3.5 text-rose-500" />
                        <span>Live on Court</span>
                      </span>
                    ) : isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Final Result</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-950/40 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-900/50">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        <span>Scheduled</span>
                      </span>
                    )}
                  </div>

                  {/* Teams vs Board */}
                  <div className="space-y-3">
                    {/* Team A Row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img 
                          src={teamA?.logo_url} 
                          alt="" 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-900 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className={`font-heading text-lg uppercase tracking-tight truncate group-hover:text-indigo-400 transition ${
                            aWon ? 'font-black text-white' : 'font-bold text-slate-200'
                          }`}>
                            {teamA?.name || 'Team A'}
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {teamA?.conference || 'Varsity'}
                          </span>
                        </div>
                      </div>

                      {/* Sets Score A */}
                      <div className="text-right shrink-0">
                        {isCompleted || isLive ? (
                          <div className={`font-mono text-2xl font-black ${
                            aWon ? 'text-indigo-400' : 'text-slate-400'
                          }`}>
                            {match.sets_won_a}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 font-semibold uppercase">--</span>
                        )}
                      </div>
                    </div>

                    {/* Team B Row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img 
                          src={teamB?.logo_url} 
                          alt="" 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 bg-slate-900 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className={`font-heading text-lg uppercase tracking-tight truncate group-hover:text-indigo-400 transition ${
                            bWon ? 'font-black text-white' : 'font-bold text-slate-200'
                          }`}>
                            {teamB?.name || 'Team B'}
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {teamB?.conference || 'Varsity'}
                          </span>
                        </div>
                      </div>

                      {/* Sets Score B */}
                      <div className="text-right shrink-0">
                        {isCompleted || isLive ? (
                          <div className={`font-mono text-2xl font-black ${
                            bWon ? 'text-indigo-400' : 'text-slate-400'
                          }`}>
                            {match.sets_won_b}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 font-semibold uppercase">--</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Set-by-Set Scores (if completed or live) */}
                  {match.set_scores && match.set_scores.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] font-sans uppercase font-bold text-slate-400">
                        Sets (Best of 3):
                      </span>
                      <div className="flex items-center gap-2">
                        {match.set_scores.map(s => (
                          <span key={s.set_number} className="bg-slate-900 px-2 py-0.5 rounded text-slate-200 font-bold border border-slate-800">
                            {s.score_a}-{s.score_b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{match.match_date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{match.match_time}</span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-indigo-400 group-hover:translate-x-1 transition">
                    <span>Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
