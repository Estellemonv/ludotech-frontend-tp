import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Book } from '../../shared/model/Book';
import { BookService } from '../../shared/service/book-service';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, MatSelectModule, MatCardModule, MatSnackBarModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
  standalone: true
})
export class BookForm {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<BookForm>);
  private readonly bookService = inject(BookService);
  private readonly snackBar = inject(MatSnackBar);
  readonly data = inject<{ book: Book | null; isEdit: boolean }>(MAT_DIALOG_DATA);

  book = this.data.book;
  isEdit = this.data.isEdit;


  readonly form = this.fb.nonNullable.group({
    bookName: ['', Validators.required],
    author: ['', Validators.required],
    yearOfParution: ['', Validators.required],
    genre: ['', Validators.required],
    status: ['', Validators.required],
  });

  constructor() {
    if (this.book) {
      this.form.patchValue({
        bookName: this.book.bookName,
        yearOfParution: this.book.yearOfParution,
        genre: this.book.genre,
        status: this.book.status
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const newBook = this.form.getRawValue();
    if (!this.isEdit) {
      this.bookService.createBook(newBook).subscribe({
      next: (createdBook) => {
        this.snackBar.open(
        '✅ Livre créé avec succès !',
        'Fermer',
        {
          duration: 3000,
          panelClass: ['success-snackbar']
        }
      );
        // Ferme la dialog en renvoyant le jeu créé
        this.dialogRef.close(createdBook);
      },
      error: (err) => {
        this.snackBar.open(
        err.error?.message ?? '❌ Impossible de créer le livre',
        'Fermer',
        {
          panelClass: ['error-snackbar']
        }
      );
        console.error('Erreur lors de la création du livre', err);
        // Afficher un message d'erreur si besoin
      }});
    }
    else {
      this.bookService.updateBook(newBook.bookName, newBook).subscribe({
      next: (createdBook) => {
        this.snackBar.open(
        '✅ Livre mis à jour',
        'Fermer',
        {
          duration: 3000,
          panelClass: ['success-snackbar']
        }
      );
        // Ferme la dialog en renvoyant le jeu créé
        this.dialogRef.close(createdBook);
      },
      error: (err) => {
        this.snackBar.open(
        err.error?.message ?? '❌ Impossible de modifier le livre',
        'Fermer',
        {
          panelClass: ['error-snackbar']
        }
      );
        console.error('Erreur lors de la création du livre', err);
        // Afficher un message d'erreur si besoin
      }});
    }
    
  }

  cancel(): void { this.dialogRef.close(); }
}