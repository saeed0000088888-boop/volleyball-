import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Copy, 
  CheckCircle2, 
  RotateCcw, 
  Save, 
  Key, 
  Globe, 
  Scale, 
  FileCode2,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Shield,
  User,
  AlertCircle
} from 'lucide-react';
import { Tournament, TournamentSettings } from '../../types';
import { supabaseService, SUPABASE_SCHEMA_SQL } from '../../lib/supabase';

interface AdminSettingsTabProps {
  tournament: Tournament;
  settings: TournamentSettings;
  onDataChanged: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  tournament,
  settings,
  onDataChanged,
}) => {
  // Tournament form
  const [name, setName] = useState(tournament.name);
  const [startDate, setStartDate] = useState(tournament.start_date);
  const [endDate, setEndDate] = useState(tournament.end_date);
  const [venue, setVenue] = useState(tournament.venue || 'Austin Fieldhouse');

  // Rules form
  const [winPoints, setWinPoints] = useState(settings.win_points);
  const [lossPoints, setLossPoints] = useState(settings.loss_points);
  const [forfeitPoints, setForfeitPoints] = useState(settings.forfeit_points);
  const [setsToWin, setSetsToWin] = useState(settings.sets_to_win);

  // Admin Security / Password State
  const initialCreds = supabaseService.getAdminCredentials();
  const [adminName, setAdminName] = useState(initialCreds.name);
  const [adminEmail, setAdminEmail] = useState(initialCreds.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Supabase credentials form
  const existingConfig = supabaseService.getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(existingConfig.url || '');
  const [supabaseKey, setSupabaseKey] = useState(existingConfig.anonKey || '');

  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);

    try {
      await supabaseService.updateTournamentSettings({
        name,
        start_date: startDate,
        end_date: endDate,
        venue,
        win_points: Number(winPoints),
        loss_points: Number(lossPoints),
        forfeit_points: Number(forfeitPoints),
        sets_to_win: Number(setsToWin),
      });

      // Also update Supabase credentials in local storage config if provided
      if (supabaseUrl && supabaseKey) {
        supabaseService.saveSupabaseConfig(supabaseUrl.trim(), supabaseKey.trim());
      }

      onDataChanged();
      setSavingSettings(false);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3500);
    } catch (err) {
      console.error(err);
      setSavingSettings(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleResetSeedData = async () => {
    if (window.confirm('Reset all tournament teams, players, applications, and matches to initial collegiate seed data? This will overwrite local changes.')) {
      try {
        await supabaseService.resetToSeedData();
        onDataChanged();
        alert('Tournament data successfully reset to official varsity seed state!');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!adminEmail.trim()) {
      setPasswordError('Administrator email cannot be blank.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 4) {
        setPasswordError('New password must be at least 4 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError('New password and confirmation password do not match.');
        return;
      }
    }

    setSavingPassword(true);
    try {
      const res = await supabaseService.updateAdminCredentials({
        name: adminName,
        email: adminEmail,
        ...(newPassword ? { password: newPassword } : {}),
      });

      if (!res.success) {
        setPasswordError(res.error || 'Failed to update credentials.');
      } else {
        setPasswordSuccess(
          newPassword
            ? `Admin password successfully updated to "${newPassword}"! This new password is now active.`
            : 'Admin email and profile updated successfully!'
        );
        setNewPassword('');
        setConfirmPassword('');
        onDataChanged();
        setTimeout(() => setPasswordSuccess(null), 5000);
      }
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleResetDefaultCredentials = () => {
    if (window.confirm('Reset administrator login back to default credentials (admin@tournament.edu / admin123)?')) {
      supabaseService.resetAdminCredentials();
      const def = supabaseService.getAdminCredentials();
      setAdminEmail(def.email);
      setAdminName(def.name);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('Administrator credentials restored to default (admin123).');
      onDataChanged();
      setTimeout(() => setPasswordSuccess(null), 3500);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="font-heading text-lg font-bold uppercase text-white">
          Tournament Settings & Supabase Setup
        </h3>
        <p className="text-xs text-slate-400">
          Configure tournament dates, facility locations, points allocation formulas, and Supabase database connection.
        </p>
      </div>

      {settingsSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Tournament configurations successfully updated!</span>
        </div>
      )}

      {/* General & Scoring Settings Form */}
      <form onSubmit={handleSaveGeneral} className="bg-[#1E293B] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h4 className="font-heading text-base font-bold uppercase text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Tournament Parameters</span>
          </h4>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
              Tournament Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-sm font-bold focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Facility Venue
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white"
              />
            </div>
          </div>

          {/* Scoring Rules */}
          <div className="pt-4 border-t border-slate-800">
            <h5 className="font-heading text-xs font-bold uppercase text-slate-200 mb-3 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              <span>Standings Points Allocation Formula</span>
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">
                  Points for Win
                </label>
                <input
                  type="number"
                  value={winPoints}
                  onChange={(e) => setWinPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-400 mb-1">
                  Points for Loss
                </label>
                <input
                  type="number"
                  value={lossPoints}
                  onChange={(e) => setLossPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-400 mb-1">
                  Points for Forfeit
                </label>
                <input
                  type="number"
                  value={forfeitPoints}
                  onChange={(e) => setForfeitPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-400 mb-1">
                  Sets to Win Match
                </label>
                <select
                  value={setsToWin}
                  onChange={(e) => setSetsToWin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono font-bold"
                >
                  <option value={2}>2 (Best of 3)</option>
                  <option value={3}>3 (Best of 5)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={savingSettings}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Admin Security & Password Management Card */}
      <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading text-base font-bold uppercase text-white">
                Admin Security & Change Password
              </h4>
              <span className="text-xs text-slate-400">
                Manually set a new administrator password or update your login credentials.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            Active: {adminEmail}
          </span>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Director Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Tournament Director"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-semibold focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Admin Login Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@tournament.edu"
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-300 uppercase tracking-wider">
                  Manually Add / Set New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Type new password here..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono text-sm focus:border-indigo-500"
                />
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                Minimum 4 characters. Leave blank if you only want to update name/email.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password to confirm..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono text-sm focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{savingPassword ? 'Saving New Credentials...' : 'Save Administrator Password'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaultCredentials}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Default Password (admin123)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Supabase Connection Setup Card */}
      <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-heading text-base font-bold uppercase text-white">
                Supabase Backend Database Connection
              </h4>
              <span className="text-xs text-slate-400">
                Connect your hosted cloud Supabase database or use local high-performance storage.
              </span>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            existingConfig.isConfigured 
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400' 
              : 'bg-amber-950/80 border border-amber-800 text-amber-400'
          }`}>
            {existingConfig.isConfigured ? 'Supabase Connected' : 'Local Storage Mode'}
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
              Supabase Project URL
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono text-xs focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
              Supabase Anon / Public Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono text-xs focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveGeneral}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Supabase Credentials</span>
            </button>

            <button
              type="button"
              onClick={handleCopySql}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2"
            >
              <Copy className="w-4 h-4 text-indigo-400" />
              <span>{copiedSql ? 'SQL Schema Copied to Clipboard!' : 'Copy 1-Click Supabase SQL Schema'}</span>
            </button>
          </div>

          {/* Quick SQL Helper Box */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 text-xs text-slate-400 space-y-2">
            <strong className="text-slate-200 block font-heading uppercase text-xs">
              How to setup Supabase in 60 seconds:
            </strong>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Open your project in <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline font-bold">Supabase.com</a>.</li>
              <li>Click on the <strong>SQL Editor</strong> tab on the left.</li>
              <li>Click the <strong>"Copy 1-Click Supabase SQL Schema"</strong> button above.</li>
              <li>Paste the script into the SQL Editor and click <strong>Run</strong>.</li>
              <li>Copy your Project URL and Anon key from <strong>Project Settings → API</strong> into the fields above.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Danger Zone / Reset Database */}
      <div className="bg-rose-950/20 rounded-2xl p-6 border border-rose-900/50 space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <h4 className="font-heading text-sm font-bold uppercase">
            Data Maintenance & Reset
          </h4>
        </div>
        <p className="text-xs text-rose-300">
          If you wish to restore the sample college varsity teams, student applications, and test match fixtures, click below.
        </p>
        <button
          type="button"
          onClick={handleResetSeedData}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-rose-900/30"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Default Collegiate Seed Data</span>
        </button>
      </div>
    </div>
  );
};
