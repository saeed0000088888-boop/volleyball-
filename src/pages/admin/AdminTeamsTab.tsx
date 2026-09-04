import React, { useState } from 'react';
import { 
  Trophy, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  X, 
  CheckCircle2, 
  Sparkles,
  Shield
} from 'lucide-react';
import { Team, Player } from '../../types';
import { supabaseService } from '../../lib/supabase';

interface AdminTeamsTabProps {
  teams: Team[];
  players: Player[];
  onDataChanged: () => void;
}

const PRESET_LOGOS = [
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=160',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=160',
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=160',
  'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=160',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=160',
];

export const AdminTeamsTab: React.FC<AdminTeamsTabProps> = ({
  teams,
  players,
  onDataChanged,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [logoUrl, setLogoUrl] = useState(PRESET_LOGOS[0]);
  const [seed, setSeed] = useState<number>(teams.length + 1);
  const [division, setDivision] = useState('Pool A');
  const [conference, setConference] = useState('Collegiate Conference');
  const [managerName, setManagerName] = useState('');

  const openCreateModal = () => {
    setEditingTeam(null);
    setName('');
    setShortCode('');
    setLogoUrl(PRESET_LOGOS[0]);
    setSeed(teams.length + 1);
    setDivision('Pool A');
    setConference('Collegiate Conference');
    setManagerName('');
    setIsModalOpen(true);
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setName(team.name);
    setShortCode(team.short_code);
    setLogoUrl(team.logo_url);
    setSeed(team.seed || 1);
    setDivision(team.division || 'Pool A');
    setConference(team.conference || 'Collegiate Conference');
    setManagerName(team.manager_name || '');
    setIsModalOpen(true);
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !shortCode.trim()) {
      alert('Please fill in team name and short code.');
      return;
    }

    try {
      if (editingTeam) {
        await supabaseService.updateTeam(editingTeam.id, {
          name,
          short_code: shortCode.toUpperCase(),
          logo_url: logoUrl,
          seed: Number(seed),
          division,
          conference,
          manager_name: managerName,
        });
      } else {
        await supabaseService.createTeam({
          name,
          short_code: shortCode.toUpperCase(),
          logo_url: logoUrl,
          seed: Number(seed),
          division,
          conference,
          manager_name: managerName,
        });
      }

      onDataChanged();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team? Any players assigned will become free agents.')) {
      try {
        await supabaseService.deleteTeam(teamId);
        onDataChanged();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Create Button */}
      <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h3 className="font-heading text-lg font-bold uppercase text-white">
            Tournament Teams ({teams.length})
          </h3>
          <p className="text-xs text-slate-400">
            Create participating college teams, assign seed rankings, and designate head coaches.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          id="create-new-team-btn"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create Team</span>
        </button>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl p-12 text-center border border-slate-800 shadow-xl space-y-3">
          <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="font-heading text-base font-bold uppercase text-white">
            No Teams Created Yet
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "Create Team" to add your first college volleyball team to the tournament.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase shadow-lg shadow-indigo-500/20"
          >
            Create First Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const squad = players.filter(p => p.team_id === team.id);
            const captain = squad.find(p => p.is_captain || p.id === team.captain_id);

            return (
              <div
                key={team.id}
                className="bg-[#1E293B] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 hover:border-indigo-500/50 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={team.logo_url} 
                      alt="" 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm shrink-0"
                    />
                    <div>
                      <h4 className="font-heading text-lg font-bold uppercase text-white leading-tight">
                        {team.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-semibold uppercase">
                        {team.short_code} • {team.division || 'Pool A'}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold font-mono">
                    #{team.seed || 1} Seed
                  </span>
                </div>

                <div className="bg-slate-900/80 rounded-xl p-3 text-xs space-y-1.5 border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coach / Staff:</span>
                    <span className="font-semibold text-slate-200">{team.manager_name || 'Athletics Office'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Team Captain:</span>
                    <span className="font-bold text-indigo-400">
                      {captain?.name || team.captain_name || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Squad Count:</span>
                    <span className="font-bold text-white font-mono">
                      {squad.length} Players
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(team)}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="px-3 py-1.5 rounded-lg border border-rose-900/50 hover:bg-rose-950/40 text-rose-400 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                {editingTeam ? 'Edit Team' : 'Create New Team'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Texas Longhorns"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Short Code (3-4 Letters) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="e.g. TEX"
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs font-mono font-bold uppercase text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Seed #
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={seed}
                    onChange={(e) => setSeed(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs font-mono font-bold text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Division / Pool
                  </label>
                  <input
                    type="text"
                    placeholder="Pool A"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Conference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Big 12"
                    value={conference}
                    onChange={(e) => setConference(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Head Coach / Manager Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coach Jerritt Elliott"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Team Logo URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs font-mono text-white"
                />

                {/* Preset Logo Selector */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Presets:</span>
                  {PRESET_LOGOS.map((url, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setLogoUrl(url)}
                      className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition ${
                        logoUrl === url ? 'border-indigo-500 scale-110' : 'border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 font-bold hover:bg-slate-800 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider transition shadow-lg shadow-indigo-500/20"
                >
                  {editingTeam ? 'Update Team' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
