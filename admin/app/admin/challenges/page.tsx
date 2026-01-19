'use client';

import { useState, useEffect } from 'react';

// Challenge types matching the app
type ChallengeColor = 'ocean' | 'ember' | 'forest' | 'violet' | 'sunset' | 'midnight' | 'rose' | 'slate';
type ChallengeCategory = 'fitness' | 'learning' | 'health' | 'creative' | 'productivity' | 'social' | 'other';
type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced';

type ChallengeRule = {
  id: string;
  text: string;
};

type Challenge = {
  id: string;
  title: string;
  description: string;
  color: ChallengeColor;
  total_days: number;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  rules: ChallengeRule[];
  start_date: string;
  end_date: string;
  is_official: boolean;
  is_active: boolean;
  created_at?: string;
};

const COLORS: { value: ChallengeColor; label: string; gradient: string }[] = [
  { value: 'ocean', label: 'Ocean', gradient: 'from-blue-500 to-blue-700' },
  { value: 'ember', label: 'Ember', gradient: 'from-orange-500 to-red-600' },
  { value: 'forest', label: 'Forest', gradient: 'from-emerald-500 to-emerald-700' },
  { value: 'violet', label: 'Violet', gradient: 'from-violet-500 to-purple-700' },
  { value: 'sunset', label: 'Sunset', gradient: 'from-amber-500 to-orange-600' },
  { value: 'midnight', label: 'Midnight', gradient: 'from-indigo-500 to-indigo-900' },
  { value: 'rose', label: 'Rose', gradient: 'from-pink-500 to-rose-700' },
  { value: 'slate', label: 'Slate', gradient: 'from-slate-500 to-slate-700' },
];

