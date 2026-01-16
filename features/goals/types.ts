// Goals feature types

export type GoalType = 'fitness' | 'career' | 'learning' | 'health' | 'creative' | 'financial' | 'social' | 'other';

export type GoalColor =
  | 'ocean'      // Deep blue
  | 'ember'      // Orange-red
  | 'forest'     // Green
  | 'violet'     // Purple
  | 'sunset'     // Warm orange
  | 'midnight'   // Dark blue-purple
  | 'rose'       // Pink
  | 'slate';     // Sophisticated gray

export type GoalStep = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type Goal = {
  id: string;
  title: string;
  outcome: string;           // Specific goal and outcome
  whys: string[];            // 3-5 reasons (Your Fuel)
  steps: GoalStep[];         // Actionable steps toward the goal
  goalType: GoalType;
  color: GoalColor;
  createdAt: string;
  isCompleted: boolean;
  completedAt?: string;
};

// Premium gradient presets - each maps to a beautiful gradient
export const GOAL_GRADIENTS: Record<GoalColor, { start: string; end: string; text: string }> = {
  ocean:    { start: '#0077B6', end: '#023E8A', text: '#FFFFFF' },
  ember:    { start: '#F97316', end: '#DC2626', text: '#FFFFFF' },
  forest:   { start: '#059669', end: '#065F46', text: '#FFFFFF' },
  violet:   { start: '#8B5CF6', end: '#6D28D9', text: '#FFFFFF' },
  sunset:   { start: '#F59E0B', end: '#EA580C', text: '#FFFFFF' },
  midnight: { start: '#4F46E5', end: '#1E1B4B', text: '#FFFFFF' },
  rose:     { start: '#EC4899', end: '#BE185D', text: '#FFFFFF' },
  slate:    { start: '#64748B', end: '#334155', text: '#FFFFFF' },
};

// Display names for color picker
export const GOAL_COLOR_NAMES: Record<GoalColor, string> = {
  ocean: 'Ocean',
  ember: 'Ember',
  forest: 'Forest',
  violet: 'Violet',
  sunset: 'Sunset',
  midnight: 'Midnight',
  rose: 'Rose',
  slate: 'Slate',
};

// Goal type color mapping (for type indicator)
export const GOAL_TYPE_COLORS: Record<GoalType, string> = {
  fitness: '#059669',    // emerald
  career: '#2F6BFF',     // blue
  learning: '#8B5CF6',   // purple
  health: '#10B981',     // green
  creative: '#F59E0B',   // amber
  financial: '#059669',  // emerald
  social: '#EC4899',     // pink
  other: '#6B7280',      // gray
};
