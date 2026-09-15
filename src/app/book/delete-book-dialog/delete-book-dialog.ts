import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BookService } from '../../shared/service/book-service';

@Component({
  selector: 'app-delete-book-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './delete-book-dialog.html',
  styleUrl: './delete-book-dialog.css',
})
export class DeleteBookDialog {
  readonly bookName = inject<string>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DeleteBookDialog>);
  private readonly bookService = inject(BookService);
  isDeleting = false;

  confirm(): void {
    this.isDeleting = true;
    this.bookService.deleteBook(this.bookName).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => { this.isDeleting = false; console.error('Erreur lors de la suppression du livre', err); },
    });
  }

  cancel(): void { if (!this.isDeleting) this.dialogRef.close(false); }
}