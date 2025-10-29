import { supabase } from '../../lib/supabase'
import { BASE_URL } from '../../lib/constants' // Add this import

export async function generateMetadata({ params }) {
  // In Next.js 15, params might be a Promise, so we need to handle it properly
  const resolvedParams = params instanceof Promise ? await params : params;
  const { username } = resolvedParams;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .eq('is_live', true)
      .maybeSingle();

    // Log for debugging
    console.log('Profile query result:', { profile, error, username });

    if (error) {
      console.error('Error fetching profile:', error);
    }

    if (!profile) {
      return {
        title: `${username} - Profile Not Found`,
        description: 'This profile does not exist on VizitLink.',
        alternates: {
          canonical: `${BASE_URL}/${username}`,
        },
        openGraph: {
          title: `${username} - Profile Not Found`,
          description: 'This profile does not exist on VizitLink.',
          url: `${BASE_URL}/${username}`,
          type: 'website',
          siteName: 'VizitLink',
        },
        twitter: {
          card: 'summary',
          title: `${username} - Profile Not Found`,
          description: 'This profile does not exist on VizitLink.',
        },
      }
    }

    const title = `${profile.display_name || profile.username} | VizitLink`
    const description = profile.bio || `Check out ${profile.display_name || profile.username}'s VizitLink profile`
    const profileUrl = `${BASE_URL}/${profile.username}`
    const imageUrl = profile.avatar_url || `${BASE_URL}/og/image/${profile.username}.jpg`
    const updatedTime = profile.updated_at ? new Date(profile.updated_at).getTime() : Date.now()
    
    return {
      title: title,
      description: description,
      alternates: {
        canonical: profileUrl,
      },
      openGraph: {
        title: title,
        description: description,
        url: profileUrl,
        images: [
          {
            url: imageUrl,
            width: 600,
            height: 600,
            alt: `${profile.display_name || profile.username}'s profile image`,
            type: 'image/jpg',
          },
        ],
        type: 'profile',
        siteName: 'VizitLink',
        locale: 'en_US',
        updatedTime: updatedTime,
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [imageUrl],
        domain: new URL(BASE_URL).hostname,
      },
      profile: {
        username: profile.username,
      },
    }
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    // Handle any errors gracefully
    return {
      title: `${username} | VizitLink`,
      description: `Check out ${username}'s VizitLink profile`,
      alternates: {
        canonical: `${BASE_URL}/${username}`,
      },
      openGraph: {
        title: `${username} | VizitLink`,
        description: `Check out ${username}'s VizitLink profile`,
        url: `${BASE_URL}/${username}`,
        type: 'website',
        siteName: 'VizitLink',
      },
      twitter: {
        card: 'summary',
        title: `${username} | VizitLink`,
        description: `Check out ${username}'s VizitLink profile`,
        domain: new URL(BASE_URL).hostname,
      },
    }
  }
}

export async function generateStaticParams() {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('username')
      .not('username', 'is', null)
      .limit(100)

    if (error) {
      console.error('Error fetching profiles for static params:', error);
      return []
    }

    if (!profiles) return []

    return profiles.map((profile) => ({
      username: profile.username,
    }))
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    return []
  }
}

// Enable static generation with revalidation
export const dynamicParams = true; // Allow dynamic params for non-generated routes
export const revalidate = 3600; // Revalidate every hour (ISR)

// Performance optimization
export const dynamic = 'force-dynamic'; // This page requires dynamic rendering due to client-side interactivity

export default function UsernameLayout({ children }) {
  return children
}