// Goals feature types

export type GoalType = 'fitness' | 'career' | 'learning' | 'health' | 'creative' | 'financial' | 'social' | 'other';

export type Goal = {
  id: string;
  title: string;
  goalType: GoalType;
  createdAt: string;
};

// Goal type color mapping (subtle accent bars)
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
