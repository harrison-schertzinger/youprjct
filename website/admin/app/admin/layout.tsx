'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminAuth } from '@/components/AdminAuth';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/exercises', label: 'Exercises', icon: '🏋️' },
  { href: '/admin/tracks', label: 'Tracks', icon: '📋' },
  { href: '/admin/planner', label: 'Week Planner', icon: '📅' },
  { href: '/admin/challenges', label: 'Challenges', icon: '🏆' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AdminAuth>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6">
          <Link href="/" className="block mb-8">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              You. First
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Admin Dashboard
            </p>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-700 mt-8">
            <button
              onClick={() => {
                sessionStorage.removeItem('admin_authenticated');
                window.location.href = '/';
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 w-full"
            >
              <span>🚪</span>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AdminAuth>
  );
}
