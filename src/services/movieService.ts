import axios from "axios";
import type { FetchMoviesResponse } from "../types/movie";

export async function fetchMovies(
  query: string,
  page: number
): Promise<FetchMoviesResponse> {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  if (!token) {
    throw new Error("Missing VITE_TMDB_TOKEN");
  }

  const response = await axios.get<FetchMoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
