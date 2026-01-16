import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('title');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const body = await request.json();

  const { error } = await supabase.from('exercises').insert({
    id: body.id,
    title: body.title,
    score_type: body.score_type,
    sort_direction: body.sort_direction,
    is_major: body.is_major,
    created_at: body.created_at,
    updated_at: body.updated_at,
  });

  if (error) {
    console.error('Error creating exercise:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const supabase = createServerClient();
  const body = await request.json();

  const { error } = await supabase
    .from('exercises')
    .update({
      title: body.title,
      score_type: body.score_type,
      sort_direction: body.sort_direction,
      is_major: body.is_major,
      updated_at: body.updated_at,
    })
    .eq('id', body.id);

  if (error) {
    console.error('Error updating exercise:', error);
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

  const { error } = await supabase.from('exercises').delete().eq('id', id);

  if (error) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
