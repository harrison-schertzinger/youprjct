'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient, type TrainingTrack } from '@/lib/supabase';

export default function TracksPage() {
  const [tracks, setTracks] = useState<TrainingTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    loadTracks();
  }, []);

  async function loadTracks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('training_tracks')
      .select('*')
      .order('title');

    if (error) {
      console.error('Error loading tracks:', error);
    } else {
      setTracks(data || []);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId) {
      // Update existing
      const { error } = await supabase
        .from('training_tracks')
        .update({
          title: formData.title,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating track:', error);
        alert('Failed to update track');
        return;
      }
    } else {
      // Create new
      const { error } = await supabase.from('training_tracks').insert({
        id: `track-${Date.now()}`,
        title: formData.title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error creating track:', error);
        alert('Failed to create track');
        return;
      }
    }

    resetForm();
    loadTracks();
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this track? This will also delete all associated training days.')) {
      return;
    }

    const { error } = await supabase.from('training_tracks').delete().eq('id', id);

    if (error) {
      console.error('Error deleting track:', error);
      alert('Failed to delete track');
      return;
    }

    loadTracks();
  }

  function handleEdit(track: TrainingTrack) {
    setFormData({
      title: track.title,
    });
    setEditingId(track.id);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({ title: '' });
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Training Tracks
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage training programs
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Track
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {editingId ? 'Edit Track' : 'New Track'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Track Name
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="e.g., Athlete Track"
                required
              />
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
      ) : tracks.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          No tracks yet. Add your first training track to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {track.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  ID: {track.id}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(track)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(track.id)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
