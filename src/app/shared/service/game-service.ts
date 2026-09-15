import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../model/Game';
import { StringLiteral } from 'typescript';

@Injectable({
  providedIn: 'root',
})
export class GameService {
   private readonly apiUrl = 'http://localhost:8080/game';

  constructor(private http: HttpClient) {}

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl);
  }

  createGame(game: Game): Observable<Game> {
    return this.http.post<Game>(this.apiUrl, game);
  }

  updateGame(gameName: string, game: Game): Observable<Game> {
    return this.http.put<Game>(`${this.apiUrl}/${gameName}`, game);
  }

  deleteGame(gameName: string): Observable<Game> {
    return this.http.delete<Game>(`${this.apiUrl}/${gameName}`);
  }

}
