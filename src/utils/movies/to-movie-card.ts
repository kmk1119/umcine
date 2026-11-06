import type { TmdbMovieListItem } from "../../api/movies/models";
import type { MovieCardModel } from "../../types/movie";
import { getTmdbPosterUrl } from "./tmdb-image";
export function toMovieCard(movie: TmdbMovieListItem): MovieCardModel {
  return {
    id: movie.id, title: movie.title, originalTitle: movie.original_title,
    releaseDate: movie.release_date, posterPath: getTmdbPosterUrl(movie.poster_path),
    overview: movie.overview,
  };
}
