import { Component, OnInit } from '@angular/core';
import { SecurityService } from '@core/service/security.service';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-mes-informations',
  standalone: true,
  imports: [NgIf],
  templateUrl: './mes-informations.component.html',
  styleUrl: './mes-informations.component.css'
})
export class MesInformationsComponent implements OnInit {
  user: any = null;

  constructor(private readonly securityService: SecurityService) {}

  ngOnInit(): void {
    this.user = this.securityService.getCurrentUser();
  }
}
