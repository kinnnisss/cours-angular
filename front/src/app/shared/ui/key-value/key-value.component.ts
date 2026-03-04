import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

export type KeyValueItem = { label: string; value: any };

@Component({
  selector: 'app-key-value',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="kv">
      <div class="row-item" *ngFor="let item of items">
        <div class="label">{{ item.label }}</div>
        <div class="value">{{ safe(item.value) }}</div>
      </div>
    </div>
  `,
  styles: [`
    .kv{ display:grid; gap:.5rem; }
    .row-item{ display:grid; grid-template-columns: 140px 1fr; gap:.75rem; }
    .label{ color:#6c757d; font-size:.9rem; }
    .value{ font-weight:700; }
  `]
})
export class KeyValueComponent {
  @Input({ required: true }) items: KeyValueItem[] = [];
  safe(v: any): string { return (v === null || v === undefined || v === '') ? '—' : String(v); }
}