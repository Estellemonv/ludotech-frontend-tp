import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule, MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [Header, RouterOutlet, MatSidenavModule,
    MatListModule, MatNavList, MatIcon, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  
collapsed = false;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}
