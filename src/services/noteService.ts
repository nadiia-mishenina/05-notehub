import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note, NoteTag } from '../types/note';

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
  totalItems?: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNoteResponse {
  note: Note;
}

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await api.get('/notes', {
    params: {
      page: params.page,
      perPage: params.perPage,
      ...(params.search ? { search: params.search } : {}),
    },
  });
  return response.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.post('/notes', payload);
  return response.data;
};

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const response: AxiosResponse<DeleteNoteResponse> = await api.delete(
    `/notes/${id}`
  );
  return response.data;
};