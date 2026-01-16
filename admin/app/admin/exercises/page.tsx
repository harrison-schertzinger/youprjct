'use client';

import { useState, useEffect } from 'react';
import type { Exercise } from '@/lib/supabase';

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    score_type: 'weight' as Exercise['score_type'],
    sort_direction: 'desc' as Exercise['sort_direction'],
    is_major: false,
  });

  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    setLoading(true);
    try {
      const res = await fetch('/api/exercises');
      if (!res.ok) throw new Error('Failed to load exercises');
      const data = await res.json();
      setExercises(data || []);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing
        const res = await fetch('/api/exercises', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            title: formData.title,
            score_type: formData.score_type,
            sort_direction: formData.sort_direction,
            is_major: formData.is_major,
            updated_at: new Date().toISOString(),
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to update exercise');
        }
      } else {
        // Create new
        const res = await fetch('/api/exercises', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `exercise-${Date.now()}`,
            title: formData.title,
            score_type: formData.score_type,
            sort_direction: formData.sort_direction,
            is_major: formData.is_major,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to create exercise');
        }
      }

      resetForm();
      loadExercises();
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert(error instanceof Error ? error.message : 'Failed to save exercise');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this exercise?')) return;

    try {
      const res = await fetch(`/api/exercises?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete exercise');
      }
      loadExercises();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete exercise');
    }
  }

  function handleEdit(exercise: Exercise) {
    setFormData({
      title: exercise.title,
      score_type: exercise.score_type,
      sort_direction: exercise.sort_direction,
      is_major: exercise.is_major,
    });
    setEditingId(exercise.id);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      title: '',
      score_type: 'weight',
      sort_direction: 'desc',
      is_major: false,
    });
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Exercises
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage the exercise library
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Exercise
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {editingId ? 'Edit Exercise' : 'New Exercise'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="e.g., Back Squat"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Score Type
                </label>
                <select
                  value={formData.score_type}
                  onChange={(e) =>
                    setFormData({ ...formData, score_type: e.target.value as Exercise['score_type'] })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="weight">Weight (lbs)</option>
                  <option value="reps">Reps</option>
                  <option value="time">Time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Sort Direction
                </label>
                <select
                  value={formData.sort_direction}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_direction: e.target.value as Exercise['sort_direction'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="desc">Higher is better</option>
                  <option value="asc">Lower is better</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_major"
                checked={formData.is_major}
                onChange={(e) => setFormData({ ...formData, is_major: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300"
              />
              <label htmlFor="is_major" className="text-sm text-slate-700 dark:text-slate-300">
                Major movement (shows on PR dashboard)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update' : 'Create'}
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

      {/* Table */}
      {loading ? (
        <div className="text-slate-500 dark:text-slate-400">Loading...</div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          No exercises yet. Add your first exercise to get started.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                  Major
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((exercise) => (
                <tr
                  key={exercise.id}
                  className="border-b border-slate-100 dark:border-slate-700 last:border-0"
                >
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">
                    {exercise.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 capitalize">
                    {exercise.score_type}
                  </td>
                  <td className="px-4 py-3">
                    {exercise.is_major && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                        Major
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(exercise)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exercise.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
