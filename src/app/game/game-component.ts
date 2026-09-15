import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GameService } from '../shared/service/game-service';
import { Game } from '../shared/model/Game';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GameForm } from './game-form/game-form';
import { MatCardModule } from '@angular/material/card';
import { DeleteGameDialog } from './delete-game-dialog/delete-game-dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [MatTableModule,  MatInputModule,
    FormsModule, MatIcon, MatDialogModule, MatCardModule, MatButtonModule],
  templateUrl: './game.html',
  styleUrl: './game.css',
})


export class GameComponent implements OnInit{
  displayedColumns: string[] = ['gameName', 'numberOfPlayers', 'timeOfGame', 'status', 'actions'];
  dataSource = new MatTableDataSource<Game>([]);

   private readonly dialog = inject(MatDialog);
   private readonly gameService = inject(GameService)

  ngOnInit(): void {
    this.loadGames();

    this.dataSource.filterPredicate = (game: Game, filter: string) => {
    const search = filter.toLowerCase();

      return (
        game.gameName.toLowerCase().includes(search) ||
        game.status.toLowerCase().includes(search)
      );
    };
  }

   private loadGames(): void {
    this.gameService.getGames().subscribe({
      next: (games) => {
        this.dataSource.data = games;
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

  editGame(game: Game): void {
  const dialogRef = this.dialog.open(GameForm, {
      width: '600px',
      disableClose: true,
      data: {
        game: game,
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

  AddGame(game: Game | null = null): void {

    const dialogRef = this.dialog.open(GameForm, {
      width: '600px',
      disableClose: true,
      data: {
        game: game,
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


  deleteGame(game: Game): void {
    const dialogRef = this.dialog.open(DeleteGameDialog, {
      width: '420px',
      disableClose: true,
      data: game.gameName,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loadGames();
      }
    });
  }
}
