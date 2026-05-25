import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-voir',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf],
  templateUrl: './voir.component.html',
  styleUrl: './voir.component.css',
})
export class VoirComponent {
  @Input({ required: true }) link!: any[];
  @Input() title = 'Voir';
  @Input() size: 'sm' | 'md' = 'sm';
  @Input() variant: 'light' | 'outline' | 'primary' = 'outline';
  @Input() showText = false;
}
