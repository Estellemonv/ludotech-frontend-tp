import { Component, inject } from '@angular/core';
import { Game } from '../../shared/model/Game';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { GameService } from '../../shared/service/game-service';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-game-form',
  imports: [ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, MatSelectModule, MatCardModule, MatIcon, MatSnackBarModule],
  templateUrl: './game-form.html',
  styleUrl: './game-form.css',
  standalone: true
})
export class GameForm {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<GameForm>);
  private readonly gameService = inject(GameService);
  private readonly snackBar = inject(MatSnackBar);
  readonly data = inject<{game: Game;isEdit: boolean;}>(MAT_DIALOG_DATA);

  game = this.data.game;
  isEdit = this.data.isEdit;


  readonly form = this.fb.nonNullable.group({
    gameName: ['', Validators.required],
    numberOfPlayers: ['', Validators.required],
    timeOfGame: ['', Validators.required],
    status: ['', Validators.required]
  });


  constructor() {
    if (this.game) {
      this.form.patchValue({
        gameName: this.game.gameName,
        numberOfPlayers: this.game.numberOfPlayers,
        timeOfGame: this.game.timeOfGame,
        status: this.game.status
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const newGame = this.form.getRawValue();
    if (!this.isEdit) {
      this.gameService.createGame(newGame).subscribe({
      next: (createdGame) => {
        this.snackBar.open(
        '✅ Jeu créé avec succès !',
        'Fermer',
        {
          duration: 3000,
          panelClass: ['success-snackbar']
        }
      );
        // Ferme la dialog en renvoyant le jeu créé
        this.dialogRef.close(createdGame);
      },
      error: (err) => {
        this.snackBar.open(
        err.error?.message ?? '❌ Impossible de créer le jeu',
        'Fermer',
        {
          panelClass: ['error-snackbar']
        }
      );
        console.error('Erreur lors de la création du jeu', err);
        // Afficher un message d'erreur si besoin
      }});
    }
    else {
      this.gameService.updateGame(newGame.gameName, newGame).subscribe({
      next: (createdGame) => {
        this.snackBar.open(
        '✅ Jeu mis à jour',
        'Fermer',
        {
          duration: 3000,
          panelClass: ['success-snackbar']
        }
      );
        // Ferme la dialog en renvoyant le jeu créé
        this.dialogRef.close(createdGame);
      },
      error: (err) => {
        this.snackBar.open(
        err.error?.message ?? '❌ Impossible de modifier le jeu',
        'Fermer',
        {
          panelClass: ['error-snackbar']
        }
      );
        console.error('Erreur lors de la création du jeu', err);
        // Afficher un message d'erreur si besoin
      }});
    }
    
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
