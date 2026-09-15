import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GameService } from '../../shared/service/game-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-game-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatSnackBarModule],
  templateUrl: './delete-game-dialog.html',
  styleUrl: './delete-game-dialog.css',
})
export class DeleteGameDialog {
  readonly gameName = inject<string>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DeleteGameDialog>);
  private readonly gameService = inject(GameService);
  private readonly snackBar = inject(MatSnackBar);

  isDeleting = false;

  confirm(): void {
    this.isDeleting = true;
    this.gameService.deleteGame(this.gameName).subscribe({
      next: () => {
        this.snackBar.open(
        '✅ Jeu supprimé avec succès !',
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
        err.error?.message ?? '❌ Impossible de supprimer le jeu',
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

  cancel(): void {
    if (this.isDeleting) {
      return;
    }

    this.dialogRef.close(false);
  }
}