import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { Note } from '../types/note'

const API_BASE = 'https://notehub-public.goit.study/api'

const token = import.meta.env.VITE_NOTEHUB_TOKEN

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

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search } = params
  const res: AxiosResponse<any> = await instance.get('/notes', {
    params: { page, perPage, search },
  })

  return {
    data: (res.data.notes ?? []).map((n: any) => ({
      ...n,
      _id: n.id ?? n._id,
    })),
    total: res.data.totalPages ? res.data.totalPages * perPage : 0,
    page,
    perPage,
  }
}

export const createNote = async (
  payload: CreateNoteParams
): Promise<Note> => {
  const res: AxiosResponse<Note> = await instance.post('/notes', payload)
  return { ...res.data, _id: (res.data as any).id ?? (res.data as any)._id }
}

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const res: AxiosResponse<DeleteNoteResponse> = await instance.delete(
    `/notes/${id}`
  )
  return res.data
}
