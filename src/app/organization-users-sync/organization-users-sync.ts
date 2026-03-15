import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { OrganizacionService } from '../services/organizacion.service';
import { Usuario } from '../models/usuario.model';
import { Organizacion } from '../models/organizacion.model';

@Component({
  selector: 'app-organization-users-sync',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organization-users-sync.html',
  styleUrls: ['./organization-users-sync.css'],
})
export class OrganizationUsersSyncComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private organizacionService = inject(OrganizacionService);

  @Input({ required: true }) organization!: Organizacion;
  @Output() usersUpdated = new EventEmitter<void>();

  allUsers: Usuario[] = [];
  selectedUserId = '';
  saving = false;
  errorMsg = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (users) => {
        this.allUsers = users;
      },
      error: () => {
        this.errorMsg = 'No se han podido cargar los usuarios.';
      },
    });
  }

  get linkedUsers(): Usuario[] {
    return this.organization.users ?? [];
  }

  get linkedUserIds(): string[] {
    return this.linkedUsers.map((u) => u._id);
  }

  get availableUsers(): Usuario[] {
    return this.allUsers.filter((u) => !this.linkedUserIds.includes(u._id));
  }

  addUser(): void {
    if (!this.selectedUserId) return;

    const updatedIds = [...this.linkedUserIds, this.selectedUserId];
    this.persist(updatedIds);
  }

  removeUser(userId: string): void {
    const updatedIds = this.linkedUserIds.filter((id) => id !== userId);
    this.persist(updatedIds);
  }

  private persist(userIds: string[]): void {
    this.saving = true;
    this.errorMsg = '';

    this.organizacionService.updateUsuariosOrganizacion(this.organization._id, userIds).subscribe({
      next: () => {
        this.selectedUserId = '';
        this.saving = false;
        this.usersUpdated.emit();
      },
      error: () => {
        this.errorMsg = 'No se ha podido sincronizar la organización.';
        this.saving = false;
      },
    });
  }
}