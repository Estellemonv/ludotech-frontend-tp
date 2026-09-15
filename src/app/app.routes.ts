import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Layout } from './layout/layout';
import { BookComponent } from './book/book';
import { GameComponent } from './game/game-component';
import { Movie } from './movie/movie';

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
        component: Movie
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
