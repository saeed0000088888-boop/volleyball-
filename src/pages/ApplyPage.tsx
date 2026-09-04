import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Upload, 
  User, 
  Phone, 
  BookOpen, 
  Award, 
  Sparkles,
  Info,
  Copy,
  Check
} from 'lucide-react';
import { PlayingPosition } from '../types';
import { supabaseService } from '../lib/supabase';

interface ApplyPageProps {
  setCurrentPage: (page: string) => void;
  onApplicationSubmitted?: () => void;
}

const POSITIONS: { value: PlayingPosition; label: string; desc: string }[] = [
  { value: 'Setter', label: 'Setter', desc: 'Court playmaker, high volleyball IQ, distributes attacks' },
  { value: 'Outside Hitter', label: 'Outside Hitter', desc: 'Left side attack anchor & primary serve receiver' },
  { value: 'Opposite', label: 'Opposite Hitter', desc: 'Right side attacker, heavy blocker against opponent OH' },
  { value: 'Middle Blocker', label: 'Middle Blocker', desc: 'First line of defense, slide hits and quick tempo' },
  { value: 'Libero', label: 'Libero', desc: 'Defensive anchor, digs, serve reception specialist' },
  { value: 'Defensive Specialist', label: 'Defensive Specialist (DS)', desc: 'Back-row substitute for pinpoint passing and defense' },
  { value: 'All Rounder', label: 'All Rounder', desc: 'Versatile athlete capable of front and back row roles' },
];

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&auto=format&fit=crop&q=80',
];

export const ApplyPage: React.FC<ApplyPageProps> = ({ setCurrentPage, onApplicationSubmitted }) => {
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [className, setClassName] = useState('2nd Year');
  const [section, setSection] = useState('Sec A');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [playingPosition, setPlayingPosition] = useState<PlayingPosition>('Outside Hitter');
  const [previousExperience, setPreviousExperience] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(SAMPLE_AVATARS[0]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successTrackingId, setSuccessTrackingId] = useState<string | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!rollNumber.trim()) {
      setErrorMessage('Roll number / Student ID is required.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Phone number is required for team coordination.');
      return;
    }
    if (!previousExperience.trim()) {
      setErrorMessage('Please summarize your volleyball playing experience or achievements.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await supabaseService.submitApplication({
        full_name: fullName.trim(),
        roll_number: rollNumber.trim().toUpperCase(),
        class_name: className,
        section: section,
        phone_number: phoneNumber.trim(),
        playing_position: playingPosition,
        previous_experience: previousExperience.trim(),
        profile_photo_url: profilePhotoUrl,
        additional_info: additionalInfo.trim(),
        medical_notes: medicalNotes.trim(),
      });

      if (res.error) {
        setErrorMessage(res.error);
        setSubmitting(false);
        return;
      }

      if (res.application) {
        setSuccessTrackingId(res.application.tracking_id);
        if (onApplicationSubmitted) onApplicationSubmitted();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyTrackingId = () => {
    if (successTrackingId) {
      navigator.clipboard.writeText(successTrackingId);
      setCopiedTrackingId(true);
      setTimeout(() => setCopiedTrackingId(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-5xl animate-fadeIn">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10 text-center sm:text-left border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Student Athlete Recruitment • 2026</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
          Apply for Team Squad
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-2xl">
          Submit your official application for the upcoming Collegiate Volleyball Championship. Applications are reviewed by coaches and tournament administrators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Application Form */}
        <div className="lg:col-span-8 bg-[#1E293B] rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Submission Incomplete</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Personal & Academic Credentials */}
            <div>
              <h2 className="font-heading text-base font-bold uppercase tracking-wide text-white border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span>1. Student Identification</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Roll Number / Student ID <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ATH-1089"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-sm text-white placeholder:text-slate-500 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-mono"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Must be unique. Used for verification & duplicate checks.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Academic Year / Class <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior)</option>
                    <option value="Graduate">Graduate Student</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Section / Department <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sec A (Kinesiology)"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone / Contact Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Playing Position */}
            <div>
              <h2 className="font-heading text-base font-bold uppercase tracking-wide text-white border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>2. Volleyball Position & Role</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {POSITIONS.map((pos) => {
                  const isSelected = playingPosition === pos.value;
                  return (
                    <div
                      key={pos.value}
                      onClick={() => setPlayingPosition(pos.value)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/30'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold uppercase ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                          {pos.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {pos.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Experience & Background */}
            <div>
              <h2 className="font-heading text-base font-bold uppercase tracking-wide text-white border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>3. Experience & Additional Details</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Previous Playing Experience & Accolades <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detail your club, high school, or intramural volleyball experience, seasons played, captaincy, awards, and vertical reach..."
                    value={previousExperience}
                    onChange={(e) => setPreviousExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>

                {/* Avatar / Photo Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Profile Photo / Avatar
                  </label>
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={profilePhotoUrl} 
                      alt="Selected preview" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 shadow-sm"
                    />
                    <span className="text-xs text-slate-400">
                      Choose from collegiate preset athlete avatars or paste your image URL below:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {SAMPLE_AVATARS.map((url, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setProfilePhotoUrl(url)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition ${
                          profilePhotoUrl === url ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste custom image URL (https://...)"
                    value={profilePhotoUrl}
                    onChange={(e) => setProfilePhotoUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Medical / Fitness Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cleared for high impact, ankle brace worn"
                      value={medicalNotes}
                      onChange={(e) => setMedicalNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Additional Information (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Available for weekend travel games"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={submitting}
                id="apply-submit-btn"
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Submitting Official Application...</span>
                ) : (
                  <>
                    <span>Submit Application for Varsity Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Eligibility Checklist & Process */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1E293B] text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-indigo-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Eligibility Standards</span>
            </h3>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Currently enrolled college student with valid Roll Number / ID.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Minimum academic standing of 2.0 GPA maintained.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Physical conditioning clearance for NCAA rally-point volleyball.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Availability for scheduled evening match fixtures and court sessions.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-3">
            <h3 className="font-heading text-base font-bold uppercase text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>What Happens Next?</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                <span>Your application receives an official tracking ID and enters the admin review queue.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                <span>The tournament administrator approves the application to enroll you in the Player pool.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                <span>You will be assigned to a varsity team squad (Falcons, Panthers, Titans, Vipers) and designated a jersey number!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL POPUP */}
      {successTrackingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-800 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/50 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Application Submitted Successfully
              </span>
              <h3 className="font-heading text-2xl font-bold uppercase text-white">
                Welcome to the Draft, {fullName}!
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Your application has been logged into the tournament database. The tournament selector committee is reviewing submissions.
              </p>
            </div>

            {/* Tracking ID Box */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Official Tracking ID
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl font-bold text-white">
                  {successTrackingId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTrackingId}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  title="Copy Tracking ID"
                >
                  {copiedTrackingId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setSuccessTrackingId(null);
                  setCurrentPage('teams');
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-500/20"
              >
                View Participating Teams & Squads
              </button>
              <button
                onClick={() => {
                  setSuccessTrackingId(null);
                  setCurrentPage('home');
                }}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-semibold"
              >
                Return to Tournament Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
