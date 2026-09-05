import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldAlert, 
  UserPlus, 
  Star,
  Shirt
} from 'lucide-react';
import { Team, Player } from '../../types';
import { supabaseService } from '../../lib/supabase';
import { ConfirmModal } from '../../components/ConfirmModal';

interface AdminSquadsTabProps {
  teams: Team[];
  players: Player[];
  onDataChanged: () => void;
}

export const AdminSquadsTab: React.FC<AdminSquadsTabProps> = ({
  teams,
  players,
  onDataChanged,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  const [selectedAddPlayerId, setSelectedAddPlayerId] = useState<string>('');
  const [assignJersey, setAssignJersey] = useState<number>(10);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const currentTeam = teams.find(t => t.id === selectedTeamId) || teams[0];
  const squad = currentTeam ? players.filter(p => p.team_id === currentTeam.id) : [];
  const availablePlayers = players.filter(p => !p.team_id && p.status === 'Available');

  const handleAddPlayer = async () => {
    if (!currentTeam || !selectedAddPlayerId) return;

    try {
      await supabaseService.updatePlayer(selectedAddPlayerId, {
        team_id: currentTeam.id,
        status: 'Assigned',
        jersey_number: Number(assignJersey),
      });

      onDataChanged();
      setSelectedAddPlayerId('');
      setAssignJersey(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmRemove = async () => {
    if (!deleteTargetId) return;
    const playerId = deleteTargetId;
    setDeleteTargetId(null);
    try {
      await supabaseService.updatePlayer(playerId, {
        team_id: null,
        status: 'Available',
        is_captain: false,
      });

      // If this player was captain, clear captain_id on team
      if (currentTeam?.captain_id === playerId) {
        await supabaseService.updateTeam(currentTeam.id, {
          captain_id: undefined,
          captain_name: undefined,
        });
      }

      onDataChanged();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDesignateCaptain = async (player: Player) => {
    if (!currentTeam) return;

    try {
      // First, remove is_captain from all players on this team
      for (const p of squad) {
        if (p.is_captain) {
          await supabaseService.updatePlayer(p.id, { is_captain: false });
        }
      }

      // Mark selected player as captain
      await supabaseService.updatePlayer(player.id, { is_captain: true });

      // Update team record
      await supabaseService.updateTeam(currentTeam.id, {
        captain_id: player.id,
        captain_name: player.name,
      });

      onDataChanged();
    } catch (err) {
      console.error(err);
    }
  };

  if (teams.length === 0) {
    return (
      <div className="bg-[#1E293B] rounded-2xl p-12 text-center border border-slate-800 shadow-xl space-y-3">
        <Users className="w-10 h-10 text-slate-600 mx-auto" />
        <h4 className="font-heading text-base font-bold uppercase text-white">
          No Teams Created
        </h4>
        <p className="text-xs text-slate-400">
          Please create teams in the "Teams" tab before building squads.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Team Selection Ribbon */}
      <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Select Team:
          </label>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-bold text-white bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {teams.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.short_code}) • #{t.seed || 1} Seed
              </option>
            ))}
          </select>
        </div>

        {currentTeam && (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">Coach: <strong className="text-white">{currentTeam.manager_name || 'Athletics'}</strong></span>
            <span className="text-slate-600">•</span>
            <span className="text-indigo-400 font-bold">
              Captain: {squad.find(p => p.is_captain)?.name || currentTeam.captain_name || 'None designated'}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Current Squad Roster */}
        <div className="lg:col-span-8 bg-[#1E293B] rounded-2xl border border-slate-800 shadow-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              {currentTeam && (
                <img src={currentTeam.logo_url} alt="" className="w-8 h-8 rounded-xl object-cover border border-slate-700" />
              )}
              <div>
                <h3 className="font-heading text-lg font-bold uppercase text-white">
                  {currentTeam?.name} Active Roster ({squad.length})
                </h3>
                <span className="text-xs text-slate-400 font-semibold">
                  Standard roster size: 6 - 14 athletes
                </span>
              </div>
            </div>
          </div>

          {squad.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-300">No athletes assigned to this team squad yet.</p>
              <p className="text-[11px] text-slate-500">
                Use the panel on the right to assign approved players to this team.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-2.5 px-3 text-center">Jersey</th>
                    <th className="py-2.5 px-3 text-left">Player Athlete</th>
                    <th className="py-2.5 px-3 text-left">Position</th>
                    <th className="py-2.5 px-3 text-left">Height</th>
                    <th className="py-2.5 px-3 text-center">Captain</th>
                    <th className="py-2.5 px-3 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {squad.map((player) => (
                    <tr key={player.id} className="hover:bg-slate-900/50 transition">
                      <td className="py-3 px-3 text-center font-mono font-bold text-white text-sm">
                        #{player.jersey_number || '--'}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={player.profile_photo_url || ''} 
                            alt="" 
                            className="w-7 h-7 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <strong className="block text-white font-semibold">{player.name}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">Roll: {player.roll_number}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-indigo-400">
                        {player.position}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {player.height || "6'2\""}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {player.is_captain ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-black uppercase shadow-xs">
                            <Star className="w-3 h-3 fill-white" /> Captain
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDesignateCaptain(player)}
                            className="text-[10px] text-slate-400 hover:text-indigo-400 font-bold uppercase underline transition"
                          >
                            Make Captain
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setDeleteTargetId(player.id)}
                          title="Unassign from team"
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Add Players Pool */}
        <div className="lg:col-span-4 bg-[#1E293B] rounded-2xl border border-slate-800 shadow-xl p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="font-heading text-base font-bold uppercase text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-400" />
              <span>Assign Free Athlete</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {availablePlayers.length} unassigned approved players in pool
            </p>
          </div>

          {availablePlayers.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs space-y-1">
              <p className="text-slate-300">No free players available.</p>
              <p className="text-[10px] text-slate-500">Approve pending applications in the Applications tab to add more athletes.</p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Select Athlete
                </label>
                <select
                  value={selectedAddPlayerId}
                  onChange={(e) => setSelectedAddPlayerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 font-semibold text-white bg-slate-900/80 focus:border-indigo-500"
                >
                  <option value="">-- Choose from available pool --</option>
                  {availablePlayers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.position}) • Roll: {p.roll_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Assign Jersey Number
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={assignJersey}
                  onChange={(e) => setAssignJersey(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono font-bold focus:border-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={handleAddPlayer}
                disabled={!selectedAddPlayerId}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add to {currentTeam?.short_code || 'Team'} Squad</span>
              </button>
            </div>
          )}

          {/* Quick Info Box */}
          <div className="bg-slate-900/80 rounded-xl p-3.5 text-[11px] text-slate-400 space-y-1.5 border border-slate-800">
            <strong className="text-slate-200 block uppercase font-bold text-[10px]">Squad Construction Rules:</strong>
            <p>• One player can only belong to one active varsity team.</p>
            <p>• Each team must designate exactly one official Team Captain.</p>
            <p>• Jersey numbers must be unique within the same team squad.</p>
          </div>
        </div>
      </div>

      {/* CONFIRM REMOVE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Remove Athlete from Squad"
        message="Are you sure you want to remove this player from the team squad? They will return to the free agent pool and can be assigned to another squad."
        confirmText="Remove from Squad"
        variant="warning"
        onConfirm={handleConfirmRemove}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
