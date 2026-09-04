import React, { useState } from 'react';
import { 
  Users, 
  Trophy, 
  ChevronRight, 
  Search, 
  Award, 
  Shield, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { Team, Player, Match, TeamStanding } from '../types';

interface TeamsPageProps {
  teams: Team[];
  players: Player[];
  matches: Match[];
  standings: TeamStanding[];
  setSelectedTeamId: (teamId: string) => void;
  setCurrentPage: (page: string) => void;
}

export const TeamsPage: React.FC<TeamsPageProps> = ({
  teams,
  players,
  matches,
  standings,
  setSelectedTeamId,
  setCurrentPage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');

  const divisions = ['All', ...Array.from(new Set(teams.map(t => t.division || 'Pool A')))];

  const filteredTeams = teams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.captain_name && t.captain_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDiv = selectedDivision === 'All' || (t.division || 'Pool A') === selectedDivision;
    return matchesSearch && matchesDiv;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-indigo-400" />
            <span>Collegiate Varsity Roster</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
            Tournament Teams & Squads
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
            Explore participating varsity volleyball teams, captain assignments, and official student athlete squad rosters.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search team or captain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition w-full sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-xl border border-slate-800">
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition uppercase tracking-wider ${
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
      </div>

      {/* Empty State */}
      {filteredTeams.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl p-12 sm:p-16 text-center border border-slate-800 max-w-xl mx-auto space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/40 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-900/50">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-xl font-bold uppercase text-white">
            No Teams Matching Criteria
          </h3>
          <p className="text-xs text-slate-400">
            {teams.length === 0
              ? 'No teams have been created yet. The tournament administrator will publish teams and assign squads shortly.'
              : 'Try clearing your search query or switching the division filter.'}
          </p>
          {teams.length === 0 && (
            <button
              onClick={() => setCurrentPage('apply')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-indigo-500/20"
            >
              Apply as a Student Athlete
            </button>
          )}
        </div>
      ) : (
        /* Teams Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team, idx) => {
            const teamSquad = players.filter(p => p.team_id === team.id);
            const standing = standings.find(s => s.team_id === team.id);
            const teamMatches = matches.filter(m => m.team_a_id === team.id || m.team_b_id === team.id);
            const captain = teamSquad.find(p => p.is_captain || p.id === team.captain_id);

            return (
              <div
                key={team.id}
                id={`team-card-${team.id}`}
                onClick={() => {
                  setSelectedTeamId(team.id);
                  setCurrentPage('team-detail');
                }}
                className="bg-[#1E293B] rounded-2xl border border-slate-800 p-6 shadow-xl hover:border-indigo-500/60 hover:shadow-indigo-500/10 transition cursor-pointer group flex flex-col justify-between space-y-5"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 p-2 border border-slate-700 group-hover:scale-105 transition transform flex items-center justify-center overflow-hidden">
                      <img 
                        src={team.logo_url} 
                        alt={team.name} 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                        #{team.seed || idx + 1} Seed
                      </span>
                      <span className="block text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-1">
                        {team.division || 'Pool A'}
                      </span>
                    </div>
                  </div>

                  {/* Team Title */}
                  <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-white group-hover:text-indigo-400 transition">
                    {team.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mb-4">
                    {team.conference || 'Varsity Conference'}
                  </p>

                  {/* Quick Info Box */}
                  <div className="bg-slate-900/80 rounded-xl p-3.5 text-xs space-y-2 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Team Captain:</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        {captain?.name || team.captain_name || 'Unassigned'}
                        {(captain || team.captain_name) && (
                          <Award className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Head Coach:</span>
                      <span className="font-semibold text-slate-300">{team.manager_name || 'Athletics Staff'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Squad Roster:</span>
                      <span className="font-bold text-slate-200 font-mono">
                        {teamSquad.length} Players Registered
                      </span>
                    </div>

                    {standing && (
                      <div className="flex items-center justify-between border-t border-slate-800 pt-2 font-bold">
                        <span className="text-slate-400">Championship Record:</span>
                        <span className="text-emerald-400 font-mono">
                          {standing.won}W - {standing.lost}L • {standing.points} Pts
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition">
                  <div className="flex items-center gap-1 text-slate-400 text-[11px] font-normal">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{teamMatches.length} Fixtures</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>View Full Roster & Schedule</span>
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
