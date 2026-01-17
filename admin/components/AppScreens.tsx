import React from 'react';

// Dashboard Screen - "You" tab with calendar
export function DashboardScreen() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const calendarDays = [
    [null, null, null, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, null],
  ];
  const wonDays = [12, 13, 14, 15, 16, 17];
  const today = 17;

  return (
    <div className="h-full bg-[#F5F5F3] p-3 text-[#0B0B0B] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">
          H
        </div>
        <div className="flex-1 flex bg-white rounded-full px-3 py-1.5 text-[10px] shadow-sm">
          <div className="flex-1 text-center">
            <div className="text-[#6B6B6B]">DAYS WON</div>
            <div className="text-blue-500 font-bold">1</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1 text-center">
            <div className="text-[#6B6B6B]">CONSISTENCY</div>
            <div className="text-emerald-500 font-bold">100%</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1 text-center">
            <div className="text-[#6B6B6B]">TASKS</div>
            <div className="font-bold">0/0</div>
          </div>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-2xl p-3 shadow-sm flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400">←</span>
          <span className="font-semibold text-sm">January</span>
          <span className="text-gray-400">→</span>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {days.map((day, i) => (
            <div key={i} className="text-center text-[9px] text-gray-400 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 flex flex-col gap-1">
          {calendarDays.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1 flex-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`flex items-center justify-center rounded-full text-[10px] font-medium ${
                    day === null
                      ? ''
                      : day === today
                      ? 'bg-emerald-500 text-white'
                      : wonDays.includes(day)
                      ? 'bg-gray-400 text-white'
                      : day < today
                      ? 'bg-gray-300 text-gray-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Day Won Button */}
      <button className="mt-3 w-full py-3 rounded-2xl bg-indigo-200 text-indigo-700 font-semibold text-sm flex items-center justify-center gap-2">
        <span className="text-emerald-600">✓</span>
        Day Won
      </button>

      {/* Day Selector */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs">
        <span className="text-gray-400">Yesterday</span>
        <span className="px-4 py-1.5 bg-white rounded-full font-medium shadow-sm">Today</span>
        <span className="text-gray-400">Tomorrow</span>
      </div>

      {/* Bottom Tab Bar */}
      <div className="mt-3 flex items-center justify-around bg-white/80 rounded-full py-2 px-4">
        <div className="text-gray-400 text-lg">⛰</div>
        <div className="text-gray-400 text-lg">◎</div>
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
          .uoY
        </div>
        <div className="text-gray-400 text-lg">🧠</div>
        <div className="text-gray-400 text-lg">🏋</div>
      </div>
    </div>
  );
}

// Discipline Screen - Rules view
export function DisciplineRulesScreen() {
  return (
    <div className="h-full bg-[#F5F5F3] p-3 text-[#0B0B0B] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold relative">
          H
          <span className="absolute -bottom-0.5 -right-0.5 text-[8px]">🔥3</span>
        </div>
        <div className="flex-1 flex bg-white rounded-full px-3 py-1.5 text-[10px] shadow-sm">
          <div className="flex-1 text-center">
            <div className="text-[#6B6B6B]">STREAK</div>
            <div className="text-blue-500 font-bold">1d</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1 text-center">
            <div className="text-[#6B6B6B]">BEST</div>
            <div className="text-emerald-500 font-bold">1d</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1 text-center">
            <div className="text-[#6B6B6B]">CHALLENGE</div>
            <div className="font-bold">1/40</div>
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex bg-white rounded-xl p-1 mb-3">
        <div className="flex-1 py-1.5 text-center text-gray-400 text-xs">Challenge</div>
        <div className="flex-1 py-1.5 text-center bg-white rounded-lg shadow-sm text-xs font-medium">Rules</div>
      </div>

      {/* Rules Card */}
      <div className="bg-white rounded-2xl p-3 shadow-sm flex-1 flex flex-col">
        {/* Gradient bar */}
        <div className="h-5 rounded-lg mb-3 flex items-center text-[8px] font-bold text-white px-2"
          style={{ background: 'linear-gradient(to right, #22C55E, #EAB308, #EF4444)' }}>
          <span>100%</span>
          <span className="flex-1 text-center">RULES</span>
          <span>0%</span>
        </div>

        {/* Calendar */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400">←</span>
          <span className="font-semibold text-sm">January</span>
          <span className="text-gray-400">→</span>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1 text-[9px] text-gray-400 font-medium">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="text-center">{d}</div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 gap-1 text-[10px]">
          {[...Array(35)].map((_, i) => {
            const day = i - 2;
            if (day < 1 || day > 31) return <div key={i} />;
            const isToday = day === 16;
            const isPast = day < 16;
            return (
              <div
                key={i}
                className={`flex items-center justify-center rounded-lg ${
                  isToday ? 'bg-emerald-500 text-white font-bold' : isPast ? 'bg-gray-100 text-gray-500' : 'text-gray-300'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Today's Check-In */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm">Today&apos;s Check-In</span>
            <span className="text-xs text-gray-400">2/1</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-xs">no scrolling on social media</span>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-500 text-xs font-medium">
            Complete Check-In
          </button>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="mt-3 flex items-center justify-around bg-white/80 rounded-full py-2 px-4">
        <div className="text-blue-500 text-lg">⛰</div>
        <div className="text-gray-400 text-lg">◎</div>
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
          .uoY
        </div>
        <div className="text-gray-400 text-lg">🧠</div>
        <div className="text-gray-400 text-lg">🏋</div>
      </div>
    </div>
  );
}

// Challenge Screen
export function ChallengeScreen() {
  return (
    <div className="h-full bg-[#F5F5F3] p-3 text-[#0B0B0B] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">
          H
        </div>
        <div className="flex-1 flex bg-white rounded-full px-3 py-1.5 text-[10px] shadow-sm">
          <div className="flex-1 text-center">
            <div className="text-[#6B6B6B]">STREAK</div>
            <div className="text-blue-500 font-bold">1d</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1 text-center">
            <div className="text-[#6B6B6B]">BEST</div>
            <div className="text-emerald-500 font-bold">1d</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1 text-center">
            <div className="text-[#6B6B6B]">CHALLENGE</div>
            <div className="font-bold">1/40</div>
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex bg-white rounded-xl p-1 mb-3">
        <div className="flex-1 py-1.5 text-center bg-white rounded-lg shadow-sm text-xs font-medium">Challenge</div>
        <div className="flex-1 py-1.5 text-center text-gray-400 text-xs">Rules</div>
      </div>

      {/* Challenge Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex-1 flex flex-col">
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full mb-3">
          <div className="h-full w-full bg-blue-500 rounded-full" />
        </div>

        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold">Cold challenge</h3>
          <span className="text-gray-400">×</span>
        </div>
        <p className="text-xs text-gray-500 mb-2">Day 1 of 40 · 1 completed</p>

        {/* Mini progress */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1 bg-gray-100 rounded-full">
            <div className="h-full w-[3%] bg-blue-500 rounded-full" />
          </div>
          <span className="text-xs text-gray-400">3%</span>
        </div>

        {/* Progress Calendar */}
        <p className="text-[10px] text-gray-400 font-semibold mb-2">PROGRESS CALENDAR</p>
        <div className="grid grid-cols-8 gap-1 flex-1">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className={`flex items-center justify-center rounded text-[9px] ${
                i === 0 ? 'bg-blue-500 text-white font-bold' : 'bg-gray-50 text-gray-300'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Completion Status */}
        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-blue-500 font-semibold text-sm">Day 1 Complete</p>
          <p className="text-xs text-gray-400">Come back tomorrow for Day 2</p>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="mt-3 flex items-center justify-around bg-white/80 rounded-full py-2 px-4">
        <div className="text-blue-500 text-lg">⛰</div>
        <div className="text-gray-400 text-lg">◎</div>
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
          .uoY
        </div>
        <div className="text-gray-400 text-lg">🧠</div>
        <div className="text-gray-400 text-lg">🏋</div>
      </div>
    </div>
  );
}

// Body/Training Screen
export function TrainingScreen() {
  const weekDays = [
    { day: 'Mon', date: 12 },
    { day: 'Tue', date: 13 },
    { day: 'Wed', date: 14 },
    { day: 'Thu', date: 15 },
    { day: 'Fri', date: 16, active: true },
    { day: 'Sat', date: 17 },
    { day: 'Sun', date: 18 },
  ];

  return (
    <div className="h-full bg-[#F5F5F3] p-3 text-[#0B0B0B] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold">
          H
        </div>
        <div className="flex-1 flex bg-white rounded-full px-3 py-1.5 text-[10px] shadow-sm">
          <div className="flex-1 text-center">
            <div className="text-[#6B6B6B]">SESSIONS</div>
            <div className="text-blue-500 font-bold">1</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1 text-center">
            <div className="text-[#6B6B6B]">AVG. TIME</div>
            <div className="text-emerald-500 font-bold">0m</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="flex-1 text-center">
            <div className="text-[#6B6B6B]">TOTAL TIME</div>
            <div className="font-bold">0m</div>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between mb-3 shadow-sm">
        <span className="text-2xl font-light text-gray-300">00:00</span>
        <button className="px-5 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium">Start</button>
      </div>

      {/* Tab Selector */}
      <div className="flex bg-white rounded-xl p-1 mb-3">
        <div className="flex-1 py-1.5 text-center bg-white rounded-lg shadow-sm text-xs font-medium">Training</div>
        <div className="flex-1 py-1.5 text-center text-gray-400 text-xs">Profile</div>
      </div>

      {/* Active Track */}
      <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between mb-3 shadow-sm">
        <div>
          <p className="text-[10px] text-gray-400">Active Track</p>
          <p className="text-sm font-medium">Functional Fitness Track</p>
        </div>
        <span className="text-gray-400">›</span>
      </div>

      {/* Week Selector */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400">‹</span>
        <span className="text-sm font-medium">This Week</span>
        <span className="text-gray-400">›</span>
      </div>

      <div className="flex gap-1 mb-3">
        {weekDays.map((d, i) => (
          <div
            key={i}
            className={`flex-1 py-2 rounded-xl text-center ${
              d.active ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            <div className="text-[9px]">{d.day}</div>
            <div className="text-sm font-semibold">{d.date}</div>
          </div>
        ))}
      </div>

      {/* Workout */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-sm">Full Body Circuit</span>
        <span className="text-blue-500 text-xs font-medium">Start</span>
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        {['Front Squat', 'Overhead Press', 'Pull-ups'].map((exercise, i) => (
          <div key={i} className="bg-white rounded-xl px-4 py-3 flex items-center shadow-sm">
            <div className={`w-1 h-8 rounded-full mr-3 ${i === 2 ? 'bg-yellow-500' : 'bg-blue-500'}`} />
            <span className="text-sm">{exercise}</span>
            <span className="ml-auto text-gray-400 text-xs">›</span>
          </div>
        ))}
      </div>

      {/* Bottom Tab Bar */}
      <div className="mt-3 flex items-center justify-around bg-white/80 rounded-full py-2 px-4">
        <div className="text-gray-400 text-lg">⛰</div>
        <div className="text-gray-400 text-lg">◎</div>
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
          .uoY
        </div>
        <div className="text-gray-400 text-lg">🧠</div>
        <div className="text-blue-500 text-lg">🏋</div>
      </div>
    </div>
  );
}

// Workout Detail with PR
export function WorkoutDetailScreen() {
  return (
    <div className="h-full bg-[#F5F5F3] p-3 text-[#0B0B0B] flex flex-col">
      {/* Week Selector */}
      <div className="flex gap-1 mb-3">
        {[
          { day: 'Mon', date: 12 },
          { day: 'Tue', date: 13 },
          { day: 'Wed', date: 14 },
          { day: 'Thu', date: 15 },
          { day: 'Fri', date: 16, active: true },
          { day: 'Sat', date: 17 },
          { day: 'Sun', date: 18 },
        ].map((d, i) => (
          <div
            key={i}
            className={`flex-1 py-1.5 rounded-lg text-center ${
              d.active ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            <div className="text-[8px]">{d.day}</div>
            <div className="text-xs font-semibold">{d.date}</div>
          </div>
        ))}
      </div>

      {/* Workout Title */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-sm">Full Body Circuit</span>
        <span className="text-blue-500 text-xs font-medium">Start</span>
      </div>

      {/* Exercises */}
      <div className="flex-1 space-y-2 overflow-hidden">
        {[
          { name: 'Front Squat', reps: '3 rounds: 10 reps', color: 'blue' },
          { name: 'Overhead Press', reps: '3 rounds: 10 reps', color: 'blue' },
          { name: 'Pull-ups', reps: '3 rounds: 10 reps', color: 'yellow' },
        ].map((exercise, i) => (
          <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
            <div className="flex items-center mb-2">
              <div className={`w-1 h-6 rounded-full mr-2 ${exercise.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
              <span className="font-medium text-sm">{exercise.name}</span>
              <span className="ml-auto text-gray-400 text-xs">▼</span>
            </div>
            <div className="border-t pt-2">
              <p className="text-xs text-gray-500 mb-2">{exercise.reps}</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-gray-100 text-xs font-medium">Results</button>
                <button className="flex-1 py-2 rounded-lg bg-blue-500 text-white text-xs font-medium">Log</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PR Modal Preview */}
      <div className="mt-3 bg-white rounded-t-2xl p-4 shadow-lg -mx-3 -mb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold">Overhead Press</span>
          <span className="text-gray-400">×</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">1</div>
            <div>
              <p className="font-medium text-sm">Harrison</p>
              <p className="text-[10px] text-gray-400">Jan 15</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="font-bold">135 lbs</span>
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">PR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
