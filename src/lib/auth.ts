import { supabase } from './supabase'

export async function signInAdmin(
  email: string,
  password: string,
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data.user) {
    throw new Error('Connexion impossible.')
  }

  const { data: admin, error: adminError } = await supabase
    .from('admin_accounts')
    .select('id, email, full_name, role, active')
    .eq('user_id', data.user.id)
    .eq('active', true)
    .maybeSingle()

  if (adminError) {
    await supabase.auth.signOut()
    throw new Error('Impossible de vérifier les droits administrateur.')
  }

  if (!admin) {
    await supabase.auth.signOut()
    throw new Error('Ce compte ne possède pas de droits administrateur.')
  }

  return {
    user: data.user,
    admin,
  }
}

export async function signOutAdmin() {
  await supabase.auth.signOut()
}

export async function getCurrentAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: admin, error } = await supabase
    .from('admin_accounts')
    .select('id, email, full_name, role, active')
    .eq('user_id', user.id)
    .eq('active', true)
    .maybeSingle()

  if (error || !admin) {
    return null
  }

  return {
    user,
    admin,
  }
}