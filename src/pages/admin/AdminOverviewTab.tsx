import React from 'react';
import { 
  Users, 
  FileText, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { StudentApplication, Player, Team, Match, TeamStanding } from '../../types';

interface AdminOverviewTabProps {
  applications: StudentApplication[];
  players: Player[];
  teams: Team[];
  matches: Match[];
  standings: TeamStanding[];
  setActiveTab: (tab: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  applications,
  players,
  teams,
  matches,
  standings,
  setActiveTab,
}) => {
  const pendingApps = applications.filter(a => a.status === 'Pending');
  const approvedApps = applications.filter(a => a.status === 'Approved');
  const rejectedApps = applications.filter(a => a.status === 'Rejected');

  const unassignedPlayers = players.filter(p => !p.team_id && p.status === 'Available');
  const completedMatches = matches.filter(m => m.status === 'Completed');
  const scheduledMatches = matches.filter(m => m.status === 'Scheduled');
  const liveMatches = matches.filter(m => m.status === 'Live');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Pending Applications Alert Banner if any */}
      {pendingApps.length > 0 && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading text-sm font-bold uppercase text-white">
                {pendingApps.length} New Athlete Applications Awaiting Review
              </h4>
              <p className="text-xs text-slate-400">
                Review candidate details and approve to enroll them into available varsity player rosters.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('applications')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shrink-0 flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
          >
            <span>Review Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div 
          onClick={() => setActiveTab('applications')}
          className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 shadow-xl hover:border-indigo-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Applications
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/50 text-indigo-400 flex items-center justify-center border border-indigo-900/50">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {applications.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-slate-400">
            <span className="text-amber-400 font-bold">{pendingApps.length} Pending</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">{approvedApps.length} Approved</span>
          </div>
        </div>

        {/* Players in Pool */}
        <div 
          onClick={() => setActiveTab('players')}
          className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 shadow-xl hover:border-indigo-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Total Players
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/50 text-indigo-400 flex items-center justify-center border border-indigo-900/50">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {players.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-slate-400">
            <span className="text-emerald-400 font-bold">{players.length - unassignedPlayers.length} Assigned</span>
            <span>•</span>
            <span className="text-indigo-400 font-bold">{unassignedPlayers.length} Free</span>
          </div>
        </div>

        {/* Varsity Teams */}
        <div 
          onClick={() => setActiveTab('teams')}
          className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 shadow-xl hover:border-indigo-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Varsity Teams
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/50 text-indigo-400 flex items-center justify-center border border-indigo-900/50">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {teams.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-slate-400">
            <span>Pool A Competition</span>
          </div>
        </div>

        {/* Matches Status */}
        <div 
          onClick={() => setActiveTab('matches')}
          className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 shadow-xl hover:border-indigo-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Matches
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/50 text-indigo-400 flex items-center justify-center border border-indigo-900/50">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {matches.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold text-slate-400">
            <span className="text-emerald-400 font-bold">{completedMatches.length} Done</span>
            <span>•</span>
            <span className="text-indigo-400 font-bold">{scheduledMatches.length} Upcoming</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h3 className="font-heading text-base font-bold uppercase text-white tracking-wide mb-4">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('applications')}
            className="p-4 rounded-2xl bg-[#1E293B] border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 shadow-xl text-left transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-950/50 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-900/50 group-hover:bg-indigo-600 group-hover:text-white transition">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-xs font-bold uppercase text-white">Review Applications</strong>
              <span className="text-[11px] text-slate-400">Approve or reject student submissions</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('squads')}
            className="p-4 rounded-2xl bg-[#1E293B] border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 shadow-xl text-left transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-950/50 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-900/50 group-hover:bg-indigo-600 group-hover:text-white transition">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-xs font-bold uppercase text-white">Build Team Squads</strong>
              <span className="text-[11px] text-slate-400">Assign athletes & designate captains</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className="p-4 rounded-2xl bg-[#1E293B] border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 shadow-xl text-left transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-950/50 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-900/50 group-hover:bg-indigo-600 group-hover:text-white transition">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-xs font-bold uppercase text-white">Schedule Match</strong>
              <span className="text-[11px] text-slate-400">Create new fixture on Court 1 or 2</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className="p-4 rounded-2xl bg-[#1E293B] border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 shadow-xl text-left transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-950/50 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-900/50 group-hover:bg-indigo-600 group-hover:text-white transition">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-xs font-bold uppercase text-white">Enter Match Results</strong>
              <span className="text-[11px] text-slate-400">Record set scores & update standings</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('standings')}
            className="p-4 rounded-2xl bg-[#1E293B] border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 shadow-xl text-left transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-950/50 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-900/50 group-hover:bg-indigo-600 group-hover:text-white transition">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-xs font-bold uppercase text-white">Points Table Engine</strong>
              <span className="text-[11px] text-slate-400">Preview live tournament standings</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="p-4 rounded-2xl bg-[#1E293B] border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 shadow-xl text-left transition flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-950/50 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-900/50 group-hover:bg-indigo-600 group-hover:text-white transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-xs font-bold uppercase text-white">Tournament Settings</strong>
              <span className="text-[11px] text-slate-400">Supabase database & scoring rules</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
