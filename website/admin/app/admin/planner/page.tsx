'use client';

import { useState, useEffect } from 'react';
import type { TrainingTrack, Exercise, TrainingDay, Workout } from '@/lib/supabase';

// Helper to get week dates (timezone-safe)
function getWeekDates(mondayISO: string): string[] {
  // Parse as local date to avoid timezone issues
  const [year, month, day] = mondayISO.split('-').map(Number);
  const monday = new Date(year, month - 1, day);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    // Format as YYYY-MM-DD in local time
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
  }
  return dates;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function PlannerPage() {
  const [tracks, setTracks] = useState<TrainingTrack[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [trainingDays, setTrainingDays] = useState<Record<string, TrainingDay>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Workout editor state
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [movements, setMovements] = useState<{ exerciseId: string; targetText: string; notes: string }[]>([]);

  // Calculate current week's Monday
  const today = new Date();
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1) + weekOffset * 7);
  const mondayISO = currentMonday.toISOString().split('T')[0];
  const weekDates = getWeekDates(mondayISO);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedTrackId) {
      loadTrainingDays();
    }
  }, [selectedTrackId, mondayISO]);

  async function loadInitialData() {
    setLoading(true);

    try {
      const [tracksRes, exercisesRes] = await Promise.all([
        fetch('/api/tracks'),
        fetch('/api/exercises'),
      ]);

      if (tracksRes.ok) {
        const tracksData = await tracksRes.json();
        setTracks(tracksData || []);
        if (tracksData.length > 0 && !selectedTrackId) {
          setSelectedTrackId(tracksData[0].id);
        }
      }

      if (exercisesRes.ok) {
        const exercisesData = await exercisesRes.json();
        setExercises(exercisesData || []);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }

    setLoading(false);
  }

  async function loadTrainingDays() {
    try {
      const res = await fetch(`/api/training-days?track_id=${selectedTrackId}&week_start_iso=${mondayISO}`);
      if (!res.ok) throw new Error('Failed to load training days');
      const data = await res.json();

      const dayMap: Record<string, TrainingDay> = {};
      (data || []).forEach((day: TrainingDay) => {
        dayMap[day.date_iso] = day;
      });
      setTrainingDays(dayMap);
    } catch (error) {
      console.error('Error loading training days:', error);
    }
  }

  function openWorkoutEditor(dateISO: string) {
    const existingDay = trainingDays[dateISO];
    if (existingDay && existingDay.workouts.length > 0) {
      const workout = existingDay.workouts[0];
      setWorkoutTitle(workout.title);
      setMovements(
        workout.movements.map((m) => ({
          exerciseId: m.exerciseId,
          targetText: m.targetText || '',
          notes: m.notes || '',
        }))
      );
    } else {
      setWorkoutTitle('');
      setMovements([{ exerciseId: '', targetText: '', notes: '' }]);
    }
    setEditingDay(dateISO);
  }

  function addMovement() {
    setMovements([...movements, { exerciseId: '', targetText: '', notes: '' }]);
  }

  function removeMovement(index: number) {
    setMovements(movements.filter((_, i) => i !== index));
  }

  function updateMovement(index: number, field: string, value: string) {
    const updated = [...movements];
    updated[index] = { ...updated[index], [field]: value };
    setMovements(updated);
  }

  async function saveWorkout() {
    if (!editingDay || !selectedTrackId || !workoutTitle.trim()) {
      alert('Please enter a workout title');
      return;
    }

    setSaving(true);

    const validMovements = movements.filter((m) => m.exerciseId);
    const workout: Workout = {
      id: `workout-${Date.now()}`,
      trackId: selectedTrackId,
      dateISO: editingDay,
      title: workoutTitle.trim(),
      movements: validMovements.map((m, i) => ({
        id: `movement-${Date.now()}-${i}`,
        exerciseId: m.exerciseId,
        targetText: m.targetText || undefined,
        notes: m.notes || undefined,
        order: i,
      })),
    };

    const existingDay = trainingDays[editingDay];

    try {
      if (existingDay) {
        // Update existing day
        const res = await fetch('/api/training-days', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: existingDay.id,
            workouts: [workout],
            updated_at: new Date().toISOString(),
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to update training day');
        }
      } else {
        // Create new day
        const res = await fetch('/api/training-days', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `day-${Date.now()}`,
            track_id: selectedTrackId,
            date_iso: editingDay,
            week_start_iso: mondayISO,
            workouts: [workout],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to create training day');
        }
      }

      setEditingDay(null);
      loadTrainingDays();
    } catch (error) {
      console.error('Error saving workout:', error);
      alert(error instanceof Error ? error.message : 'Failed to save workout');
    }

    setSaving(false);
  }

  async function clearDay(dateISO: string) {
    const day = trainingDays[dateISO];
    if (!day) return;

    if (!confirm('Clear this day\'s workout?')) return;

    try {
      const res = await fetch(`/api/training-days?id=${day.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to clear day');
      }
      loadTrainingDays();
    } catch (error) {
      console.error('Error clearing day:', error);
      alert(error instanceof Error ? error.message : 'Failed to clear day');
    }
  }

  if (loading) {
    return <div className="text-slate-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Week Planner
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Schedule workouts for each day
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <select
          value={selectedTrackId}
          onChange={(e) => setSelectedTrackId(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        >
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.title}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            ← Prev
          </button>
          <span className="px-4 py-2 text-slate-900 dark:text-white font-medium">
            Week of {mondayISO}
          </span>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Next →
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="px-3 py-2 text-blue-600 dark:text-blue-400 text-sm font-medium"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((dateISO, index) => {
          const day = trainingDays[dateISO];
          const hasWorkout = day && day.workouts.length > 0;
          const workout = hasWorkout ? day.workouts[0] : null;

          return (
            <div
              key={dateISO}
              className={`p-4 rounded-xl border ${
                hasWorkout
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                {DAY_LABELS[index]}
              </div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                {new Date(dateISO).getDate()}
              </div>

              {hasWorkout ? (
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                    {workout?.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {workout?.movements.length} movements
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openWorkoutEditor(dateISO)}
                      className="text-xs text-blue-600 dark:text-blue-400 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => clearDay(dateISO)}
                      className="text-xs text-red-600 dark:text-red-400 font-medium"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => openWorkoutEditor(dateISO)}
                  className="text-sm text-blue-600 dark:text-blue-400 font-medium"
                >
                  + Add Workout
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Workout Editor Modal */}
      {editingDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {DAY_LABELS[weekDates.indexOf(editingDay)]} - {editingDay}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Workout Title
                </label>
                <input
                  type="text"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="e.g., Lower Body Strength"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Movements
                  </label>
                  <button
                    onClick={addMovement}
                    className="text-sm text-blue-600 dark:text-blue-400 font-medium"
                  >
                    + Add Movement
                  </button>
                </div>

                <div className="space-y-3">
                  {movements.map((movement, index) => (
                    <div
                      key={index}
                      className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <select
                            value={movement.exerciseId}
                            onChange={(e) =>
                              updateMovement(index, 'exerciseId', e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                          >
                            <option value="">Select exercise...</option>
                            {exercises.map((ex) => (
                              <option key={ex.id} value={ex.id}>
                                {ex.title}
                              </option>
                            ))}
                          </select>

                          <input
                            type="text"
                            value={movement.targetText}
                            onChange={(e) =>
                              updateMovement(index, 'targetText', e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            placeholder="Target (e.g., 5x5 @ 80%)"
                          />

                          <input
                            type="text"
                            value={movement.notes}
                            onChange={(e) =>
                              updateMovement(index, 'notes', e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            placeholder="Notes (optional)"
                          />
                        </div>

                        <button
                          onClick={() => removeMovement(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setEditingDay(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={saveWorkout}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Workout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
