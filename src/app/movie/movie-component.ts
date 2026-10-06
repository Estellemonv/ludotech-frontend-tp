import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Movie, Movie as MovieModel } from '../shared/model/Movie';
import { MovieService } from '../shared/service/movie-service';
import { DeleteMovieDialog } from './delete-movie-dialog/delete-movie-dialog';
import { MovieForm } from './movie-form/movie-form';

@Component({
  selector: 'app-movie',
  imports: [FormsModule, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatTableModule],
  templateUrl: './movie.html',
  styleUrl: './movie.css',
})
export class MovieComponent implements OnInit {
  displayedColumns = ['name', 'duration', 'realisateur', 'genre', 'status', 'actions'];
  dataSource = new MatTableDataSource<MovieModel>([]);

  private readonly dialog = inject(MatDialog);
  private readonly movieService = inject(MovieService);

  ngOnInit(): void {
    this.loadMovies();

    this.dataSource.filterPredicate = (movie: Movie, filter: string) => {
    const search = filter.toLowerCase();

      return (
        movie.name.toLowerCase().includes(search) ||
        movie.status.toLowerCase().includes(search)
      );
    };
  }

   private loadGames(): void {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.dataSource.data = movies;
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

  editGame(movie: Movie): void {
  const dialogRef = this.dialog.open(MovieForm, {
      width: '600px',
      disableClose: true,
      data: {
        movie: movie,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.loadGames();
      }
    });
  }

  AddGame(movie: Movie | null = null): void {

    const dialogRef = this.dialog.open(MovieForm, {
      width: '600px',
      disableClose: true,
      data: {
        movie: movie,
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.loadGames();
      }
    });

  }


  deleteGame(movie: Movie): void {
    const dialogRef = this.dialog.open(DeleteMovieDialog, {
      width: '420px',
      disableClose: true,
      data: movie.name,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loadGames();
      }
    });
  }
}
