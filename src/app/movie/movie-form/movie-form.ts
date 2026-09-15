import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Movie } from '../../shared/model/Movie';
import { MovieService } from '../../shared/service/movie-service';

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
  readonly data = inject<{ movie: Movie | null; isEdit: boolean }>(MAT_DIALOG_DATA);
  readonly form = this.fb.nonNullable.group({
    name: [this.data.movie?.name ?? '', Validators.required],
    duration: [this.data.movie?.duration ?? '', Validators.required],
    realisateur: [this.data.movie?.realisateur ?? '', Validators.required],
    genre: [this.data.movie?.genre ?? '', Validators.required],
    status: [this.data.movie?.status ?? '', Validators.required],
  });

  save(): void {
    if (this.form.invalid) return;
    const movie = this.form.getRawValue();
    const request = this.data.isEdit
      ? this.movieService.updateMovie(this.data.movie!.name, movie)
      : this.movieService.createMovie(movie);
    request.subscribe({ next: (saved) => this.dialogRef.close(saved), error: (err) => console.error('Erreur lors de l’enregistrement du film', err) });
  }

  cancel(): void { this.dialogRef.close(); }
}