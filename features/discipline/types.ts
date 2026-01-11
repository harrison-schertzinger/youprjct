// Discipline feature types

export type Rule = {
  id: string;
  title: string;
  createdAt: string;
};

export type Challenge = {
  id: string;
  title: string;
  currentDay: number;
  totalDays: number;
  requirements: ChallengeRequirement[];
};

export type ChallengeRequirement = {
  id: string;
  text: string;
  completed: boolean;
};

export type DisciplineView = 'challenge' | 'rules';
