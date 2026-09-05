import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Eye, 
  Clock, 
  Award, 
  Phone, 
  BookOpen, 
  User,
  AlertCircle
} from 'lucide-react';
import { StudentApplication, ApplicationStatus } from '../../types';
import { supabaseService } from '../../lib/supabase';
import { ConfirmModal } from '../../components/ConfirmModal';

interface AdminApplicationsTabProps {
  applications: StudentApplication[];
  onDataChanged: () => void;
}

export const AdminApplicationsTab: React.FC<AdminApplicationsTabProps> = ({
  applications,
  onDataChanged,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>('All');
  const [selectedApp, setSelectedApp] = useState<StudentApplication | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filtered = applications.filter(a => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = a.full_name.toLowerCase().includes(term) ||
                          a.roll_number.toLowerCase().includes(term) ||
                          a.class_name.toLowerCase().includes(term) ||
                          a.playing_position.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (appId: string, status: 'Approved' | 'Rejected') => {
    setLoadingAction(`${appId}_${status}`);
    try {
      await supabaseService.updateApplicationStatus(appId, status);
      onDataChanged();
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, status });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const appId = deleteTargetId;
    setDeleteTargetId(null);
    setLoadingAction(`${appId}_delete`);
    try {
      await supabaseService.deleteApplication(appId);
      onDataChanged();
      if (selectedApp && selectedApp.id === appId) setSelectedApp(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate by name, roll no, class, position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition uppercase tracking-wider ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="font-heading text-base font-bold uppercase text-white">
              No Applications Found
            </h4>
            <p className="text-xs text-slate-500">
              Try adjusting your search criteria or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4 text-left">Applicant</th>
                  <th className="py-3 px-3 text-left">Roll Number</th>
                  <th className="py-3 px-3 text-left">Position</th>
                  <th className="py-3 px-3 text-left">Class & Sec</th>
                  <th className="py-3 px-3 text-left">Contact</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((app) => {
                  const isPending = app.status === 'Pending';
                  const isApproved = app.status === 'Approved';
                  const isRejected = app.status === 'Rejected';

                  return (
                    <tr key={app.id} className="hover:bg-slate-900/50 transition">
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={app.profile_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                            alt="" 
                            className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white">{app.full_name}</div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {app.tracking_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-300">
                        {app.roll_number}
                      </td>

                      {/* Position */}
                      <td className="py-3 px-3 font-semibold text-indigo-400">
                        {app.playing_position}
                      </td>

                      {/* Class */}
                      <td className="py-3 px-3 text-slate-400">
                        {app.class_name} • {app.section}
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-3 text-slate-400 font-mono">
                        {app.phone_number}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isApproved 
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-850' 
                            : isRejected 
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-850' 
                            : 'bg-amber-950/60 text-amber-400 border border-amber-850 animate-pulse'
                        }`}>
                          {app.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedApp(app)}
                            title="View Full Application Dossier"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isPending && (
                            <>
                              <button
                                onClick={() => handleStatusChange(app.id, 'Approved')}
                                disabled={loadingAction === `${app.id}_Approved`}
                                title="Approve candidate and add to Players pool"
                                className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950/50 transition"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(app.id, 'Rejected')}
                                disabled={loadingAction === `${app.id}_Rejected`}
                                title="Reject candidate"
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/50 transition"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {isRejected && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'Approved')}
                              title="Re-evaluate & Approve"
                              className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-emerald-400 hover:bg-slate-700"
                            >
                              Approve
                            </button>
                          )}

                          <button
                            onClick={() => setDeleteTargetId(app.id)}
                            disabled={loadingAction === `${app.id}_delete`}
                            title="Delete record"
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

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Student Application"
        message="Are you sure you want to permanently delete this student application record from the portal? This action cannot be undone."
        confirmText="Delete Application"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* VIEW DETAILS MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedApp.profile_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                  alt="" 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
                />
                <div>
                  <h3 className="font-heading text-xl font-bold uppercase text-white">
                    {selectedApp.full_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono font-bold text-indigo-400">{selectedApp.roll_number}</span>
                    <span>•</span>
                    <span>{selectedApp.class_name} ({selectedApp.section})</span>
                  </div>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                selectedApp.status === 'Approved' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' :
                selectedApp.status === 'Rejected' ? 'bg-rose-950/60 text-rose-400 border border-rose-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'
              }`}>
                {selectedApp.status}
              </span>
            </div>

            {/* Dossier Body */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block">Playing Position:</span>
                  <strong className="text-white text-sm font-heading uppercase">{selectedApp.playing_position}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Phone Contact:</span>
                  <strong className="text-white font-mono">{selectedApp.phone_number}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Tracking ID:</span>
                  <strong className="text-white font-mono">{selectedApp.tracking_id}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Submitted On:</span>
                  <strong className="text-white">{new Date(selectedApp.created_at).toLocaleDateString()}</strong>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Previous Experience & Accolades
                </span>
                <p className="p-3 bg-slate-900/80 rounded-xl text-slate-300 leading-relaxed border border-slate-800">
                  {selectedApp.previous_experience || 'No experience details provided.'}
                </p>
              </div>

              {selectedApp.medical_notes && (
                <div>
                  <span className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Medical & Fitness Notes
                  </span>
                  <p className="p-3 bg-slate-900/80 rounded-xl text-amber-300 leading-relaxed border border-slate-800">
                    {selectedApp.medical_notes}
                  </p>
                </div>
              )}

              {selectedApp.additional_info && (
                <div>
                  <span className="font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Additional Info
                  </span>
                  <p className="p-3 bg-slate-900/80 rounded-xl text-slate-300 leading-relaxed border border-slate-800">
                    {selectedApp.additional_info}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-xs font-bold hover:bg-slate-800 hover:text-white transition"
              >
                Close Dossier
              </button>

              <div className="flex items-center gap-2">
                {selectedApp.status !== 'Rejected' && (
                  <button
                    onClick={() => handleStatusChange(selectedApp.id, 'Rejected')}
                    className="px-4 py-2.5 rounded-xl border border-rose-800 bg-rose-950/40 hover:bg-rose-950/80 text-rose-300 text-xs font-bold transition"
                  >
                    Reject
                  </button>
                )}
                {selectedApp.status !== 'Approved' && (
                  <button
                    onClick={() => handleStatusChange(selectedApp.id, 'Approved')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Add to Players Pool</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
