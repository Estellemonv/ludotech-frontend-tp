import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Book } from '../shared/model/Book';
import { BookService } from '../shared/service/book-service';
import { BookForm } from './book-form/book-form';
import { DeleteBookDialog } from './delete-book-dialog/delete-book-dialog';

@Component({
  selector: 'app-book',
  imports: [FormsModule, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatTableModule],
  templateUrl: './book.html',
  styleUrl: './book.css',
  standalone: true
})
export class BookComponent implements OnInit {
  displayedColumns = ['book_name', 'author', 'year_of_parution', 'genre', 'status', 'actions'];
  dataSource = new MatTableDataSource<Book>([]);

  private readonly dialog = inject(MatDialog);
  private readonly bookService = inject(BookService);

  ngOnInit(): void {
    this.loadBooks();
    this.dataSource.filterPredicate = (book, filter) =>
      book.book_name.toLowerCase().includes(filter) ||
      book.author.toLowerCase().includes(filter) ||
      book.genre.toLowerCase().includes(filter) ||
      book.status.toLowerCase().includes(filter);
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openForm(book: Book | null = null): void {
    this.dialog.open(BookForm, {
      width: '600px',
      disableClose: true,
      data: { book, isEdit: book !== null },
    }).afterClosed().subscribe((saved) => {
      if (saved) this.loadBooks();
    });
  }

  deleteBook(book: Book): void {
    this.dialog.open(DeleteBookDialog, {
      width: '420px',
      disableClose: true,
      data: book.book_name,
    }).afterClosed().subscribe((deleted) => {
      if (deleted) this.loadBooks();
    });
  }

  private loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => this.dataSource.data = books,
      error: (err) => console.error('Erreur lors du chargement des livres', err),
    });
  }
}
