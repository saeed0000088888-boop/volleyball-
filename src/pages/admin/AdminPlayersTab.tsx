import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Edit3, 
  Trash2, 
  Award, 
  CheckCircle2, 
  Shield, 
  X,
  Plus,
  UserPlus
} from 'lucide-react';
import { Player, Team, PlayingPosition, PlayerStatus } from '../../types';
import { supabaseService } from '../../lib/supabase';
import { ConfirmModal } from '../../components/ConfirmModal';

interface AdminPlayersTabProps {
  players: Player[];
  teams: Team[];
  onDataChanged: () => void;
}

const POSITIONS: PlayingPosition[] = [
  'Setter',
  'Outside Hitter',
  'Opposite',
  'Middle Blocker',
  'Libero',
  'Defensive Specialist',
  'All Rounder',
];

const PRESET_PLAYER_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160',
];

export const AdminPlayersTab: React.FC<AdminPlayersTabProps> = ({
  players,
  teams,
  onDataChanged,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('All');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addRollNumber, setAddRollNumber] = useState('');
  const [addClassName, setAddClassName] = useState('2nd Year');
  const [addSection, setAddSection] = useState('Sec A');
  const [addPhone, setAddPhone] = useState('');
  const [addPosition, setAddPosition] = useState<PlayingPosition>('Outside Hitter');
  const [addJersey, setAddJersey] = useState<number>(10);
  const [addHeight, setAddHeight] = useState<string>("6'1\"");
  const [addTeamId, setAddTeamId] = useState<string>('');
  const [addPhotoUrl, setAddPhotoUrl] = useState<string>(PRESET_PLAYER_AVATARS[0]);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit modal fields
  const [formPosition, setFormPosition] = useState<PlayingPosition>('Outside Hitter');
  const [formJersey, setFormJersey] = useState<number>(1);
  const [formHeight, setFormHeight] = useState<string>("6'2\"");
  const [formTeamId, setFormTeamId] = useState<string>('');
  const [formStatus, setFormStatus] = useState<PlayerStatus>('Available');

  const filtered = players.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(term) ||
                          p.roll_number.toLowerCase().includes(term) ||
                          p.position.toLowerCase().includes(term);
    const matchesTeam = teamFilter === 'All' || 
                        (teamFilter === 'Unassigned' && !p.team_id) || 
                        p.team_id === teamFilter;
    return matchesSearch && matchesTeam;
  });

  const openAddModal = () => {
    setAddName('');
    setAddRollNumber(`VB-${Math.floor(1000 + Math.random() * 9000)}`);
    setAddClassName('2nd Year');
    setAddSection('Sec A');
    setAddPhone('555-0199');
    setAddPosition('Outside Hitter');
    setAddJersey(Math.floor(1 + Math.random() * 25));
    setAddHeight("6'2\"");
    setAddTeamId(teams[0]?.id || '');
    setAddPhotoUrl(PRESET_PLAYER_AVATARS[Math.floor(Math.random() * PRESET_PLAYER_AVATARS.length)]);
    setAddError(null);
    setIsAddModalOpen(true);
  };

  const handleCreatePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (!addName.trim()) {
      setAddError('Please enter the athlete name.');
      return;
    }
    if (!addRollNumber.trim()) {
      setAddError('Please enter the athlete roll number.');
      return;
    }

    try {
      await supabaseService.addPlayer({
        name: addName.trim(),
        roll_number: addRollNumber.trim().toUpperCase(),
        class_name: addClassName,
        section: addSection,
        phone_number: addPhone.trim(),
        position: addPosition,
        jersey_number: Number(addJersey) || 1,
        height: addHeight,
        team_id: addTeamId || null,
        status: addTeamId ? 'Assigned' : 'Available',
        profile_photo_url: addPhotoUrl,
        is_captain: false,
      });

      onDataChanged();
      setIsAddModalOpen(false);
    } catch (err: any) {
      setAddError(err?.message || 'Failed to add athlete.');
    }
  };

  const handleOpenEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormPosition(player.position);
    setFormJersey(player.jersey_number || 1);
    setFormHeight(player.height || "6'2\"");
    setFormTeamId(player.team_id || '');
    setFormStatus(player.status);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;

    try {
      await supabaseService.updatePlayer(editingPlayer.id, {
        position: formPosition,
        jersey_number: Number(formJersey),
        height: formHeight,
        team_id: formTeamId || null,
        status: formTeamId ? 'Assigned' : formStatus,
      });

      onDataChanged();
      setEditingPlayer(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const pid = deleteTargetId;
    setDeleteTargetId(null);
    try {
      await supabaseService.deletePlayer(pid);
      onDataChanged();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search player by name, roll no, position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Team:</span>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-700 text-xs font-bold text-white bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            >
              <option value="All">All Teams ({players.length})</option>
              <option value="Unassigned">Free / Unassigned ({players.filter(p => !p.team_id).length})</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Athlete</span>
          </button>
        </div>
      </div>

      {/* Players Table */}
      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="font-heading text-base font-bold uppercase text-white">
              No Players Found
            </h4>
            <p className="text-xs text-slate-500">
              Approved student applications will automatically generate active players here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-3 text-center w-12">#</th>
                  <th className="py-3 px-4 text-left">Player Athlete</th>
                  <th className="py-3 px-3 text-left">Roll Number</th>
                  <th className="py-3 px-3 text-left">Position</th>
                  <th className="py-3 px-3 text-left">Height</th>
                  <th className="py-3 px-3 text-left">Assigned Team</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((player) => {
                  const assignedTeam = teams.find(t => t.id === player.team_id);
                  return (
                    <tr key={player.id} className="hover:bg-slate-900/50 transition">
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">
                        {player.jersey_number || '--'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={player.profile_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                            alt="" 
                            className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1">
                              <span>{player.name}</span>
                              {player.is_captain && (
                                <span className="bg-indigo-950/60 text-indigo-400 border border-indigo-800 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                                  C
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {player.class_name} • {player.section}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-300">
                        {player.roll_number}
                      </td>
                      <td className="py-3 px-3 font-semibold text-indigo-400">
                        {player.position}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {player.height || "6'2\""}
                      </td>
                      <td className="py-3 px-3 font-semibold">
                        {assignedTeam ? (
                          <div className="flex items-center gap-2 text-white">
                            <img src={assignedTeam.logo_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                            <span>{assignedTeam.name}</span>
                          </div>
                        ) : (
                          <span className="text-indigo-400 font-bold bg-indigo-950/50 border border-indigo-900/50 px-2 py-0.5 rounded text-[10px] uppercase">
                            Unassigned Free Agent
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          player.status === 'Assigned' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' :
                          player.status === 'Available' ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-800' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {player.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(player)}
                            title="Edit Player Details & Team Assignment"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(player.id)}
                            title="Delete Player"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT PLAYER MODAL */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                Edit Player Details
              </h3>
              <button
                onClick={() => setEditingPlayer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <img 
                  src={editingPlayer.profile_photo_url || ''} 
                  alt="" 
                  className="w-12 h-12 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <strong className="block text-sm text-white font-heading uppercase">{editingPlayer.name}</strong>
                  <span className="text-slate-400 font-mono">Roll: {editingPlayer.roll_number}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Playing Position
                </label>
                <select
                  value={formPosition}
                  onChange={(e) => setFormPosition(e.target.value as PlayingPosition)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition bg-slate-900/80 text-white"
                >
                  {POSITIONS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Jersey Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={formJersey}
                    onChange={(e) => setFormJersey(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6'3&quot;"
                    value={formHeight}
                    onChange={(e) => setFormHeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Assigned Team Squad
                </label>
                <select
                  value={formTeamId}
                  onChange={(e) => setFormTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition bg-slate-900/80 text-white"
                >
                  <option value="">-- No Team (Unassigned Free Agent) --</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.division || 'Pool A'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Roster Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as PlayerStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs bg-slate-900/80 text-white"
                >
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Inactive">Inactive / Suspended</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlayer(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 font-bold hover:bg-slate-800 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider transition shadow-lg shadow-indigo-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Remove Athlete from Roster"
        message="Are you sure you want to remove this athlete? If they are assigned to a varsity team, their team affiliation will be cleared."
        confirmText="Remove Athlete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* ADD ATHLETE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold uppercase text-white">
                  Add New Student Athlete
                </h3>
                <p className="text-xs text-slate-400">Directly register an athlete into the tournament roster pool</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-semibold">
                {addError}
              </div>
            )}

            <form onSubmit={handleCreatePlayer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Athlete Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zain Malik"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Student Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VB-1092"
                    value={addRollNumber}
                    onChange={(e) => setAddRollNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Class / Year
                  </label>
                  <select
                    value={addClassName}
                    onChange={(e) => setAddClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-xs"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Post-Grad">Post-Grad</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sec A"
                    value={addSection}
                    onChange={(e) => setAddSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 555-0123"
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Position *
                  </label>
                  <select
                    value={addPosition}
                    onChange={(e) => setAddPosition(e.target.value as PlayingPosition)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-xs"
                  >
                    {POSITIONS.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Jersey #
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={addJersey}
                    onChange={(e) => setAddJersey(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6'2&quot;"
                    value={addHeight}
                    onChange={(e) => setAddHeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Assign to Varsity Team
                </label>
                <select
                  value={addTeamId}
                  onChange={(e) => setAddTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 text-xs bg-slate-900/80 text-white"
                >
                  <option value="">-- Leave Unassigned (Free Agent Pool) --</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.division || 'Pool A'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Athlete Avatar / Photo URL
                </label>
                <div className="flex items-center gap-2 mb-2">
                  {PRESET_PLAYER_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAddPhotoUrl(url)}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition ${
                        addPhotoUrl === url ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/20' : 'border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Or enter custom image URL"
                  value={addPhotoUrl}
                  onChange={(e) => setAddPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 font-bold hover:bg-slate-800 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider transition shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Athlete</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
