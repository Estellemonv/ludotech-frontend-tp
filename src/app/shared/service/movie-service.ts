import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../model/Movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly apiUrl = 'http://localhost:8080/movie';
  private readonly http = inject(HttpClient);

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  createMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie);
  }

  updateMovie(movieName: string, movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${encodeURIComponent(movieName)}`, movie);
  }

  deleteMovie(movieName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(movieName)}`);
  }
}