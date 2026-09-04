/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabaseService } from './lib/supabase';
import { 
  Tournament, 
  TournamentSettings, 
  Team, 
  Player, 
  Match, 
  TeamStanding, 
  StudentApplication, 
  AdminUser 
} from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TeamsPage } from './pages/TeamsPage';
import { TeamDetailPage } from './pages/TeamDetailPage';
import { MatchesPage } from './pages/MatchesPage';
import { MatchDetailPage } from './pages/MatchDetailPage';
import { PointsTablePage } from './pages/PointsTablePage';
import { TournamentPage } from './pages/TournamentPage';
import { ApplyPage } from './pages/ApplyPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Flame, Loader2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');

  // Domain State
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [settings, setSettings] = useState<TournamentSettings | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load all tournament data from Supabase / local persistence
  const loadTournamentData = async () => {
    try {
      const [
        tourneyData,
        settingsData,
        teamsData,
        playersData,
        matchesData,
        standingsData,
        appsData,
        currAdmin,
      ] = await Promise.all([
        supabaseService.getTournament(),
        supabaseService.getTournamentSettings(),
        supabaseService.getTeams(),
        supabaseService.getPlayers(),
        supabaseService.getMatches(),
        supabaseService.getStandings(),
        supabaseService.getApplications(),
        supabaseService.getCurrentAdmin(),
      ]);

      setTournament(tourneyData);
      setSettings(settingsData);
      setTeams(teamsData);
      setPlayers(playersData);
      setMatches(matchesData);
      setStandings(standingsData);
      setApplications(appsData);
      setAdminUser(currAdmin);

      // Set default team or match if not set
      if (!selectedTeamId && teamsData.length > 0) {
        setSelectedTeamId(teamsData[0].id);
      }
      if (!selectedMatchId && matchesData.length > 0) {
        setSelectedMatchId(matchesData[0].id);
      }
    } catch (err) {
      console.error('Failed to load tournament data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournamentData();
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleLogout = async () => {
    await supabaseService.signOut();
    setAdminUser(null);
    setCurrentPage('home');
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setCurrentPage('admin');
  };

  if (loading || !tournament || !settings) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 animate-pulse">
          <Flame className="w-9 h-9 stroke-[2.5]" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-white">
            Collegiate Volleyball Championship
          </h2>
          <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <span>Loading tournament database & live rosters...</span>
          </p>
        </div>
      </div>
    );
  }

  const liveMatchesCount = matches.filter(m => m.status === 'Live').length;

  // If on Admin page, render dedicated Admin Portal (or login if not authenticated)
  if (currentPage === 'admin') {
    if (!adminUser) {
      return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 flex flex-col">
          <Navbar 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            adminUser={adminUser}
            onLogout={handleLogout}
            liveMatchCount={liveMatchesCount}
          />
          <AdminLoginPage 
            onLoginSuccess={handleLoginSuccess}
            setCurrentPage={setCurrentPage}
          />
          <Footer setCurrentPage={setCurrentPage} />
        </div>
      );
    }

    return (
      <AdminDashboard 
        adminUser={adminUser}
        tournament={tournament}
        settings={settings}
        teams={teams}
        players={players}
        matches={matches}
        standings={standings}
        applications={applications}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
        refreshData={loadTournamentData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Public Navbar */}
      <Navbar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        adminUser={adminUser}
        onLogout={handleLogout}
        liveMatchCount={liveMatchesCount}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage 
            tournament={tournament}
            teams={teams}
            matches={matches}
            standings={standings}
            setCurrentPage={setCurrentPage}
            setSelectedTeamId={setSelectedTeamId}
            setSelectedMatchId={setSelectedMatchId}
          />
        )}

        {currentPage === 'teams' && (
          <TeamsPage 
            teams={teams}
            players={players}
            matches={matches}
            standings={standings}
            setSelectedTeamId={setSelectedTeamId}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'team-detail' && (
          <TeamDetailPage 
            teamId={selectedTeamId}
            teams={teams}
            players={players}
            matches={matches}
            standings={standings}
            setCurrentPage={setCurrentPage}
            setSelectedMatchId={setSelectedMatchId}
          />
        )}

        {currentPage === 'matches' && (
          <MatchesPage 
            matches={matches}
            teams={teams}
            setSelectedMatchId={setSelectedMatchId}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'match-detail' && (
          <MatchDetailPage 
            matchId={selectedMatchId}
            matches={matches}
            teams={teams}
            players={players}
            setCurrentPage={setCurrentPage}
            setSelectedTeamId={setSelectedTeamId}
          />
        )}

        {currentPage === 'standings' && (
          <PointsTablePage 
            standings={standings}
            setSelectedTeamId={setSelectedTeamId}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'tournament' && (
          <TournamentPage 
            tournament={tournament}
            settings={settings}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'apply' && (
          <ApplyPage 
            setCurrentPage={setCurrentPage}
            onApplicationSubmitted={loadTournamentData}
          />
        )}

        {currentPage === 'admin-login' && (
          <AdminLoginPage 
            onLoginSuccess={handleLoginSuccess}
            setCurrentPage={setCurrentPage}
          />
        )}
      </main>

      {/* Public Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

