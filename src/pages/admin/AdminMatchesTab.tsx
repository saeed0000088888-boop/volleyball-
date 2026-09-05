import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Radio, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X,
  Trophy
} from 'lucide-react';
import { Match, Team, MatchStatus } from '../../types';
import { supabaseService } from '../../lib/supabase';
import { ConfirmModal } from '../../components/ConfirmModal';

interface AdminMatchesTabProps {
  matches: Match[];
  teams: Team[];
  onDataChanged: () => void;
  onNavigateToResults?: (matchId: string) => void;
}

const COURTS = ['Court 1 (Main Arena)', 'Court 2 (West Pavilion)'];
const ROUNDS = [
  'Pool Play - Round 1',
  'Pool Play - Round 2',
  'Pool Play - Round 3',
  'Quarter-Finals',
  'Semi-Finals',
  'Bronze Medal Match',
  'Championship Final',
];

export const AdminMatchesTab: React.FC<AdminMatchesTabProps> = ({
  matches,
  teams,
  onDataChanged,
  onNavigateToResults,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [matchDate, setMatchDate] = useState('2026-10-16');
  const [matchTime, setMatchTime] = useState('14:00');
  const [venue, setVenue] = useState('Austin Fieldhouse');
  const [court, setCourt] = useState(COURTS[0]);
  const [round, setRound] = useState(ROUNDS[0]);
  const [status, setStatus] = useState<MatchStatus>('Scheduled');
  const [notes, setNotes] = useState('');

  const getTeam = (id: string) => teams.find(t => t.id === id);

  const openCreateModal = () => {
    setEditingMatch(null);
    setTeamAId(teams[0]?.id || '');
    setTeamBId(teams[1]?.id || '');
    setMatchDate('2026-10-16');
    setMatchTime('16:00');
    setVenue('Austin Fieldhouse');
    setCourt(COURTS[0]);
    setRound(ROUNDS[0]);
    setStatus('Scheduled');
    setNotes('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (match: Match) => {
    setEditingMatch(match);
    setTeamAId(match.team_a_id);
    setTeamBId(match.team_b_id);
    setMatchDate(match.match_date);
    setMatchTime(match.match_time);
    setVenue(match.venue);
    setCourt(match.court);
    setRound(match.round);
    setStatus(match.status);
    setNotes(match.notes || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!teamAId || !teamBId) {
      setFormError('Please select both teams.');
      return;
    }

    if (teamAId === teamBId) {
      setFormError('Team A and Team B cannot be the same team.');
      return;
    }

    try {
      if (editingMatch) {
        await supabaseService.updateMatch(editingMatch.id, {
          team_a_id: teamAId,
          team_b_id: teamBId,
          match_date: matchDate,
          match_time: matchTime,
          venue,
          court,
          round,
          status,
          notes,
        });
      } else {
        await supabaseService.createMatch({
          team_a_id: teamAId,
          team_b_id: teamBId,
          match_date: matchDate,
          match_time: matchTime,
          venue,
          court,
          round,
          status,
          notes,
          winner_id: null,
          sets_won_a: 0,
          sets_won_b: 0,
          set_scores: [],
        });
      }

      onDataChanged();
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save match.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const mid = deleteTargetId;
    setDeleteTargetId(null);
    try {
      await supabaseService.deleteMatch(mid);
      onDataChanged();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h3 className="font-heading text-lg font-bold uppercase text-white">
            Tournament Match Schedule ({matches.length})
          </h3>
          <p className="text-xs text-slate-400">
            Schedule upcoming matches, set court assignments, and transition fixtures to Live or Completed.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={teams.length < 2}
          id="schedule-new-match-btn"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Match</span>
        </button>
      </div>

      {teams.length < 2 && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs">
          You need at least 2 registered teams before you can schedule matches. Create teams in the "Teams" tab first.
        </div>
      )}

      {/* Matches List */}
      {matches.length === 0 ? (
        <div className="bg-[#1E293B] rounded-2xl p-12 text-center border border-slate-800 shadow-xl space-y-3">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="font-heading text-base font-bold uppercase text-white">
            No Matches Scheduled
          </h4>
          <p className="text-xs text-slate-400">
            Click "Schedule Match" above to establish fixtures on Court 1 or Court 2.
          </p>
        </div>
      ) : (
        <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4 text-left">Date & Time</th>
                  <th className="py-3 px-3 text-left">Round / Stage</th>
                  <th className="py-3 px-3 text-left">Court Facility</th>
                  <th className="py-3 px-4 text-left">Team Matchup</th>
                  <th className="py-3 px-3 text-center">Score</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {matches.map((match) => {
                  const teamA = getTeam(match.team_a_id);
                  const teamB = getTeam(match.team_b_id);

                  return (
                    <tr key={match.id} className="hover:bg-slate-900/50 transition">
                      {/* Date & Time */}
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        <div>{match.match_date}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{match.match_time}</span>
                      </td>

                      {/* Round */}
                      <td className="py-3 px-3 font-semibold text-white">
                        {match.round}
                      </td>

                      {/* Court */}
                      <td className="py-3 px-3 text-slate-300 font-medium">
                        {match.court}
                      </td>

                      {/* Matchup */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{teamA?.name || 'Team A'}</span>
                          <span className="text-slate-500 font-normal">vs</span>
                          <span className="font-bold text-white">{teamB?.name || 'Team B'}</span>
                        </div>
                      </td>

                      {/* Sets Score */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-white">
                        {match.status === 'Completed' || match.status === 'Live' ? (
                          <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-xs text-indigo-300">
                            {match.sets_won_a} - {match.sets_won_b}
                          </span>
                        ) : (
                          <span className="text-slate-600 font-normal">--</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          match.status === 'Live' ? 'bg-rose-950/60 border-rose-800/80 text-rose-400 animate-pulse' :
                          match.status === 'Completed' ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400' :
                          'bg-indigo-950/60 border-indigo-800/80 text-indigo-400'
                        }`}>
                          {match.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onNavigateToResults && (
                            <button
                              onClick={() => onNavigateToResults(match.id)}
                              title="Enter Match Results & Sets"
                              className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold uppercase hover:bg-indigo-500 transition shadow-md shadow-indigo-500/20"
                            >
                              Scores
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(match)}
                            title="Edit Fixture"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(match.id)}
                            title="Delete Fixture"
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
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Scheduled Fixture"
        message="Are you sure you want to delete this match fixture? Any scores or sets entered for this match will also be deleted."
        confirmText="Delete Fixture"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* CREATE / EDIT MATCH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-800 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading text-lg font-bold uppercase text-white">
                {editingMatch ? 'Edit Match Fixture' : 'Schedule New Match'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveMatch} className="space-y-4 text-xs">
              {/* Teams Matchup Selection */}
              <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Team A *
                  </label>
                  <select
                    value={teamAId}
                    onChange={(e) => setTeamAId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 font-semibold bg-slate-900 text-white"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.short_code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Team B *
                  </label>
                  <select
                    value={teamBId}
                    onChange={(e) => setTeamBId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 font-semibold bg-slate-900 text-white"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.short_code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Match Date
                  </label>
                  <input
                    type="date"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Match Time
                  </label>
                  <input
                    type="time"
                    required
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Court Facility
                  </label>
                  <select
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white"
                  >
                    {COURTS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Round / Stage
                  </label>
                  <select
                    value={round}
                    onChange={(e) => setRound(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white"
                  >
                    {ROUNDS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Venue Location
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Fixture Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MatchStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white font-bold"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Live">Live (In Progress)</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Referee / Scorer Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Broadcast Court with TV replay"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white"
                />
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
                  {editingMatch ? 'Update Fixture' : 'Schedule Match'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
