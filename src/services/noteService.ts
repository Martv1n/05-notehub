import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { Note } from '../types/note'

const API_BASE = 'https://notehub-public.goit.study/api'

const token = import.meta.env.VITE_NOTEHUB_TOKEN

if (!token) {
  console.error('❌ VITE_NOTEHUB_TOKEN is NOT set. Check your .env file!')
} else {
  console.log('✅ Loaded token from .env:', token.slice(0, 10) + '...')
}

const instance = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})

export interface FetchNotesParams {
  page?: number
  perPage?: number
  search?: string
}

export interface FetchNotesResponse {
  data: Note[]
  total: number
  page: number
  perPage: number
}

export interface CreateNoteParams {
  title: string
  content?: string
  tag: Note['tag']
}

export interface DeleteNoteResponse {
  deletedCount: number
}

// --- API функції ---

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search } = params
  try {
    const res: AxiosResponse<any> = await instance.get('/notes', {
      params: { page, perPage, search },
    })

    console.log('📥 API /notes response (raw):', res.data)

    const adapted: FetchNotesResponse = {
      data: (res.data.notes ?? []).map((n: any) => ({
        ...n,
        _id: n.id ?? n._id, // ⚡ гарантуємо наявність _id
      })),
      total: res.data.totalPages ? res.data.totalPages * perPage : 0,
      page,
      perPage,
    }

    console.log('✅ Adapted response for frontend:', adapted)
    return adapted
  } catch (error: any) {
    console.error('❌ Error fetching notes:', error.response ?? error)
    return { data: [], total: 0, page, perPage }
  }
}

export const createNote = async (
  payload: CreateNoteParams
): Promise<Note> => {
  try {
    const res: AxiosResponse<Note> = await instance.post('/notes', payload)
    const adapted = { ...res.data, _id: (res.data as any).id ?? (res.data as any)._id }
    console.log('✅ Note created:', adapted)
    return adapted
  } catch (error: any) {
    console.error('❌ Error creating note:', error.response ?? error)
    throw error
  }
}

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  console.log('🟡 Deleting note with id:', id)
  try {
    const res: AxiosResponse<DeleteNoteResponse> = await instance.delete(
      `/notes/${id}`
    )
    console.log('🗑️ Note deleted:', res.data)
    return res.data
  } catch (error: any) {
    console.error('❌ Error deleting note:', error.response ?? error)
    throw error
  }
}
