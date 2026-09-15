import { Component, EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
   @Output() toggleMenu = new EventEmitter<void>();
}
