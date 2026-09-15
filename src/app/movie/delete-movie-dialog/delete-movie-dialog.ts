import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MovieService } from '../../shared/service/movie-service';

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
  isDeleting = false;

  confirm(): void {
    this.isDeleting = true;
    this.movieService.deleteMovie(this.movieName).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => { this.isDeleting = false; console.error('Erreur lors de la suppression du film', err); },
    });
  }

  cancel(): void { if (!this.isDeleting) this.dialogRef.close(false); }
}