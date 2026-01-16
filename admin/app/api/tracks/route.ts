import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('training_tracks')
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

  const { error } = await supabase.from('training_tracks').insert({
    id: body.id,
    title: body.title,
    created_at: body.created_at,
    updated_at: body.updated_at,
  });

  if (error) {
    console.error('Error creating track:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const supabase = createServerClient();
  const body = await request.json();

  const { error } = await supabase
    .from('training_tracks')
    .update({
      title: body.title,
      updated_at: body.updated_at,
    })
    .eq('id', body.id);

  if (error) {
    console.error('Error updating track:', error);
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

  const { error } = await supabase.from('training_tracks').delete().eq('id', id);

  if (error) {
    console.error('Error deleting track:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
