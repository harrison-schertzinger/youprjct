import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('community_challenges')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const body = await request.json();

  const { error } = await supabase.from('community_challenges').insert({
    id: body.id,
    title: body.title,
    description: body.description,
    color: body.color,
    total_days: body.total_days,
    category: body.category,
    difficulty: body.difficulty,
    rules: body.rules,
    start_date: body.start_date,
    end_date: body.end_date,
    is_official: body.is_official ?? true,
    is_active: body.is_active ?? true,
    created_at: body.created_at,
  });

  if (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const supabase = createServerClient();
  const body = await request.json();

  const { error } = await supabase
    .from('community_challenges')
    .update({
      title: body.title,
      description: body.description,
      color: body.color,
      total_days: body.total_days,
      category: body.category,
      difficulty: body.difficulty,
      rules: body.rules,
      start_date: body.start_date,
      end_date: body.end_date,
      is_official: body.is_official,
      is_active: body.is_active,
    })
    .eq('id', body.id);

  if (error) {
    console.error('Error updating challenge:', error);
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

  const { error } = await supabase.from('community_challenges').delete().eq('id', id);

  if (error) {
    console.error('Error deleting challenge:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
