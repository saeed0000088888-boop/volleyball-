export type PlayingPosition = 
  | 'Setter'
  | 'Outside Hitter'
  | 'Opposite'
  | 'Middle Blocker'
  | 'Libero'
  | 'Defensive Specialist'
  | 'All Rounder';

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export type PlayerStatus = 'Available' | 'Assigned' | 'Inactive';

export type MatchStatus = 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';

export type TournamentFormat = 'League' | 'Knockout' | 'League + Knockout';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  venue: string;
  number_of_teams: number;
  format: TournamentFormat;
  status: 'Draft' | 'Active' | 'Completed';
  created_at?: string;
  updated_at?: string;
}

export interface TournamentSettings {
  id?: string;
  tournament_id?: string;
  win_points: number;
  loss_points: number;
  forfeit_points: number;
  sets_to_win: number; // usually 2 for best of 3, or 3 for best of 5
  tiebreaker_rule: string;
  updated_at?: string;
}

export interface StudentApplication {
  id: string;
  full_name: string;
  roll_number: string;
  class_name: string;
  section: string;
  phone_number: string;
  playing_position: PlayingPosition;
  previous_experience: string;
  profile_photo_url?: string;
  additional_info?: string;
  medical_notes?: string;
  status: ApplicationStatus;
  tracking_id: string;
  created_at: string;
  updated_at?: string;
}

export interface Player {
  id: string;
  application_id?: string;
  name: string;
  roll_number: string;
  class_name: string;
  section: string;
  phone_number: string;
  position: PlayingPosition;
  team_id: string | null;
  status: PlayerStatus;
  jersey_number?: number;
  height?: string;
  profile_photo_url?: string;
  is_captain?: boolean;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Team {
  id: string;
  name: string;
  short_code: string;
  logo_url: string;
  division?: string;
  seed?: number;
  captain_id?: string | null;
  captain_name?: string;
  manager_name?: string;
  conference?: string;
  color?: string;
  created_at: string;
  updated_at?: string;
}

export interface MatchSetScore {
  set_number: number;
  score_a: number;
  score_b: number;
}

export type SetScore = MatchSetScore;


export interface Match {
  id: string;
  tournament_id?: string;
  team_a_id: string;
  team_b_id: string;
  match_date: string;
  match_time: string;
  venue: string;
  court: string;
  round: string;
  status: MatchStatus;
  winner_id: string | null;
  sets_won_a: number;
  sets_won_b: number;
  set_scores: MatchSetScore[];
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface TeamStanding {
  team_id: string;
  team_name: string;
  logo_url: string;
  short_code: string;
  division?: string;
  played: number;
  won: number;
  lost: number;
  sets_won: number;
  sets_lost: number;
  set_ratio: number;
  points_scored: number;
  points_conceded: number;
  point_differential: number;
  points: number;
  form: ('W' | 'L')[];
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  name: string;
}
