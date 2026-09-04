import React from 'react';
import { 
  Trophy, 
  Calendar, 
  Users, 
  ArrowRight, 
  Flame, 
  Radio, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Medal,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Tournament, Team, Match, TeamStanding } from '../types';

interface HomePageProps {
  tournament: Tournament;
  teams: Team[];
  matches: Match[];
  standings: TeamStanding[];
  setCurrentPage: (page: string) => void;
  setSelectedTeamId: (teamId: string) => void;
  setSelectedMatchId: (matchId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  tournament,
  teams,
  matches,
  standings,
  setCurrentPage,
  setSelectedTeamId,
  setSelectedMatchId,
}) => {
  const liveMatches = matches.filter(m => m.status === 'Live');
  const upcomingMatches = matches.filter(m => m.status === 'Scheduled');
  const completedMatches = matches.filter(m => m.status === 'Completed');

  const getTeam = (teamId: string) => teams.find(t => t.id === teamId);

  return (
    <div className="space-y-12 pb-16 animate-fadeIn">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1E293B] via-[#162032] to-[#0F172A] text-slate-200 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800">
        {/* Athletic Court Grid Graphic overlay */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-indigo-400" />
                <span>Collegiate Volleyball Season 2026</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-none">
                {tournament.name || 'Collegiate Volleyball Championship 2026'}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {tournament.description || 'The premier inter-collegiate tournament. Review live fixtures, varsity rosters, and points table. Students can apply to join team squads.'}
              </p>

              {/* Tournament Key Facts Badge Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-2">
                <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>{tournament.start_date} – {tournament.end_date}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>{tournament.venue || 'Austin Collegiate Fieldhouse'}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
                  <Trophy className="w-4 h-4 text-indigo-400" />
                  <span>Format: {tournament.format || 'League + Knockout'}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  id="hero-apply-btn"
                  onClick={() => setCurrentPage('apply')}
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2 group"
                >
                  <span>Apply for Team</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  id="hero-matches-btn"
                  onClick={() => setCurrentPage('matches')}
                  className="px-6 py-3.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-white font-bold text-sm uppercase tracking-wider border border-slate-700 hover:border-slate-600 transition flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>View Matches & Results</span>
                </button>

                <button
                  id="hero-standings-btn"
                  onClick={() => setCurrentPage('standings')}
                  className="px-4 py-3.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition flex items-center gap-1.5"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Points Table</span>
                </button>
              </div>
            </div>

            {/* Right Card: Live / Next Featured Match */}
            <div className="lg:col-span-5">
              {liveMatches.length > 0 ? (
                // Live Match Box
                <div className="bg-[#1E293B] rounded-2xl p-6 border-2 border-rose-500/60 shadow-2xl relative overflow-hidden backdrop-blur">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                      <span className="text-xs font-black uppercase tracking-widest text-rose-400 flex items-center gap-1">
                        <Radio className="w-3.5 h-3.5" /> Live On Court
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                      {liveMatches[0].court}
                    </span>
                  </div>

                  {(() => {
                    const match = liveMatches[0];
                    const teamA = getTeam(match.team_a_id);
                    const teamB = getTeam(match.team_b_id);
                    return (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-medium pb-2 border-b border-slate-800">
                          <span>{match.round}</span>
                          <span>{match.venue}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          {/* Team A */}
                          <div className="flex-1 text-center space-y-2">
                            <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 p-1 border-2 border-indigo-500/40 flex items-center justify-center overflow-hidden">
                              <img 
                                src={teamA?.logo_url || 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=100'} 
                                alt={teamA?.name || 'Team A'} 
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <h3 className="font-heading text-base font-bold text-white uppercase tracking-tight">
                              {teamA?.name || 'Team A'}
                            </h3>
                            <div className="text-2xl font-black text-indigo-400 font-mono">
                              {match.sets_won_a} <span className="text-xs text-slate-400 font-normal">Sets</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-center px-2">
                            <span className="text-xl font-black text-slate-500 font-heading">VS</span>
                            <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded mt-1 border border-rose-800">
                              Decider
                            </span>
                          </div>

                          {/* Team B */}
                          <div className="flex-1 text-center space-y-2">
                            <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 p-1 border-2 border-indigo-500/40 flex items-center justify-center overflow-hidden">
                              <img 
                                src={teamB?.logo_url || 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=100'} 
                                alt={teamB?.name || 'Team B'} 
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <h3 className="font-heading text-base font-bold text-white uppercase tracking-tight">
                              {teamB?.name || 'Team B'}
                            </h3>
                            <div className="text-2xl font-black text-indigo-400 font-mono">
                              {match.sets_won_b} <span className="text-xs text-slate-400 font-normal">Sets</span>
                            </div>
                          </div>
                        </div>

                        {/* Set Scores List */}
                        {match.set_scores && match.set_scores.length > 0 && (
                          <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800">
                            <div className="text-[11px] font-bold uppercase text-slate-400 mb-1.5 flex justify-between">
                              <span>Set Scores</span>
                              <span className="text-indigo-400">Best of 3</span>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-xs font-mono">
                              {match.set_scores.map((s) => (
                                <div key={s.set_number} className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-center">
                                  <div className="text-[9px] text-slate-400 uppercase font-sans">Set {s.set_number}</div>
                                  <div className="font-bold text-white">{s.score_a} - {s.score_b}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setSelectedMatchId(match.id);
                            setCurrentPage('match-detail');
                          }}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                        >
                          <span>Full Match Breakdown</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })()}
                </div>
              ) : upcomingMatches.length > 0 ? (
                // Upcoming Next Match Box
                <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Next Blockbuster Match
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {upcomingMatches[0].court}
                    </span>
                  </div>

                  {(() => {
                    const match = upcomingMatches[0];
                    const teamA = getTeam(match.team_a_id);
                    const teamB = getTeam(match.team_b_id);
                    return (
                      <div className="space-y-4">
                        <div className="text-center py-2 bg-slate-900/60 rounded-xl border border-slate-800/80">
                          <span className="text-xs text-indigo-400 font-bold block">{match.round}</span>
                          <span className="text-sm font-semibold text-white">{match.match_date} • {match.match_time}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-center pt-2">
                          <div className="text-center space-y-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 p-1 flex items-center justify-center overflow-hidden">
                              <img src={teamA?.logo_url || ''} alt="" className="w-full h-full object-cover rounded-full" />
                            </div>
                            <h4 className="font-heading font-bold text-sm text-white uppercase">{teamA?.name}</h4>
                            <span className="text-[10px] text-slate-400 block">{teamA?.conference || 'Varsity'}</span>
                          </div>

                          <div className="text-center space-y-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <div className="w-14 h-14 mx-auto rounded-full bg-slate-800 p-1 flex items-center justify-center overflow-hidden">
                              <img src={teamB?.logo_url || ''} alt="" className="w-full h-full object-cover rounded-full" />
                            </div>
                            <h4 className="font-heading font-bold text-sm text-white uppercase">{teamB?.name}</h4>
                            <span className="text-[10px] text-slate-400 block">{teamB?.conference || 'Varsity'}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedMatchId(match.id);
                            setCurrentPage('match-detail');
                          }}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 border border-slate-700"
                        >
                          <span>Match Preview</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-[#1E293B] rounded-2xl p-8 border border-slate-800 text-center space-y-3">
                  <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="font-heading text-lg font-bold text-white uppercase">Championship Ready</h3>
                  <p className="text-xs text-slate-400">
                    Matches will be scheduled soon. Stay tuned for live tournament action!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-[#1E293B] p-5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-heading">{teams.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Varsity Teams</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#1E293B] p-5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-heading">{matches.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Matches Total</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#1E293B] p-5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400 font-heading">{completedMatches.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Completed</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#1E293B] p-5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-400 font-heading">
                {standings[0]?.team_name ? standings[0].short_code : 'TBD'}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Table Leader</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PARTICIPATING TEAMS & SQUADS */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Championship Contenders</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              Participating Teams
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('teams')}
            className="text-xs font-bold text-slate-400 hover:text-indigo-400 transition flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Teams & Rosters</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {teams.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#1E293B] p-12 text-center shadow-lg">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-white uppercase">No Teams Created Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              The tournament administrator hasn't added teams yet. Use the Admin Dashboard to create teams and assign players.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teams.map((team, idx) => {
              const standing = standings.find(s => s.team_id === team.id);
              return (
                <div
                  key={team.id}
                  onClick={() => {
                    setSelectedTeamId(team.id);
                    setCurrentPage('team-detail');
                  }}
                  className="rounded-2xl border border-slate-800 bg-[#1E293B] p-5 shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-xl bg-slate-900 p-1.5 border border-slate-700/60 group-hover:scale-105 transition transform flex items-center justify-center overflow-hidden">
                        <img 
                          src={team.logo_url} 
                          alt={team.name} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 transition">
                        Seed #{team.seed || idx + 1}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-heading text-lg font-bold text-white uppercase tracking-tight group-hover:text-indigo-400 transition">
                        {team.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {team.conference || 'Varsity Conference'} • {team.division || 'Pool A'}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 rounded-xl p-3 text-xs space-y-1.5 border border-slate-800/80">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Captain:</span>
                        <span className="font-semibold text-slate-200">{team.captain_name || 'Assigned in Squad'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Head Coach:</span>
                        <span className="font-semibold text-slate-200">{team.manager_name || 'Staff'}</span>
                      </div>
                      {standing && (
                        <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                          <span className="text-slate-400">Record:</span>
                          <span className="text-indigo-400">{standing.won}W - {standing.lost}L ({standing.points} pts)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition">
                    <span>View Full Squad</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. POINTS TABLE & RECENT RESULTS SPLIT */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Points Table Preview */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#1E293B] p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Standings</span>
                <h3 className="font-heading text-xl font-bold uppercase text-white">Current Points Table</h3>
              </div>
              <button
                onClick={() => setCurrentPage('standings')}
                className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
              >
                <span>Full Standings</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {standings.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No standings data available yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="py-3 px-3 text-left">Pos</th>
                      <th className="py-3 px-3 text-left">Team</th>
                      <th className="py-3 px-2 text-center">P</th>
                      <th className="py-3 px-2 text-center">W</th>
                      <th className="py-3 px-2 text-center">L</th>
                      <th className="py-3 px-2 text-center">Sets</th>
                      <th className="py-3 px-3 text-right">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-800/60">
                    {standings.slice(0, 4).map((item, index) => (
                      <tr 
                        key={item.team_id}
                        onClick={() => {
                          setSelectedTeamId(item.team_id);
                          setCurrentPage('team-detail');
                        }}
                        className="hover:bg-slate-800/40 transition cursor-pointer"
                      >
                        <td className="py-3 px-3 font-bold">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${
                            index === 0 ? 'bg-indigo-600 text-white font-bold' : 'text-indigo-400 font-bold'
                          }`}>
                            0{index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-white">
                          <div className="flex items-center gap-2.5">
                            <img src={item.logo_url} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                            <span>{item.team_name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center text-slate-400 font-mono">{item.played}</td>
                        <td className="py-3 px-2 text-center font-bold text-emerald-400 font-mono">{item.won}</td>
                        <td className="py-3 px-2 text-center font-bold text-rose-400 font-mono">{item.lost}</td>
                        <td className="py-3 px-2 text-center text-slate-400 font-mono">{item.sets_won}-{item.sets_lost}</td>
                        <td className="py-3 px-3 text-right font-black text-white font-mono text-sm">
                          {item.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Match Results */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#1E293B] p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Completed</span>
                <h3 className="font-heading text-xl font-bold uppercase text-white">Recent Results</h3>
              </div>
              <button
                onClick={() => setCurrentPage('matches')}
                className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
              >
                <span>All Matches</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {completedMatches.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No completed matches yet. Results will appear here once entered by the administrator.
              </div>
            ) : (
              <div className="space-y-3">
                {completedMatches.slice(0, 3).map((match) => {
                  const teamA = getTeam(match.team_a_id);
                  const teamB = getTeam(match.team_b_id);
                  const aWon = match.winner_id === match.team_a_id;
                  const bWon = match.winner_id === match.team_b_id;

                  return (
                    <div
                      key={match.id}
                      onClick={() => {
                        setSelectedMatchId(match.id);
                        setCurrentPage('match-detail');
                      }}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/40 transition cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span>{match.round} • {match.match_date}</span>
                        <span className="text-slate-400 font-semibold">{match.court}</span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs">
                        {/* Team A */}
                        <div className={`flex items-center gap-2 flex-1 ${aWon ? 'font-bold text-white' : 'text-slate-400'}`}>
                          <img src={teamA?.logo_url} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                          <span className="truncate">{teamA?.name}</span>
                          {aWon && <Trophy className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                        </div>

                        <div className="font-mono font-bold text-sm bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700 text-white shrink-0">
                          <span className={aWon ? 'text-indigo-400' : 'text-slate-300'}>{match.sets_won_a}</span>
                          <span className="mx-1 text-slate-500">-</span>
                          <span className={bWon ? 'text-indigo-400' : 'text-slate-300'}>{match.sets_won_b}</span>
                        </div>

                        {/* Team B */}
                        <div className={`flex items-center justify-end gap-2 flex-1 ${bWon ? 'font-bold text-white' : 'text-slate-400'}`}>
                          {bWon && <Trophy className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                          <span className="truncate text-right">{teamB?.name}</span>
                          <img src={teamB?.logo_url} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                        </div>
                      </div>

                      {/* Set score pills */}
                      {match.set_scores && match.set_scores.length > 0 && (
                        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
                          {match.set_scores.map(s => (
                            <span key={s.set_number} className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60">
                              {s.score_a}-{s.score_b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. STUDENT ATHLETE CALLOUT BANNER */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900/30 via-slate-900 to-[#1E293B] p-8 sm:p-12 text-white relative overflow-hidden border border-slate-800 shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Public Registration Open</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
              Ready to Spike for Your College?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Applications are officially open to all enrolled students. Fill out your playing position, collegiate experience, and submit your registration. Tournament selectors review applications in real time.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                id="banner-apply-btn"
                onClick={() => setCurrentPage('apply')}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                <span>Submit Athlete Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage('tournament')}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider border border-slate-700 transition"
              >
                Tournament Rules & Guidelines
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
