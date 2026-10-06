import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MovieService } from '../../shared/service/movie-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-movie-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './delete-movie-dialog.html',
  styleUrl: './delete-movie-dialog.css',
})
export class DeleteMovieDialog {
  readonly movieName = inject<string>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DeleteMovieDialog>);
  private readonly movieService = inject(MovieService);
  private readonly snackBar = inject(MatSnackBar);


  isDeleting = false;

  confirm(): void {
    this.isDeleting = true;
    this.movieService.deleteMovie(this.movieName).subscribe({
      next: () => {
        this.snackBar.open(
        '✅ Film supprimé avec succès !',
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
        err.error?.message ?? '❌ Impossible de supprimer le Film',
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