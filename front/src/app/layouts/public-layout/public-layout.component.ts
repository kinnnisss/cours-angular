import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent as HeaderPublicComponent } from './header.component';
@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet,HeaderPublicComponent],
  
  template: `
   <app-header-public></app-header-public>
  <router-outlet></router-outlet>`
})
export class PublicLayoutComponent {}
