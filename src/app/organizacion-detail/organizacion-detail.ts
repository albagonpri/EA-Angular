import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrganizacionService } from '../services/organizacion.service';
import { Organizacion } from '../models/organizacion.model';

@Component({
  selector: 'app-organizacion-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './organizacion-detail.html',
  styleUrls: ['./organizacion-detail.css']
})
export class OrganizacionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private organizacionService = inject(OrganizacionService);

  organizacion: Organizacion | null = null;
  loading = true;
  errorMsg = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMsg = 'No se ha encontrado la organización.';
      this.loading = false;
      return;
    }

    this.organizacionService.getOrganizacionById(id).subscribe({
      next: (data) => {
        this.organizacion = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Error al cargar la organización.';
        this.loading = false;
      }
    });
  }
}