import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Dashboard
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Manage training content for You. First
      </p>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/admin/exercises"
          className="block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
        >
          <div className="text-3xl mb-3">🏋️</div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Exercises
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage the exercise library (squats, deadlifts, etc.)
          </p>
        </Link>

        <Link
          href="/admin/tracks"
          className="block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
        >
          <div className="text-3xl mb-3">📋</div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Tracks
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage training tracks (Athlete, Functional Fitness, etc.)
          </p>
        </Link>

        <Link
          href="/admin/planner"
          className="block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
        >
          <div className="text-3xl mb-3">📅</div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Week Planner
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Schedule workouts for specific weeks and tracks
          </p>
        </Link>
      </div>

      {/* Instructions */}
      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          Getting Started
        </h3>
        <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-2 list-decimal list-inside">
          <li>
            <strong>Set up Exercises</strong> — Add the movements athletes will track (Back Squat, Deadlift, etc.)
          </li>
          <li>
            <strong>Create Tracks</strong> — Define training programs (Athlete Track, Functional Fitness, etc.)
          </li>
          <li>
            <strong>Plan Weeks</strong> — Use the Week Planner to schedule workouts for each track
          </li>
        </ol>
      </div>
    </div>
  );
}
