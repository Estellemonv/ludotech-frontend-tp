import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Movie } from '../../shared/model/Movie';
import { MovieService } from '../../shared/service/movie-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-form',
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './movie-form.html',
  styleUrl: './movie-form.css',
})
export class MovieForm {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<MovieForm>);
  private readonly movieService = inject(MovieService);
  private readonly snackBar = inject(MatSnackBar);
  readonly data = inject<{ movie: Movie | null; isEdit: boolean }>(MAT_DIALOG_DATA);
  
  movie = this.data.movie;
  isEdit = this.data.isEdit;
  
  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    duration: ['', Validators.required],
    realisateur: ['', Validators.required],
    genre: ['', Validators.required],
    status: ['', Validators.required],
  });

   constructor() {
    if (this.movie) {
      this.form.patchValue({
        name: this.movie.name,
        duration: this.movie.duration,
        realisateur: this.movie.realisateur,
        genre: this.movie.genre,
        status: this.movie.status
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const newMovie = this.form.getRawValue();
    if (!this.isEdit) {
      this.movieService.createMovie(newMovie).subscribe({
      next: (createdMovie) => {
        this.snackBar.open(
        '✅ Livre créé avec succès !',
        'Fermer',
        {
          duration: 3000,
          panelClass: ['success-snackbar']
        }
      );
        // Ferme la dialog en renvoyant le jeu créé
        this.dialogRef.close(createdMovie);
      },
      error: (err) => {
        this.snackBar.open(
        err.error?.message ?? '❌ Impossible de créer le film',
        'Fermer',
        {
          panelClass: ['error-snackbar']
        }
      );
        console.error('Erreur lors de la création du film', err);
        // Afficher un message d'erreur si besoin
      }});
    }
    else {
      this.movieService.updateMovie(newMovie.name, newMovie).subscribe({
      next: (createdMovie) => {
        this.snackBar.open(
        '✅ Film mis à jour',
        'Fermer',
        {
          duration: 3000,
          panelClass: ['success-snackbar']
        }
      );
        // Ferme la dialog en renvoyant le jeu créé
        this.dialogRef.close(createdMovie);
      },
      error: (err) => {
        this.snackBar.open(
        err.error?.message ?? '❌ Impossible de modifier le film',
        'Fermer',
        {
          panelClass: ['error-snackbar']
        }
      );
        console.error('Erreur lors de la création du film', err);
        // Afficher un message d'erreur si besoin
      }});
    }
    
  }

  cancel(): void { this.dialogRef.close(); }
}