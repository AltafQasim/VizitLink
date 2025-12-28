import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.redirect('/', { status: 302 });

    // Fetch link (public policy allows select when active)
    const { data: link, error } = await supabase
      .from('custom_links')
      .select('id, profile_id, url, redirect_url, active')
      .eq('id', id)
      .single();
    if (error || !link || !link.active) return NextResponse.redirect('/', { status: 302 });

    const target = link.redirect_url || link.url;
    if (!target) return NextResponse.redirect('/', { status: 302 });

    // Collect click
    const referrer = request.headers.get('referer') || null;
    const userAgent = request.headers.get('user-agent') || null;
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const ipHash = await hashIp(ip);

    await supabase.from('custom_link_clicks').insert({
      link_id: link.id,
      profile_id: link.profile_id,
      referrer,
      user_agent: userAgent,
      ip_hash: ipHash,
    });

    return NextResponse.redirect(target, { status: 302 });
  } catch (e) {
    return NextResponse.redirect('/', { status: 302 });
  }
}

async function hashIp(ip) {
  try {
    const enc = new TextEncoder();
    const buf = enc.encode(ip);
    const digest = await crypto.subtle.digest('SHA-256', buf);
    const arr = Array.from(new Uint8Array(digest));
    return arr.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return null;
  }
}


