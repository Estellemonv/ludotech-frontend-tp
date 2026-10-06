import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BookService } from '../../shared/service/book-service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private readonly snackBar = inject(MatSnackBar);

  
  isDeleting = false;

  confirm(): void {
    this.isDeleting = true;
    this.bookService.deleteBook(this.bookName).subscribe({
      next: () => {
        this.snackBar.open(
        '✅ Livre supprimé avec succès !',
        'Fermer',
        {
          duration: 3000,
          panelClass: ['success-snackbar']
        }
      );
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(
        err.error?.message ?? '❌ Impossible de supprimer le Livre',
        'Fermer',
        {
          panelClass: ['error-snackbar']
        }
      );
        this.isDeleting = false;
        console.error('Erreur lors de la suppression', err);
      },
    });
  }

  cancel(): void { if (!this.isDeleting) this.dialogRef.close(false); }
}