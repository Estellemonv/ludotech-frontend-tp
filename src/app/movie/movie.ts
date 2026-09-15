import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Movie as MovieModel } from '../shared/model/Movie';
import { MovieService } from '../shared/service/movie-service';
import { DeleteMovieDialog } from './delete-movie-dialog/delete-movie-dialog';
import { MovieForm } from './movie-form/movie-form';

@Component({
  selector: 'app-movie',
  imports: [FormsModule, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatTableModule],
  templateUrl: './movie.html',
  styleUrl: './movie.css',
})
export class Movie implements OnInit {
  displayedColumns = ['name', 'duration', 'realisateur', 'genre', 'status', 'actions'];
  dataSource = new MatTableDataSource<MovieModel>([]);

  private readonly dialog = inject(MatDialog);
  private readonly movieService = inject(MovieService);

  ngOnInit(): void {
    this.loadMovies();
    this.dataSource.filterPredicate = (movie, filter) =>
      movie.name.toLowerCase().includes(filter) ||
      movie.realisateur.toLowerCase().includes(filter) ||
      movie.genre.toLowerCase().includes(filter) ||
      movie.status.toLowerCase().includes(filter);
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openForm(movie: MovieModel | null = null): void {
    this.dialog.open(MovieForm, {
      width: '600px',
      disableClose: true,
      data: { movie, isEdit: movie !== null },
    }).afterClosed().subscribe((saved) => {
      if (saved) this.loadMovies();
    });
  }

  deleteMovie(movie: MovieModel): void {
    this.dialog.open(DeleteMovieDialog, {
      width: '420px',
      disableClose: true,
      data: movie.name,
    }).afterClosed().subscribe((deleted) => {
      if (deleted) this.loadMovies();
    });
  }

  private loadMovies(): void {
    this.movieService.getMovies().subscribe({
      next: (movies) => this.dataSource.data = movies,
      error: (err) => console.error('Erreur lors du chargement des films', err),
    });
  }
}
