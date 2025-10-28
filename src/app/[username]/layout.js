import { supabase } from '../../lib/supabase'

export async function generateMetadata({ params }) {
  const { username } = await params

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, bio, avatar, username')
      .eq('username', username)
      .single()

    if (!profile) {
      return {
        title: `${username} - Profile Not Found`,
        description: 'This profile does not exist on VizitLink.',
      }
    }

    return {
      title: `${profile.display_name || username} - VizitLink`,
      description: profile.bio || `Check out ${profile.display_name || username}'s VizitLink profile`,
      openGraph: {
        title: `${profile.display_name || username}'s VizitLink`,
        description: profile.bio || `Check out ${profile.display_name || username}'s VizitLink profile`,
        images: profile.avatar ? [{ url: profile.avatar }] : [],
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${profile.display_name || username}'s VizitLink`,
        description: profile.bio || `Check out ${profile.display_name || username}'s VizitLink profile`,
      },
    }
  } catch (error) {
    return {
      title: `${username} - VizitLink`,
      description: `Check out ${username}'s VizitLink profile`,
    }
  }
}

export async function generateStaticParams() {
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('username')
      .not('username', 'is', null)
      .limit(100)

    if (!profiles) return []

    return profiles.map((profile) => ({
      username: profile.username,
    }))
  } catch (error) {
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

