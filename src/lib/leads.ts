import { supabase } from './supabase'

export type LeadType = 'contact' | 'test_drive' | 'sell'

export type Lead = {
  id: string
  type: LeadType
  name: string
  phone: string
  email: string | null
  message: string | null
  car_slug: string | null
  created_at: string
}

export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as Lead[]
}

export async function deleteLead(id: string) {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}