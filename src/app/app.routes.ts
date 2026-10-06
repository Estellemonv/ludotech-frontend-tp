import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Layout } from './layout/layout';
import { BookComponent } from './book/book-component';
import { GameComponent } from './game/game-component';
import { MovieComponent } from './movie/movie-component';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Home
      },
      {
        path: 'book',
        component: BookComponent
      },
      {
        path: 'game',
        component: GameComponent
      },
      {
        path: 'movie',
        component: MovieComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
