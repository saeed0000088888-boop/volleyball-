import React, { useState } from 'react';
import { 
  Shield, 
  BarChart3, 
  FileText, 
  Users, 
  Trophy, 
  Calendar, 
  Award, 
  TrendingUp, 
  Settings, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { 
  Tournament, 
  TournamentSettings, 
  Team, 
  Player, 
  Match, 
  TeamStanding, 
  StudentApplication, 
  AdminUser 
} from '../../types';
import { supabaseService } from '../../lib/supabase';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminApplicationsTab } from './AdminApplicationsTab';
import { AdminPlayersTab } from './AdminPlayersTab';
import { AdminTeamsTab } from './AdminTeamsTab';
import { AdminSquadsTab } from './AdminSquadsTab';
import { AdminMatchesTab } from './AdminMatchesTab';
import { AdminResultsTab } from './AdminResultsTab';
import { AdminStandingsTab } from './AdminStandingsTab';
import { AdminSettingsTab } from './AdminSettingsTab';

interface AdminDashboardProps {
  adminUser: AdminUser;
  tournament: Tournament;
  settings: TournamentSettings;
  teams: Team[];
  players: Player[];
  matches: Match[];
  standings: TeamStanding[];
  applications: StudentApplication[];
  setCurrentPage: (page: string) => void;
  onLogout: () => void;
  refreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  tournament,
  settings,
  teams,
  players,
  matches,
  standings,
  applications,
  setCurrentPage,
  onLogout,
  refreshData,
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedMatchForResults, setSelectedMatchForResults] = useState<string | undefined>(undefined);

  const pendingAppsCount = applications.filter(a => a.status === 'Pending').length;

  const handleNavigateToResults = (matchId: string) => {
    setSelectedMatchForResults(matchId);
    setActiveTab('results');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'applications', label: 'Applications', icon: FileText, badge: pendingAppsCount > 0 ? pendingAppsCount : undefined },
    { id: 'players', label: 'Athletes Pool', icon: Users },
    { id: 'teams', label: 'Varsity Teams', icon: Trophy },
    { id: 'squads', label: 'Build Squads', icon: UserCheck },
    { id: 'matches', label: 'Schedule Matches', icon: Calendar },
    { id: 'results', label: 'Enter Results', icon: Award },
    { id: 'standings', label: 'Points Engine', icon: TrendingUp },
    { id: 'settings', label: 'Settings & Supabase', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 flex flex-col animate-fadeIn">
      {/* Admin Top Navigation Bar */}
      <header className="bg-[#1E293B] text-slate-200 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Admin Indicator */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading text-base font-bold uppercase tracking-tight text-white flex items-center gap-2">
                  <span>Tournament Admin Console</span>
                  <span className="text-[10px] font-sans font-black bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.2 rounded uppercase">
                    Director
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 hidden sm:block">
                  {tournament.name} Operations
                </div>
              </div>
            </div>

            {/* Right: User Profile & Public Site Link */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('home')}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition border border-slate-700"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white">{adminUser.name || 'Director'}</div>
                  <div className="text-[10px] text-slate-400">{adminUser.email}</div>
                </div>
                <button
                  id="admin-dashboard-logout-btn"
                  onClick={onLogout}
                  title="Sign out and lock administrator dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock & Exit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Strip (Horizontally Scrollable) */}
        <div className="border-t border-slate-800 bg-slate-900/90 overflow-x-auto scrollbar-none">
          <div className="container mx-auto px-4 sm:px-6 flex space-x-1 py-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`admin-tab-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id !== 'results') setSelectedMatchForResults(undefined);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition uppercase tracking-wider ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 max-w-7xl">
        {activeTab === 'overview' && (
          <AdminOverviewTab
            applications={applications}
            players={players}
            teams={teams}
            matches={matches}
            standings={standings}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'applications' && (
          <AdminApplicationsTab
            applications={applications}
            onDataChanged={refreshData}
          />
        )}

        {activeTab === 'players' && (
          <AdminPlayersTab
            players={players}
            teams={teams}
            onDataChanged={refreshData}
          />
        )}

        {activeTab === 'teams' && (
          <AdminTeamsTab
            teams={teams}
            players={players}
            onDataChanged={refreshData}
          />
        )}

        {activeTab === 'squads' && (
          <AdminSquadsTab
            teams={teams}
            players={players}
            onDataChanged={refreshData}
          />
        )}

        {activeTab === 'matches' && (
          <AdminMatchesTab
            matches={matches}
            teams={teams}
            onDataChanged={refreshData}
            onNavigateToResults={handleNavigateToResults}
          />
        )}

        {activeTab === 'results' && (
          <AdminResultsTab
            matches={matches}
            teams={teams}
            selectedMatchIdFromNav={selectedMatchForResults}
            onDataChanged={refreshData}
          />
        )}

        {activeTab === 'standings' && (
          <AdminStandingsTab
            standings={standings}
            onDataChanged={refreshData}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsTab
            tournament={tournament}
            settings={settings}
            onDataChanged={refreshData}
          />
        )}
      </main>
    </div>
  );
};
