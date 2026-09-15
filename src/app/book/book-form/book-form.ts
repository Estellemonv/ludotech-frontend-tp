import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Book } from '../../shared/model/Book';
import { BookService } from '../../shared/service/book-service';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css',
})
export class BookForm {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<BookForm>);
  private readonly bookService = inject(BookService);
  readonly data = inject<{ book: Book | null; isEdit: boolean }>(MAT_DIALOG_DATA);
  readonly form = this.fb.nonNullable.group({
    book_name: [this.data.book?.book_name ?? '', Validators.required],
    author: [this.data.book?.author ?? '', Validators.required],
    year_of_parution: [this.data.book?.year_of_parution ?? '', Validators.required],
    genre: [this.data.book?.genre ?? '', Validators.required],
    status: [this.data.book?.status ?? '', Validators.required],
  });

  save(): void {
    if (this.form.invalid) return;
    const book = this.form.getRawValue();
    const request = this.data.isEdit
      ? this.bookService.updateBook(this.data.book!.book_name, book)
      : this.bookService.createBook(book);
    request.subscribe({ next: (saved) => this.dialogRef.close(saved), error: (err) => console.error('Erreur lors de l’enregistrement du livre', err) });
  }

  cancel(): void { this.dialogRef.close(); }
}