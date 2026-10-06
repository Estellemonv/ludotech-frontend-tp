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
      this.loadBook();
  
      this.dataSource.filterPredicate = (book: Book, filter: string) => {
      const search = filter.toLowerCase();
  
        return (
          book.bookName.toLowerCase().includes(search) ||
          book.status.toLowerCase().includes(search)
        );
      };
    }
  
     private loadBook(): void {
      this.bookService.getBooks().subscribe({
        next: (books) => {
          this.dataSource.data = books;
        },
        error: (err) => {
          console.error('Erreur lors du chargement', err);
        }
      });
    }
  
    applyFilter(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
    editBook(book: Book): void {
    const dialogRef = this.dialog.open(BookForm, {
        width: '600px',
        disableClose: true,
        data: {
          book: book,
          isEdit: true
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
          this.loadBook();
        }
      });
    }
  
    addBook(book: Book | null = null): void {
  
      const dialogRef = this.dialog.open(BookForm, {
        width: '600px',
        disableClose: true,
        data: {
          book: book,
          isEdit: false
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
          this.loadBook();
        }
      });
  
    }
  
  
    deleteBook(book: Book): void {
      const dialogRef = this.dialog.open(DeleteBookDialog, {
        width: '420px',
        disableClose: true,
        data: book.bookName,
      });
  
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.loadBook();
        }
      });
    }
}
