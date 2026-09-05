import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Radio, 
  Calendar, 
  Clock, 
  Sparkles,
  AlertCircle,
  Save
} from 'lucide-react';
import { Match, Team, SetScore } from '../../types';
import { supabaseService } from '../../lib/supabase';

interface AdminResultsTabProps {
  matches: Match[];
  teams: Team[];
  selectedMatchIdFromNav?: string;
  onDataChanged: () => void;
}

export const AdminResultsTab: React.FC<AdminResultsTabProps> = ({
  matches,
  teams,
  selectedMatchIdFromNav,
  onDataChanged,
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(
    selectedMatchIdFromNav || matches[0]?.id || ''
  );

  useEffect(() => {
    if (selectedMatchIdFromNav) {
      setSelectedMatchId(selectedMatchIdFromNav);
    }
  }, [selectedMatchIdFromNav]);

  const selectedMatch = matches.find(m => m.id === selectedMatchId);
  const teamA = selectedMatch ? teams.find(t => t.id === selectedMatch.team_a_id) : undefined;
  const teamB = selectedMatch ? teams.find(t => t.id === selectedMatch.team_b_id) : undefined;

  // Set scores state for the selected match
  const [sets, setSets] = useState<SetScore[]>([
    { set_number: 1, score_a: 25, score_b: 21 },
    { set_number: 2, score_a: 19, score_b: 25 },
    { set_number: 3, score_a: 15, score_b: 11 },
  ]);
  const [matchStatus, setMatchStatus] = useState<'Scheduled' | 'Live' | 'Completed'>('Completed');
  const [matchNotes, setMatchNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when selectedMatch changes
  useEffect(() => {
    if (selectedMatch) {
      if (selectedMatch.set_scores && selectedMatch.set_scores.length > 0) {
        setSets(selectedMatch.set_scores);
      } else {
        setSets([
          { set_number: 1, score_a: 0, score_b: 0 },
          { set_number: 2, score_a: 0, score_b: 0 },
          { set_number: 3, score_a: 0, score_b: 0 },
        ]);
      }
      setMatchStatus(selectedMatch.status);
      setMatchNotes(selectedMatch.notes || '');
      setSaveSuccess(false);
    }
  }, [selectedMatchId]);

  // Real-time calculation of sets won and winner
  let calculatedSetsWonA = 0;
  let calculatedSetsWonB = 0;

  sets.forEach(s => {
    if (s.score_a > s.score_b) calculatedSetsWonA++;
    else if (s.score_b > s.score_a) calculatedSetsWonB++;
  });

  let calculatedWinnerId: string | undefined = undefined;
  if (calculatedSetsWonA >= 2) {
    calculatedWinnerId = teamA?.id;
  } else if (calculatedSetsWonB >= 2) {
    calculatedWinnerId = teamB?.id;
  }

  const handleScoreChange = (index: number, team: 'a' | 'b', value: number) => {
    const nextSets = [...sets];
    if (team === 'a') {
      nextSets[index].score_a = Math.max(0, value);
    } else {
      nextSets[index].score_b = Math.max(0, value);
    }
    setSets(nextSets);
  };

  const handleAddSet = () => {
    if (sets.length >= 5) return;
    setSets([...sets, { set_number: sets.length + 1, score_a: 0, score_b: 0 }]);
  };

  const handleRemoveSet = (index: number) => {
    if (sets.length <= 1) return;
    const next = sets.filter((_, i) => i !== index).map((s, idx) => ({ ...s, set_number: idx + 1 }));
    setSets(next);
  };

  const handleSaveResult = async () => {
    if (!selectedMatch || !teamA || !teamB) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      const isCompleted = matchStatus === 'Completed' || (calculatedWinnerId !== undefined);

      await supabaseService.updateMatchResults(
        selectedMatch.id,
        sets,
        calculatedSetsWonA,
        calculatedSetsWonB,
        calculatedWinnerId,
        isCompleted ? 'Completed' : matchStatus,
        matchNotes
      );

      // Recalculate standings automatically
      await supabaseService.recalculateStandings();

      setSaving(false);
      setSaveSuccess(true);
      onDataChanged();

      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  if (matches.length === 0) {
    return (
      <div className="bg-[#1E293B] rounded-2xl p-12 text-center border border-slate-800 shadow-xl space-y-3">
        <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
        <h4 className="font-heading text-base font-bold uppercase text-white">
          No Matches Scheduled
        </h4>
        <p className="text-xs text-slate-400">
          Please schedule matches in the "Schedule Matches" tab before entering scores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header & Match Selector */}
      <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-heading text-lg font-bold uppercase text-white">
              Official Match Score Sheet
            </h3>
            <p className="text-xs text-slate-400">
              Enter rally scores per set. Winner and championship points table update automatically.
            </p>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Result Published & Points Recalculated!</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="text-xs font-bold uppercase text-slate-300 tracking-wider shrink-0">
            Select Fixture:
          </label>
          <select
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-bold text-white bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {matches.map(m => {
              const tA = teams.find(t => t.id === m.team_a_id);
              const tB = teams.find(t => t.id === m.team_b_id);
              return (
                <option key={m.id} value={m.id}>
                  {m.match_date} • {m.round} : {tA?.name} vs {tB?.name} [{m.status}]
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {selectedMatch && teamA && teamB && (
        <div className="space-y-6">
          {/* Active Matchup Preview Banner */}
          <div className="bg-[#0F172A] rounded-3xl p-6 text-white border border-slate-800 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Team A */}
              <div className="flex items-center gap-3 text-center sm:text-left">
                <img src={teamA.logo_url} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/50" />
                <div>
                  <h4 className="font-heading text-xl font-bold uppercase text-white">{teamA.name}</h4>
                  <span className="text-xs text-slate-400 font-mono">#{teamA.seed || 1} Seed</span>
                </div>
              </div>

              {/* Live Sets Won Scoreboard */}
              <div className="flex flex-col items-center justify-center bg-[#1E293B] px-6 py-3 rounded-2xl border border-slate-800 shadow-md">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Calculated Sets Won
                </span>
                <div className="flex items-center gap-3 text-3xl font-black font-mono">
                  <span className={calculatedSetsWonA > calculatedSetsWonB ? 'text-indigo-400' : 'text-white'}>
                    {calculatedSetsWonA}
                  </span>
                  <span className="text-slate-600">:</span>
                  <span className={calculatedSetsWonB > calculatedSetsWonA ? 'text-indigo-400' : 'text-white'}>
                    {calculatedSetsWonB}
                  </span>
                </div>

                {calculatedWinnerId ? (
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-indigo-400 uppercase">
                    <Trophy className="w-3 h-3" />
                    <span>Winner: {calculatedWinnerId === teamA.id ? teamA.name : teamB.name}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 mt-1">Need 2 Sets to Win</span>
                )}
              </div>

              {/* Team B */}
              <div className="flex items-center gap-3 text-center sm:text-right flex-row-reverse sm:flex-row">
                <div className="text-right">
                  <h4 className="font-heading text-xl font-bold uppercase text-white">{teamB.name}</h4>
                  <span className="text-xs text-slate-400 font-mono">#{teamB.seed || 1} Seed</span>
                </div>
                <img src={teamB.logo_url} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/50" />
              </div>
            </div>
          </div>

          {/* Set Scores Table Entry */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-heading text-base font-bold uppercase text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Set-by-Set Score Sheet (Best of 3 / 5)</span>
              </h4>
              <button
                type="button"
                onClick={handleAddSet}
                disabled={sets.length >= 5}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-1 disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Set {sets.length + 1}</span>
              </button>
            </div>

            <div className="space-y-3">
              {sets.map((set, idx) => {
                const aWinsThisSet = set.score_a > set.score_b;
                const bWinsThisSet = set.score_b > set.score_a;

                return (
                  <div 
                    key={set.set_number}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <span className="font-heading text-sm font-bold uppercase text-white min-w-[70px]">
                        Set {set.set_number}
                      </span>
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        {set.set_number === 3 ? '(Tiebreaker to 15)' : '(Play to 25)'}
                      </span>
                    </div>

                    {/* Team A Score Input */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-300 block truncate max-w-[120px]">
                          {teamA.name}
                        </span>
                      </div>
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={set.score_a}
                        onChange={(e) => handleScoreChange(idx, 'a', parseInt(e.target.value) || 0)}
                        className={`w-16 py-2 px-2 text-center text-lg font-mono font-bold rounded-xl border ${
                          aWinsThisSet 
                            ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 font-black' 
                            : 'bg-slate-900 border-slate-700 text-white'
                        }`}
                      />
                    </div>

                    <span className="text-slate-600 font-mono font-bold text-base hidden sm:inline">:</span>

                    {/* Team B Score Input */}
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={set.score_b}
                        onChange={(e) => handleScoreChange(idx, 'b', parseInt(e.target.value) || 0)}
                        className={`w-16 py-2 px-2 text-center text-lg font-mono font-bold rounded-xl border ${
                          bWinsThisSet 
                            ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 font-black' 
                            : 'bg-slate-900 border-slate-700 text-white'
                        }`}
                      />
                      <div className="text-left">
                        <span className="text-xs font-semibold text-slate-300 block truncate max-w-[120px]">
                          {teamB.name}
                        </span>
                      </div>
                    </div>

                    {/* Actions / Remove */}
                    <div className="w-full sm:w-auto flex justify-end">
                      {sets.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSet(idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status & Match Completion Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Fixture Status
                </label>
                <select
                  value={matchStatus}
                  onChange={(e) => setMatchStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 font-bold bg-slate-900/80 text-white text-xs"
                >
                  <option value="Completed">Completed (Final Result)</option>
                  <option value="Live">Live (Currently on Court)</option>
                  <option value="Scheduled">Scheduled (Not Started)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Match Notes / Highlights
                </label>
                <input
                  type="text"
                  placeholder="e.g. 23 service aces; thrilling 3rd set rally"
                  value={matchNotes}
                  onChange={(e) => setMatchNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-white text-xs"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Saving will instantly refresh official standings, set ratios, and tournament points.
              </div>

              <button
                type="button"
                onClick={handleSaveResult}
                disabled={saving}
                id="save-match-results-btn"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Calculating & Updating...' : 'Save & Publish Match Result'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
