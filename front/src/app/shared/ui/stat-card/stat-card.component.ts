import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: number;

  @Input() iconClass = 'bi bi-info-circle';
  @Input() bgToneClass = 'bg-primary';
  @Input() textToneClass = 'text-primary';

  @Input() noteText = '';
  @Input() noteIconClass = 'bi bi-info-circle';
  @Input() noteClass = 'text-muted';
}
