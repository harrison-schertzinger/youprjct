import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get('track_id');
  const weekStartIso = searchParams.get('week_start_iso');

  if (!trackId || !weekStartIso) {
    return NextResponse.json({ error: 'track_id and week_start_iso required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('training_days')
    .select('*')
    .eq('track_id', trackId)
    .eq('week_start_iso', weekStartIso);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const body = await request.json();

  const { error } = await supabase.from('training_days').insert({
    id: body.id,
    track_id: body.track_id,
    date_iso: body.date_iso,
    week_start_iso: body.week_start_iso,
    workouts: body.workouts,
    created_at: body.created_at,
    updated_at: body.updated_at,
  });

  if (error) {
    console.error('Error creating training day:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const supabase = createServerClient();
  const body = await request.json();

  const { error } = await supabase
    .from('training_days')
    .update({
      workouts: body.workouts,
      updated_at: body.updated_at,
    })
    .eq('id', body.id);

  if (error) {
    console.error('Error updating training day:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const { error } = await supabase.from('training_days').delete().eq('id', id);

  if (error) {
    console.error('Error deleting training day:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
