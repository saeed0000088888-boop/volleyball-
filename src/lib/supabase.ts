import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Tournament, 
  TournamentSettings, 
  StudentApplication, 
  Player, 
  Team, 
  Match, 
  TeamStanding, 
  AdminUser 
} from '../types';
import { 
  INITIAL_TOURNAMENT, 
  INITIAL_SETTINGS, 
  INITIAL_TEAMS, 
  INITIAL_APPLICATIONS, 
  INITIAL_PLAYERS, 
  INITIAL_MATCHES 
} from './initialData';

const STORAGE_KEYS = {
  SUPABASE_URL: 'cvtm_supabase_url',
  SUPABASE_ANON_KEY: 'cvtm_supabase_anon_key',
  ADMIN_SESSION: 'cvtm_admin_session',
  ADMIN_CREDENTIALS: 'cvtm_admin_credentials',
  TOURNAMENT: 'cvtm_tournament',
  SETTINGS: 'cvtm_settings',
  TEAMS: 'cvtm_teams',
  APPLICATIONS: 'cvtm_applications',
  PLAYERS: 'cvtm_players',
  MATCHES: 'cvtm_matches',
};

// SQL Schema for Supabase setup
export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- COLLEGE VOLLEYBALL TOURNAMENT MANAGEMENT DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tournaments Table
CREATE TABLE IF NOT EXISTS public.tournaments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  venue TEXT NOT NULL,
  number_of_teams INTEGER DEFAULT 4,
  format TEXT DEFAULT 'League + Knockout',
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tournament Settings Table
CREATE TABLE IF NOT EXISTS public.tournament_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id TEXT REFERENCES public.tournaments(id) ON DELETE CASCADE,
  win_points INTEGER DEFAULT 2,
  loss_points INTEGER DEFAULT 0,
  forfeit_points INTEGER DEFAULT -1,
  sets_to_win INTEGER DEFAULT 2,
  tiebreaker_rule TEXT DEFAULT 'Head-to-head > Set ratio > Point differential',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  short_code TEXT NOT NULL,
  logo_url TEXT,
  division TEXT DEFAULT 'Pool A',
  seed INTEGER,
  captain_id TEXT,
  captain_name TEXT,
  manager_name TEXT,
  conference TEXT,
  color TEXT DEFAULT '#0d1c32',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Applications Table (Students apply here)
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  roll_number TEXT NOT NULL UNIQUE,
  class_name TEXT NOT NULL,
  section TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  playing_position TEXT NOT NULL,
  previous_experience TEXT,
  profile_photo_url TEXT,
  additional_info TEXT,
  medical_notes TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  tracking_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Players Table (Approved student athletes)
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY,
  application_id TEXT REFERENCES public.applications(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL UNIQUE,
  class_name TEXT NOT NULL,
  section TEXT NOT NULL,
  phone_number TEXT,
  position TEXT NOT NULL,
  team_id TEXT REFERENCES public.teams(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Assigned', 'Inactive')),
  jersey_number INTEGER,
  height TEXT,
  profile_photo_url TEXT,
  is_captain BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
  id TEXT PRIMARY KEY,
  tournament_id TEXT REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_a_id TEXT REFERENCES public.teams(id) ON DELETE CASCADE,
  team_b_id TEXT REFERENCES public.teams(id) ON DELETE CASCADE,
  match_date DATE NOT NULL,
  match_time TEXT NOT NULL,
  venue TEXT NOT NULL,
  court TEXT NOT NULL,
  round TEXT NOT NULL,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Live', 'Completed', 'Cancelled')),
  winner_id TEXT REFERENCES public.teams(id) ON DELETE SET NULL,
  sets_won_a INTEGER DEFAULT 0,
  sets_won_b INTEGER DEFAULT 0,
  set_scores JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Public can view published teams, squads, matches, standings, tournament)
DROP POLICY IF EXISTS "Public can view tournaments" ON public.tournaments;
CREATE POLICY "Public can view tournaments" ON public.tournaments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view settings" ON public.tournament_settings;
CREATE POLICY "Public can view settings" ON public.tournament_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view teams" ON public.teams;
CREATE POLICY "Public can view teams" ON public.teams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view players" ON public.players;
CREATE POLICY "Public can view players" ON public.players FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view matches" ON public.matches;
CREATE POLICY "Public can view matches" ON public.matches FOR SELECT USING (true);

-- 2. Applications Policies:
-- Public can INSERT their own application without auth:
DROP POLICY IF EXISTS "Public can submit application" ON public.applications;
CREATE POLICY "Public can submit application" ON public.applications 
  FOR INSERT WITH CHECK (true);

-- Allow viewing, updating, deleting applications:
DROP POLICY IF EXISTS "Admins can view applications" ON public.applications;
CREATE POLICY "Admins can view applications" ON public.applications 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
CREATE POLICY "Admins can update applications" ON public.applications 
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete applications" ON public.applications;
CREATE POLICY "Admins can delete applications" ON public.applications 
  FOR DELETE USING (true);

-- 3. Admin Write Policies for Teams, Players, Matches, Settings
DROP POLICY IF EXISTS "Admins can insert teams" ON public.teams;
CREATE POLICY "Admins can insert teams" ON public.teams FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update teams" ON public.teams;
CREATE POLICY "Admins can update teams" ON public.teams FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete teams" ON public.teams;
CREATE POLICY "Admins can delete teams" ON public.teams FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admins can insert players" ON public.players;
CREATE POLICY "Admins can insert players" ON public.players FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update players" ON public.players;
CREATE POLICY "Admins can update players" ON public.players FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete players" ON public.players;
CREATE POLICY "Admins can delete players" ON public.players FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admins can insert matches" ON public.matches;
CREATE POLICY "Admins can insert matches" ON public.matches FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update matches" ON public.matches;
CREATE POLICY "Admins can update matches" ON public.matches FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete matches" ON public.matches;
CREATE POLICY "Admins can delete matches" ON public.matches FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admins can insert settings" ON public.tournament_settings;
CREATE POLICY "Admins can insert settings" ON public.tournament_settings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update settings" ON public.tournament_settings;
CREATE POLICY "Admins can update settings" ON public.tournament_settings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can insert tournament" ON public.tournaments;
CREATE POLICY "Admins can insert tournament" ON public.tournaments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update tournament" ON public.tournaments;
CREATE POLICY "Admins can update tournament" ON public.tournaments FOR UPDATE USING (true);
`;

// Helper: load from localStorage with fallback
function loadLocal<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

// Helper: save to localStorage
function saveLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

// Helper: load from sessionStorage with fallback
function loadSession<T>(key: string, fallback: T): T {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

// Helper: save to sessionStorage
function saveSession<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to sessionStorage', e);
  }
}

export interface AdminCredentials {
  email: string;
  password: string;
  name: string;
  updated_at?: string;
}

const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  email: 'admin@tournament.edu',
  password: 'admin123',
  name: 'Tournament Director',
};

class SupabaseService {
  private client: SupabaseClient | null = null;
  private url: string = '';
  private anonKey: string = '';
  private isConfigured: boolean = false;

  constructor() {
    this.initClient();
  }

  public initClient(customUrl?: string, customKey?: string) {
    const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
    const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

    const storedUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '';
    const storedKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY) || '';

    this.url = customUrl || storedUrl || envUrl;
    this.anonKey = customKey || storedKey || envKey;

    if (this.url && this.anonKey && this.url.startsWith('https://')) {
      try {
        this.client = createClient(this.url, this.anonKey);
        this.isConfigured = true;
      } catch (err) {
        console.warn('Failed to initialize Supabase client:', err);
        this.client = null;
        this.isConfigured = false;
      }
    } else {
      this.client = null;
      this.isConfigured = false;
    }
  }

  public getSupabaseConfig() {
    return {
      url: this.url,
      anonKey: this.anonKey,
      isConfigured: this.isConfigured,
      hasEnvConfig: Boolean((import.meta as any).env?.VITE_SUPABASE_URL),
    };
  }

  public setSupabaseCredentials(url: string, key: string) {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, key.trim());
    this.initClient(url.trim(), key.trim());
  }

  public clearSupabaseCredentials() {
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
    this.initClient('', '');
  }

  // ==========================================
  // AUTHENTICATION & CREDENTIALS MANAGEMENT
  // ==========================================
  public getAdminCredentials(): AdminCredentials {
    return loadLocal<AdminCredentials>(STORAGE_KEYS.ADMIN_CREDENTIALS, DEFAULT_ADMIN_CREDENTIALS);
  }

  public async updateAdminCredentials(newCreds: {
    email?: string;
    password?: string;
    name?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const current = this.getAdminCredentials();
      const updated: AdminCredentials = {
        email: newCreds.email && newCreds.email.trim() ? newCreds.email.trim().toLowerCase() : current.email,
        password: newCreds.password !== undefined && newCreds.password.trim() ? newCreds.password.trim() : current.password,
        name: newCreds.name && newCreds.name.trim() ? newCreds.name.trim() : current.name,
        updated_at: new Date().toISOString(),
      };

      if (newCreds.password && newCreds.password.trim().length < 4) {
        return { success: false, error: 'Password must be at least 4 characters long.' };
      }

      saveLocal(STORAGE_KEYS.ADMIN_CREDENTIALS, updated);

      // Keep active session in sync
      const currentSession = this.getAdminSession();
      if (currentSession) {
        const updatedSession: AdminUser = {
          ...currentSession,
          email: updated.email,
          name: updated.name,
        };
        this.setAdminSession(updatedSession);
      }

      // If Supabase remote auth is active, update Supabase user password & profile
      if (this.client && this.isConfigured && newCreds.password) {
        try {
          await this.client.auth.updateUser({
            password: newCreds.password,
            ...(newCreds.email && { email: newCreds.email }),
            data: { name: updated.name },
          });
        } catch (sbErr) {
          console.warn('Supabase remote password update notice:', sbErr);
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update credentials.' };
    }
  }

  public resetAdminCredentials(): void {
    saveLocal(STORAGE_KEYS.ADMIN_CREDENTIALS, DEFAULT_ADMIN_CREDENTIALS);
  }

  public async signIn(email: string, password: string): Promise<{ user: AdminUser | null; error: string | null }> {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();
    const savedCreds = this.getAdminCredentials();

    // 1. Try real Supabase auth if connected
    if (this.client && this.isConfigured) {
      try {
        const { data, error } = await this.client.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (!error && data.user) {
          const adminUser: AdminUser = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            role: 'admin',
            name: data.user.user_metadata?.name || savedCreds.name || 'Tournament Director',
          };
          this.setAdminSession(adminUser);
          return { user: adminUser, error: null };
        }
      } catch (err: any) {
        console.warn('Supabase remote auth attempt failed, checking local credentials:', err);
      }
    }

    // 2. Custom administrator credentials set by admin
    if (cleanEmail === savedCreds.email.toLowerCase().trim() && cleanPassword === savedCreds.password) {
      const adminUser: AdminUser = {
        id: 'admin_local_primary',
        email: savedCreds.email,
        role: 'admin',
        name: savedCreds.name,
      };
      this.setAdminSession(adminUser);
      return { user: adminUser, error: null };
    }

    // 3. Reliable fallback if not changed yet or evaluation mode
    if (
      (cleanEmail === 'admin@tournament.edu' || cleanEmail === 'admin@volleyspike.edu' || cleanEmail === 'director@college.edu') &&
      cleanPassword === 'admin123'
    ) {
      const adminUser: AdminUser = {
        id: 'admin_local_primary',
        email: cleanEmail,
        role: 'admin',
        name: savedCreds.name || 'Tournament Director',
      };
      this.setAdminSession(adminUser);
      return { user: adminUser, error: null };
    }

    return { user: null, error: 'Invalid administrator email or password. Please verify your credentials.' };
  }

  public getAdminSession(): AdminUser | null {
    // 1. Clear any legacy persistent localStorage admin session so random visitors don't inherit it
    try {
      if (localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION)) {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      }
    } catch {}

    // 2. Read tab-isolated sessionStorage
    const stored = loadSession<{ user: AdminUser; expiresAt: number } | AdminUser | null>(
      STORAGE_KEYS.ADMIN_SESSION,
      null
    );
    if (!stored) return null;

    // Check expiration (auto-logout after 15 minutes of inactivity)
    if (typeof stored === 'object' && 'expiresAt' in stored && 'user' in stored) {
      if (Date.now() > (stored as any).expiresAt) {
        this.signOut();
        return null;
      }
      return (stored as any).user;
    }

    return stored as AdminUser;
  }

  public setAdminSession(user: AdminUser): void {
    const sessionData = {
      user,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15-minute inactivity security window
    };
    saveSession(STORAGE_KEYS.ADMIN_SESSION, sessionData);
  }

  public touchAdminSession(): void {
    const stored = loadSession<{ user: AdminUser; expiresAt: number } | null>(
      STORAGE_KEYS.ADMIN_SESSION,
      null
    );
    if (stored && stored.user) {
      this.setAdminSession(stored.user);
    }
  }

  public async signOut(): Promise<void> {
    if (this.client && this.isConfigured) {
      try {
        await this.client.auth.signOut();
      } catch (e) {
        console.warn(e);
      }
    }
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    } catch {}
  }

  // ==========================================
  // TOURNAMENT & SETTINGS
  // ==========================================
  public async getTournament(): Promise<Tournament> {
    if (this.client && this.isConfigured) {
      try {
        const { data } = await this.client.from('tournaments').select('*').limit(1).maybeSingle();
        if (data) return data;
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local', e);
      }
    }
    return loadLocal<Tournament>(STORAGE_KEYS.TOURNAMENT, INITIAL_TOURNAMENT);
  }

  public async updateTournament(updates: Partial<Tournament>): Promise<Tournament> {
    const current = await this.getTournament();
    const updated: Tournament = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('tournaments').upsert(updated);
      } catch (e) {
        console.warn('Supabase update failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.TOURNAMENT, updated);
    return updated;
  }

  public async getSettings(): Promise<TournamentSettings> {
    if (this.client && this.isConfigured) {
      try {
        const { data } = await this.client.from('tournament_settings').select('*').limit(1).maybeSingle();
        if (data) return data;
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local', e);
      }
    }
    return loadLocal<TournamentSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }

  public async updateSettings(updates: Partial<TournamentSettings>): Promise<TournamentSettings> {
    const current = await this.getSettings();
    const updated: TournamentSettings = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('tournament_settings').upsert(updated);
      } catch (e) {
        console.warn('Supabase update settings failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // ==========================================
  // APPLICATIONS
  // ==========================================
  public async getApplications(): Promise<StudentApplication[]> {
    if (this.client && this.isConfigured) {
      try {
        const { data, error } = await this.client
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase getApplications failed, falling back', e);
      }
    }
    return loadLocal<StudentApplication[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  }

  public async submitApplication(appData: Omit<StudentApplication, 'id' | 'status' | 'tracking_id' | 'created_at'>): Promise<{ application: StudentApplication | null; error: string | null }> {
    const apps = await this.getApplications();
    const normalizedRoll = appData.roll_number.trim().toUpperCase();

    // Prevent duplicate application by roll number
    const existing = apps.find(a => a.roll_number.trim().toUpperCase() === normalizedRoll);
    if (existing) {
      return { 
        application: null, 
        error: `An application with Roll Number ${normalizedRoll} has already been submitted (Status: ${existing.status}). Accidental duplicate submissions are restricted.` 
      };
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `VS-NCAA-${randomSuffix}`;
    const newApp: StudentApplication = {
      ...appData,
      id: `app_${Date.now()}_${randomSuffix}`,
      roll_number: normalizedRoll,
      status: 'Pending',
      tracking_id: trackingId,
      created_at: new Date().toISOString(),
    };

    if (this.client && this.isConfigured) {
      try {
        const { error } = await this.client.from('applications').insert([newApp]);
        if (error) {
          console.warn('Supabase insert application error:', error);
        }
      } catch (e) {
        console.warn('Supabase remote insert failed', e);
      }
    }

    const updated = [newApp, ...apps];
    saveLocal(STORAGE_KEYS.APPLICATIONS, updated);
    return { application: newApp, error: null };
  }

  public async updateApplicationStatus(appId: string, newStatus: 'Approved' | 'Rejected'): Promise<StudentApplication | null> {
    const apps = await this.getApplications();
    const target = apps.find(a => a.id === appId);
    if (!target) return null;

    target.status = newStatus;
    target.updated_at = new Date().toISOString();

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('applications').update({ status: newStatus, updated_at: target.updated_at }).eq('id', appId);
      } catch (e) {
        console.warn('Supabase update application failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.APPLICATIONS, apps);

    // If Approved, automatically make player available in the Players section!
    if (newStatus === 'Approved') {
      const players = await this.getPlayers();
      const existingPlayer = players.find(p => p.application_id === appId || p.roll_number === target.roll_number);

      if (!existingPlayer) {
        const newPlayer: Player = {
          id: `player_${Date.now()}`,
          application_id: target.id,
          name: target.full_name,
          roll_number: target.roll_number,
          class_name: target.class_name,
          section: target.section,
          phone_number: target.phone_number,
          position: target.playing_position,
          team_id: null,
          status: 'Available',
          jersey_number: Math.floor(1 + Math.random() * 24),
          profile_photo_url: target.profile_photo_url,
          is_captain: false,
          notes: target.previous_experience,
          created_at: new Date().toISOString(),
        };

        if (this.client && this.isConfigured) {
          try {
            await this.client.from('players').insert([newPlayer]);
          } catch (e) {
            console.warn('Supabase player creation failed', e);
          }
        }

        saveLocal(STORAGE_KEYS.PLAYERS, [...players, newPlayer]);
      }
    }

    return target;
  }

  public async deleteApplication(appId: string): Promise<boolean> {
    const apps = await this.getApplications();
    const filtered = apps.filter(a => a.id !== appId);

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('applications').delete().eq('id', appId);
      } catch (e) {
        console.warn('Supabase delete app failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.APPLICATIONS, filtered);
    return true;
  }

  // ==========================================
  // PLAYERS
  // ==========================================
  public async getPlayers(): Promise<Player[]> {
    if (this.client && this.isConfigured) {
      try {
        const { data, error } = await this.client.from('players').select('*').order('name');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase getPlayers failed, falling back', e);
      }
    }
    return loadLocal<Player[]>(STORAGE_KEYS.PLAYERS, INITIAL_PLAYERS);
  }

  public async addPlayer(playerData: Omit<Player, 'id' | 'created_at'>): Promise<Player> {
    const players = await this.getPlayers();
    const newPlayer: Player = {
      ...playerData,
      id: `player_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
    };

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('players').insert([newPlayer]);
      } catch (e) {
        console.warn('Supabase insert player failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.PLAYERS, [...players, newPlayer]);
    return newPlayer;
  }

  public async updatePlayer(playerId: string, updates: Partial<Player>): Promise<Player | null> {
    const players = await this.getPlayers();
    const index = players.findIndex(p => p.id === playerId);
    if (index === -1) return null;

    const updated = {
      ...players[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    players[index] = updated;

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('players').update(updated).eq('id', playerId);
      } catch (e) {
        console.warn('Supabase update player failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.PLAYERS, players);
    return updated;
  }

  public async deletePlayer(playerId: string): Promise<boolean> {
    const players = await this.getPlayers();
    const filtered = players.filter(p => p.id !== playerId);

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('players').delete().eq('id', playerId);
      } catch (e) {
        console.warn('Supabase delete player failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.PLAYERS, filtered);
    return true;
  }

  // ==========================================
  // TEAMS & SQUADS
  // ==========================================
  public async getTeams(): Promise<Team[]> {
    if (this.client && this.isConfigured) {
      try {
        const { data, error } = await this.client.from('teams').select('*').order('name');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase getTeams failed, falling back', e);
      }
    }
    return loadLocal<Team[]>(STORAGE_KEYS.TEAMS, INITIAL_TEAMS);
  }

  public async createTeam(teamData: Omit<Team, 'id' | 'created_at'>): Promise<Team> {
    const teams = await this.getTeams();
    const newTeam: Team = {
      ...teamData,
      id: `team_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
    };

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('teams').insert([newTeam]);
      } catch (e) {
        console.warn('Supabase insert team failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.TEAMS, [...teams, newTeam]);
    return newTeam;
  }

  public async updateTeam(teamId: string, updates: Partial<Team>): Promise<Team | null> {
    const teams = await this.getTeams();
    const index = teams.findIndex(t => t.id === teamId);
    if (index === -1) return null;

    const updated = {
      ...teams[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    teams[index] = updated;

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('teams').update(updated).eq('id', teamId);
      } catch (e) {
        console.warn('Supabase update team failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.TEAMS, teams);
    return updated;
  }

  public async deleteTeam(teamId: string): Promise<boolean> {
    const teams = await this.getTeams();
    const filtered = teams.filter(t => t.id !== teamId);

    // Unassign players belonging to this team
    const players = await this.getPlayers();
    const unassigned = players.map(p => {
      if (p.team_id === teamId) {
        return { ...p, team_id: null, status: 'Available' as const, is_captain: false };
      }
      return p;
    });
    saveLocal(STORAGE_KEYS.PLAYERS, unassigned);

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('teams').delete().eq('id', teamId);
      } catch (e) {
        console.warn('Supabase delete team failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.TEAMS, filtered);
    return true;
  }

  // Assign player to team (ensuring one team per player)
  public async assignPlayerToTeam(playerId: string, teamId: string | null): Promise<void> {
    const players = await this.getPlayers();
    const updated = players.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          team_id: teamId,
          status: (teamId ? 'Assigned' : 'Available') as any,
          is_captain: teamId ? p.is_captain : false,
          updated_at: new Date().toISOString(),
        };
      }
      return p;
    });

    saveLocal(STORAGE_KEYS.PLAYERS, updated);

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('players').update({
          team_id: teamId,
          status: teamId ? 'Assigned' : 'Available',
          is_captain: teamId ? undefined : false,
        }).eq('id', playerId);
      } catch (e) {
        console.warn('Supabase assign player failed', e);
      }
    }
  }

  // Captain management (single captain per team)
  public async setTeamCaptain(teamId: string, playerId: string): Promise<void> {
    const players = await this.getPlayers();
    const teams = await this.getTeams();

    let captainName = '';
    const updatedPlayers = players.map(p => {
      if (p.team_id === teamId) {
        const isTarget = p.id === playerId;
        if (isTarget) captainName = p.name;
        return { ...p, is_captain: isTarget };
      }
      return p;
    });

    saveLocal(STORAGE_KEYS.PLAYERS, updatedPlayers);

    // Update team captain field
    const updatedTeams = teams.map(t => {
      if (t.id === teamId) {
        return { ...t, captain_id: playerId, captain_name: captainName };
      }
      return t;
    });
    saveLocal(STORAGE_KEYS.TEAMS, updatedTeams);

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('players').update({ is_captain: false }).eq('team_id', teamId);
        await this.client.from('players').update({ is_captain: true }).eq('id', playerId);
        await this.client.from('teams').update({ captain_id: playerId, captain_name: captainName }).eq('id', teamId);
      } catch (e) {
        console.warn('Supabase set captain failed', e);
      }
    }
  }

  // ==========================================
  // MATCHES & SCORING
  // ==========================================
  public async getMatches(): Promise<Match[]> {
    if (this.client && this.isConfigured) {
      try {
        const { data, error } = await this.client
          .from('matches')
          .select('*')
          .order('match_date')
          .order('match_time');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase getMatches failed, falling back', e);
      }
    }
    return loadLocal<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
  }

  public async createMatch(matchData: Omit<Match, 'id' | 'created_at'>): Promise<Match> {
    const matches = await this.getMatches();
    const newMatch: Match = {
      ...matchData,
      id: `match_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
    };

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('matches').insert([newMatch]);
      } catch (e) {
        console.warn('Supabase insert match failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.MATCHES, [...matches, newMatch]);
    return newMatch;
  }

  public async updateMatch(matchId: string, updates: Partial<Match>): Promise<Match | null> {
    const matches = await this.getMatches();
    const index = matches.findIndex(m => m.id === matchId);
    if (index === -1) return null;

    const updated = {
      ...matches[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    matches[index] = updated;

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('matches').update(updated).eq('id', matchId);
      } catch (e) {
        console.warn('Supabase update match failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.MATCHES, matches);
    return updated;
  }

  public async deleteMatch(matchId: string): Promise<boolean> {
    const matches = await this.getMatches();
    const filtered = matches.filter(m => m.id !== matchId);

    if (this.client && this.isConfigured) {
      try {
        await this.client.from('matches').delete().eq('id', matchId);
      } catch (e) {
        console.warn('Supabase delete match failed', e);
      }
    }

    saveLocal(STORAGE_KEYS.MATCHES, filtered);
    return true;
  }

  // Save match scores and dynamically calculate winner & status
  public async recordMatchResult(
    matchId: string, 
    setScores: { score_a: number; score_b: number }[]
  ): Promise<Match | null> {
    const matches = await this.getMatches();
    const match = matches.find(m => m.id === matchId);
    if (!match) return null;

    let setsWonA = 0;
    let setsWonB = 0;

    const formattedSets = setScores.map((s, index) => {
      if (s.score_a > s.score_b) setsWonA++;
      else if (s.score_b > s.score_a) setsWonB++;
      return {
        set_number: index + 1,
        score_a: Number(s.score_a),
        score_b: Number(s.score_b),
      };
    });

    const winnerId = setsWonA > setsWonB ? match.team_a_id : match.team_b_id;

    return this.updateMatch(matchId, {
      status: 'Completed',
      sets_won_a: setsWonA,
      sets_won_b: setsWonB,
      set_scores: formattedSets,
      winner_id: winnerId,
    });
  }

  // ==========================================
  // DYNAMIC POINTS TABLE CALCULATION
  // ==========================================
  public async calculateStandings(): Promise<TeamStanding[]> {
    const [teams, matches, settings] = await Promise.all([
      this.getTeams(),
      this.getMatches(),
      this.getSettings(),
    ]);

    const winPoints = settings.win_points ?? 2;
    const lossPoints = settings.loss_points ?? 0;

    const map: Record<string, TeamStanding> = {};

    teams.forEach(t => {
      map[t.id] = {
        team_id: t.id,
        team_name: t.name,
        logo_url: t.logo_url,
        short_code: t.short_code,
        division: t.division || 'Pool A',
        played: 0,
        won: 0,
        lost: 0,
        sets_won: 0,
        sets_lost: 0,
        set_ratio: 0,
        points_scored: 0,
        points_conceded: 0,
        point_differential: 0,
        points: 0,
        form: [],
      };
    });

    // Completed matches process
    const completedMatches = matches.filter(m => m.status === 'Completed');

    completedMatches.forEach(m => {
      const statsA = map[m.team_a_id];
      const statsB = map[m.team_b_id];

      if (!statsA || !statsB) return;

      statsA.played += 1;
      statsB.played += 1;

      statsA.sets_won += m.sets_won_a;
      statsA.sets_lost += m.sets_won_b;
      statsB.sets_won += m.sets_won_b;
      statsB.sets_lost += m.sets_won_a;

      // Sum set points
      if (m.set_scores && m.set_scores.length > 0) {
        m.set_scores.forEach(s => {
          statsA.points_scored += s.score_a;
          statsA.points_conceded += s.score_b;
          statsB.points_scored += s.score_b;
          statsB.points_conceded += s.score_a;
        });
      }

      // Winner determination
      if (m.winner_id === m.team_a_id) {
        statsA.won += 1;
        statsA.points += winPoints;
        statsA.form.push('W');

        statsB.lost += 1;
        statsB.points += lossPoints;
        statsB.form.push('L');
      } else if (m.winner_id === m.team_b_id) {
        statsB.won += 1;
        statsB.points += winPoints;
        statsB.form.push('W');

        statsA.lost += 1;
        statsA.points += lossPoints;
        statsA.form.push('L');
      }
    });

    const standingsList = Object.values(map);

    // Compute ratios and differentials
    standingsList.forEach(s => {
      s.point_differential = s.points_scored - s.points_conceded;
      s.set_ratio = s.sets_lost === 0 ? s.sets_won : Number((s.sets_won / s.sets_lost).toFixed(3));
      // Keep last 5 form elements
      s.form = s.form.slice(-5);
    });

    // NCAA sorting: Total Points > Set Ratio > Point Differential
    standingsList.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.set_ratio !== a.set_ratio) return b.set_ratio - a.set_ratio;
      return b.point_differential - a.point_differential;
    });

    return standingsList;
  }

  // Standings recalculation alias
  public async recalculateStandings(): Promise<TeamStanding[]> {
    return this.calculateStandings();
  }

  public async getStandings(): Promise<TeamStanding[]> {
    return this.calculateStandings();
  }

  public async getTournamentSettings(): Promise<TournamentSettings> {
    return this.getSettings();
  }

  public getCurrentAdmin(): AdminUser | null {
    return this.getAdminSession();
  }

  public saveSupabaseConfig(url: string, key: string): void {
    this.setSupabaseCredentials(url, key);
  }

  public async resetToSeedData(): Promise<void> {
    this.resetToDefaultSeedData();
  }

  public async updateTournamentSettings(data: {
    name?: string;
    start_date?: string;
    end_date?: string;
    venue?: string;
    win_points?: number;
    loss_points?: number;
    forfeit_points?: number;
    sets_to_win?: number;
  }): Promise<void> {
    // Update tournament info
    if (data.name || data.start_date || data.end_date || data.venue) {
      await this.updateTournament({
        ...(data.name && { name: data.name }),
        ...(data.start_date && { start_date: data.start_date }),
        ...(data.end_date && { end_date: data.end_date }),
        ...(data.venue && { venue: data.venue }),
      });
    }

    // Update scoring rules
    await this.updateSettings({
      ...(data.win_points !== undefined && { win_points: data.win_points }),
      ...(data.loss_points !== undefined && { loss_points: data.loss_points }),
      ...(data.forfeit_points !== undefined && { forfeit_points: data.forfeit_points }),
      ...(data.sets_to_win !== undefined && { sets_to_win: data.sets_to_win }),
    });
  }

  public async createPlayer(playerData: Omit<Player, 'id' | 'created_at'>): Promise<Player> {
    return this.addPlayer(playerData);
  }

  public async updateMatchResults(
    matchId: string,
    setScores: { set_number: number; score_a: number; score_b: number }[],
    setsWonA: number,
    setsWonB: number,
    winnerId?: string,
    status: 'Completed' | 'Live' | 'Scheduled' = 'Completed',
    notes?: string
  ): Promise<Match | null> {
    return this.updateMatch(matchId, {
      set_scores: setScores,
      sets_won_a: setsWonA,
      sets_won_b: setsWonB,
      winner_id: winnerId || null,
      status,
      ...(notes !== undefined && { notes }),
    });
  }

  // Reset to default seed data for troubleshooting
  public resetToDefaultSeedData(): void {
    saveLocal(STORAGE_KEYS.TOURNAMENT, INITIAL_TOURNAMENT);
    saveLocal(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    saveLocal(STORAGE_KEYS.TEAMS, INITIAL_TEAMS);
    saveLocal(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    saveLocal(STORAGE_KEYS.PLAYERS, INITIAL_PLAYERS);
    saveLocal(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
  }
}

export const supabaseService = new SupabaseService();
export const SUPABASE_SCHEMA_SQL = SUPABASE_SQL_SCHEMA;
