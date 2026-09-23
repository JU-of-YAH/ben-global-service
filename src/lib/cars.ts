import { supabase } from './supabase'

export type Car = {
  id: string
  slug: string
  marque: string
  modele: string
  annee: number | null
  prix: number | null
  kilometrage: number | null
  carburant: string | null
  boite: string | null
  carrosserie: string | null
  places: number | null
  couleur: string | null
  ville: string | null
  description: string | null
  images: string[]
  equipements: string[]
  disponible: boolean
  created_at: string
  updated_at: string
}

export async function getCars() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as Car[]
}

export async function getAvailableCars() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('disponible', true)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as Car[]
}
export type CreateCarInput = {
  marque: string
  modele: string
  annee: number | null
  prix: number | null
  kilometrage: number | null
  carburant: string | null
  boite: string | null
  carrosserie: string | null
  places: number | null
  couleur: string | null
  ville: string
  description: string
  equipements: string[]
  disponible: boolean
}

function createSlug(marque: string, modele: string) {
  const base = `${marque}-${modele}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${base}-${Date.now()}`
}

export async function createCar(input: CreateCarInput) {
  const slug = createSlug(input.marque, input.modele)

  const { data, error } = await supabase
    .from('cars')
    .insert({
      slug,
      marque: input.marque,
      modele: input.modele,
      annee: input.annee,
      prix: input.prix,
      kilometrage: input.kilometrage,
      carburant: input.carburant,
      boite: input.boite,
      carrosserie: input.carrosserie,
      places: input.places,
      couleur: input.couleur,
      ville: input.ville,
      description: input.description,
      images: [],
      equipements: input.equipements,
      disponible: input.disponible,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Car
}
export async function updateCarImages(
  carId: string,
  images: string[],
) {
  const { data, error } = await supabase
    .from('cars')
    .update({
      images,
    })
    .eq('id', carId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Car
}
export async function updateCar(
  id: string,
  input: Partial<CreateCarInput>,
) {
  const { data, error } = await supabase
    .from('cars')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Car
}

export async function deleteCar(id: string) {
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}