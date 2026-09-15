import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../model/Book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly apiUrl = 'http://localhost:8080/book';
  private readonly http = inject(HttpClient);

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(bookName: string, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${encodeURIComponent(bookName)}`, book);
  }

  deleteBook(bookName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(bookName)}`);
  }
}