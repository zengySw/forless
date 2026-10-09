export type Coupon = { id: string; hue: number; emoji: string; title: string; text: string };
export type Settings = {
  title: string;
  for_whom: string;
  lead: string;
  notify_on_open: boolean;
  notify_on_use: boolean;
};

// Base item with id
export type BaseItem = { id: string };

// Letter types
export type Letter = BaseItem & {
  emoji: string;
  condition: string;
  text: string;
  opened?: boolean;
  status?: string;
};

// Memory types
export type Memory = BaseItem & {
  date: string;
  title: string;
  text: string;
  image?: string;
  related_memories?: Array<{ id: string; type: string }>;
};

export type TimelineEvent = Memory;

// User type
export type User = BaseItem & {
  name?: string;
  avatar?: string;
  first_visit?: string;
  last_visit?: string;
  visit_count?: number;
};

// Achievement types
export type Achievement = BaseItem & {
  category: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  reward_type: string;
  reward_id: string;
  hidden: boolean;
  unlocked?: boolean;
};

export type UserAchievement = {
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
};

// Secret types
export type Secret = BaseItem & {
  title: string;
  description: string;
  condition: string;
  hint: string;
  unlocked_by: string;
  unlocked_at: string;
  sort_order: number;
  reveal_content: string;
  reveal_id: string;
  found?: boolean;
  emoji?: string;
};

export type UserSecret = {
  user_id: string;
  secret_id: string;
  found_at: string;
};

// Photo types
export type Photo = BaseItem & {
  album_id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
  tags: string;
  is_secret: boolean;
  unlock_condition: string;
};

export type Album = BaseItem & {
  name: string;
  description: string;
  cover_image: string;
};

// Game types
export type Game = BaseItem & {
  title: string;
  description: string;
  type: string;
  image: string;
  audio_url: string;
  is_active: boolean;
};

export type GameQuestion = {
  game_id: string;
  question: string;
  image: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  points: number;
};

export type UserGameAttempt = {
  user_id: string;
  game_id: string;
  score: number;
  completed: boolean;
  completed_at: string;
};

// Would You Rather types
export type WouldYouRather = BaseItem & {
  question: string;
  option_a: string;
  option_b: string;
  popular_a: number;
  popular_b: number;
  created_at?: string;
};

export type UserWouldYouRather = {
  user_id: string;
  wyr_id: string;
  chose_a: boolean;
  answered_at: string;
};

// Event types
export type Event = BaseItem & {
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  event_time: string;
  is_active: boolean;
  content_type: string;
  content_id: string;
  reward_type: string;
  reward_id: string;
};

export type UserEvent = {
  user_id: string;
  event_id: string;
  triggered_at: string;
  completed: boolean;
};

// Surprise types
export type Surprise = BaseItem & {
  title: string;
  description: string;
  type: string;
  content: string;
  image_url: string;
  music_url: string;
  animation: string;
  condition: string;
  is_active: boolean;
  unlocked_by: string;
  unlocked_at: string;
};

export type UserSurprise = {
  user_id: string;
  surprise_id: string;
  opened_at: string;
};

// Theme types
export type Theme = BaseItem & {
  name: string;
  description: string;
  background_color: string;
  primary_color: string;
  secondary_color: string;
  font: string;
  is_active: boolean;
};

export type UserTheme = {
  user_id: string;
  theme_id: string;
  selected_at: string;
};
