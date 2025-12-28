'use server'

import { supabase } from '../lib/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * Server Action: Sign up user
 */
export async function signUpAction(formData) {
  const email = formData.get('email')
  const password = formData.get('password')
  const displayName = formData.get('displayName')

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    if (error) throw error

    if (data.user) {
      revalidatePath('/')
      return { success: true, user: data.user }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Server Action: Sign in user
 */
export async function signInAction(formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      revalidatePath('/dashboard')
      return { success: true, user: data.user }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Server Action: Sign out user
 */
export async function signOutAction() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    revalidatePath('/')
    redirect('/')
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Server Action: Save profile
 */
export async function saveProfileAction(formData) {
  const userId = formData.get('userId')
  const username = formData.get('username')
  const displayName = formData.get('displayName')
  const bio = formData.get('bio')
  const avatar = formData.get('avatar')

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        username,
        display_name: displayName,
        bio,
        avatar,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error

    revalidatePath('/dashboard/profile')
    revalidatePath(`/${username}`)
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Server Action: Save custom link
 */
export async function saveCustomLinkAction(formData) {
  const profileId = formData.get('profileId')
  const linkId = formData.get('linkId')
  const title = formData.get('title')
  const url = formData.get('url')
  const icon = formData.get('icon')
  const thumbnail = formData.get('thumbnail')
  const active = formData.get('active') === 'true'

  try {
    const linkData = {
      profile_id: profileId,
      title,
      url,
      icon,
      thumbnail,
      active,
      updated_at: new Date().toISOString(),
    }

    if (linkId) {
      linkData.id = linkId
    }

    const { data, error } = await supabase
      .from('custom_links')
      .upsert(linkData)

    if (error) throw error

    revalidatePath('/dashboard/links')
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Server Action: Delete custom link
 */
export async function deleteCustomLinkAction(linkId) {
  try {
    const { error } = await supabase
      .from('custom_links')
      .delete()
      .eq('id', linkId)

    if (error) throw error

    revalidatePath('/dashboard/links')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Server Action: Save product
 */
export async function saveProductAction(formData) {
  const profileId = formData.get('profileId')
  const productId = formData.get('productId')
  const title = formData.get('title')
  const description = formData.get('description')
  const price = formData.get('price')
  const currency = formData.get('currency')
  const image = formData.get('image')
  const url = formData.get('url')
  const brand = formData.get('brand')
  const active = formData.get('active') === 'true'

  try {
    const productData = {
      profile_id: profileId,
      title,
      description,
      price: parseFloat(price) || 0,
      currency,
      image,
      url,
      brand,
      active,
      updated_at: new Date().toISOString(),
    }

    if (productId) {
      productData.id = productId
    }

    const { data, error } = await supabase
      .from('products')
      .upsert(productData)

    if (error) throw error

    revalidatePath('/dashboard/products')
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Server Action: Delete product
 */
export async function deleteProductAction(productId) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) throw error

    revalidatePath('/dashboard/products')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Server Action: Save design settings
 */
export async function saveDesignAction(formData) {
  const profileId = formData.get('profileId')
  const theme = formData.get('theme')
  const wallpaper = formData.get('wallpaper')
  const wallpaperImage = formData.get('wallpaperImage')
  const wallpaperVideo = formData.get('wallpaperVideo')
  const wallpaperTint = formData.get('wallpaperTint')
  const buttonStyle = formData.get('buttonStyle')
  const fontFamily = formData.get('fontFamily')
  const hideVizitlinkFooter = formData.get('hideVizitlinkFooter') === 'true'

  try {
    const { data, error } = await supabase
      .from('designs')
      .upsert({
        profile_id: profileId,
        theme,
        wallpaper,
        wallpaper_image: wallpaperImage,
        wallpaper_video: wallpaperVideo,
        wallpaper_tint: wallpaperTint,
        button_style: buttonStyle,
        font_family: fontFamily,
        hide_vizitlink_footer: hideVizitlinkFooter,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error

    revalidatePath('/dashboard/design')
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