const CATEGORIES: { value: ChallengeCategory; label: string; emoji: string }[] = [
  { value: 'fitness', label: 'Fitness', emoji: '💪' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
  { value: 'health', label: 'Health', emoji: '🧘' },
  { value: 'creative', label: 'Creative', emoji: '🎨' },
  { value: 'productivity', label: 'Productivity', emoji: '⚡' },
  { value: 'social', label: 'Social', emoji: '👥' },
  { value: 'other', label: 'Other', emoji: '✨' },
];

const DIFFICULTIES: { value: ChallengeDifficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const DURATIONS = [40, 75, 100];

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const today = formatDateISO(new Date());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: 'ocean' as ChallengeColor,
    total_days: 40,
    category: 'fitness' as ChallengeCategory,
    difficulty: 'beginner' as ChallengeDifficulty,
    rules: [{ id: `rule-${Date.now()}`, text: '' }] as ChallengeRule[],
    start_date: today,
    is_official: true,
    is_active: true,
  });

  useEffect(() => {
    loadChallenges();
  }, []);

  async function loadChallenges() {
    setLoading(true);
    try {
      const res = await fetch('/api/challenges');
      if (!res.ok) throw new Error('Failed to load challenges');
      const data = await res.json();
      setChallenges(data || []);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Filter out empty rules
    const validRules = formData.rules.filter(r => r.text.trim() !== '');
    if (validRules.length === 0) {
      alert('Please add at least one rule');
      return;
    }

    // Calculate end date
    const startDate = new Date(formData.start_date);
    const endDate = addDays(startDate, formData.total_days);

    try {
      if (editingId) {
        const res = await fetch('/api/challenges', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            title: formData.title,
            description: formData.description,
            color: formData.color,
            total_days: formData.total_days,
            category: formData.category,
            difficulty: formData.difficulty,
            rules: validRules,
            start_date: formData.start_date,
            end_date: formatDateISO(endDate),
            is_official: formData.is_official,
            is_active: formData.is_active,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to update challenge');
        }
      } else {
        const res = await fetch('/api/challenges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `challenge-${Date.now()}`,
            title: formData.title,
            description: formData.description,
            color: formData.color,
            total_days: formData.total_days,
            category: formData.category,
            difficulty: formData.difficulty,
            rules: validRules,
            start_date: formData.start_date,
            end_date: formatDateISO(endDate),
            is_official: formData.is_official,
            is_active: formData.is_active,
            created_at: new Date().toISOString(),
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to create challenge');
        }
      }

      resetForm();
      loadChallenges();
    } catch (error) {
      console.error('Error saving challenge:', error);
      alert(error instanceof Error ? error.message : 'Failed to save challenge');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this challenge?')) return;

    try {
      const res = await fetch(`/api/challenges?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete challenge');
      }
      loadChallenges();
    } catch (error) {
      console.error('Error deleting challenge:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete challenge');
    }
  }

  async function handleToggleActive(challenge: Challenge) {
    try {
      const res = await fetch('/api/challenges', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...challenge,
          is_active: !challenge.is_active,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update challenge');
      }
      loadChallenges();
    } catch (error) {
      console.error('Error toggling challenge:', error);
    }
  }

  function handleEdit(challenge: Challenge) {
    setFormData({
      title: challenge.title,
      description: challenge.description || '',
      color: challenge.color,
      total_days: challenge.total_days,
      category: challenge.category,
      difficulty: challenge.difficulty,
      rules: challenge.rules.length > 0 ? challenge.rules : [{ id: `rule-${Date.now()}`, text: '' }],
      start_date: challenge.start_date,
      is_official: challenge.is_official,
      is_active: challenge.is_active,
    });
    setEditingId(challenge.id);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      color: 'ocean',
      total_days: 40,
      category: 'fitness',
      difficulty: 'beginner',
      rules: [{ id: `rule-${Date.now()}`, text: '' }],
      start_date: today,
      is_official: true,
      is_active: true,
    });
    setEditingId(null);
    setShowForm(false);
  }

  function addRule() {
    setFormData({
      ...formData,
      rules: [...formData.rules, { id: `rule-${Date.now()}`, text: '' }],
    });
  }

  function removeRule(id: string) {
    if (formData.rules.length <= 1) return;
    setFormData({
      ...formData,
      rules: formData.rules.filter(r => r.id !== id),
    });
  }

  function updateRule(id: string, text: string) {
    setFormData({
      ...formData,
      rules: formData.rules.map(r => r.id === id ? { ...r, text } : r),
    });
  }

  const selectedColor = COLORS.find(c => c.value === formData.color);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Community Challenges
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create and manage challenges for the community
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Create Challenge
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {editingId ? 'Edit Challenge' : 'New Challenge'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Description */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="e.g., Iron Mind 40"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Describe the challenge..."
                  rows={2}
                />
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color.gradient} flex items-center justify-center transition-transform ${
                      formData.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                    }`}
                    title={color.label}
                  >
                    {formData.color === color.value && (
                      <span className="text-white text-lg">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration, Category, Difficulty */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Duration
                </label>
                <select
                  value={formData.total_days}
                  onChange={(e) => setFormData({ ...formData, total_days: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>{d} Days</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ChallengeCategory })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as ChallengeDifficulty })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            {/* Rules */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Daily Rules *
                </label>
                <button
                  type="button"
                  onClick={addRule}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                >
                  + Add Rule
                </button>
              </div>
              <div className="space-y-2">
                {formData.rules.map((rule, index) => (
                  <div key={rule.id} className="flex gap-2">
                    <span className="flex items-center justify-center w-8 h-10 text-sm font-medium text-slate-500 dark:text-slate-400">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={rule.text}
                      onChange={(e) => updateRule(rule.id, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      placeholder="e.g., Complete two 45-minute workouts"
                    />
                    {formData.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRule(rule.id)}
                        className="px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_official}
                  onChange={(e) => setFormData({ ...formData, is_official: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Official Challenge</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Active (visible in app)</span>
              </label>
            </div>

            {/* Preview Card */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Preview
              </label>
              <div className={`p-4 rounded-xl bg-gradient-to-br ${selectedColor?.gradient} text-white`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium">
                    {formData.total_days} days
                  </span>
                  <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium capitalize">
                    {formData.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{formData.title || 'Challenge Title'}</h3>
                <p className="text-sm text-white/80 mb-3">{formData.description || 'Challenge description...'}</p>
                <p className="text-xs text-white/60">{formData.rules.filter(r => r.text).length} rules</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update Challenge' : 'Create Challenge'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Challenges List */}
      {loading ? (
        <div className="text-slate-500 dark:text-slate-400">Loading...</div>
      ) : challenges.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          No challenges yet. Create your first challenge to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {challenges.map((challenge) => {
            const color = COLORS.find(c => c.value === challenge.color);
            const category = CATEGORIES.find(c => c.value === challenge.category);
            return (
              <div
                key={challenge.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${color?.gradient}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {challenge.title}
                        </h3>
                        {!challenge.is_active && (
                          <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-medium text-slate-600 dark:text-slate-400">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {challenge.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-400">
                          {challenge.total_days} days
                        </span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-400">
                          {category?.emoji} {category?.label}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-400 capitalize">
                          {challenge.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-400">
                          {challenge.rules.length} rules
                        </span>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-400">
                          Starts: {challenge.start_date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(challenge)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          challenge.is_active
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {challenge.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleEdit(challenge)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(challenge.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
