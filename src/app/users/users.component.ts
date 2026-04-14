import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserPayload, UserResponse } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: UserResponse[] = [];
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  editingUserId: number | null = null;
  private readonly fb = inject(FormBuilder);

  editForm = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, Validators.minLength(8)]],
    role: ['PATIENT', [Validators.required]],
    actif: [true, [Validators.required]],
    profileCompleted: [false, [Validators.required]],
    password: ['']
  });

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load users. Admin access is required.';
        this.isLoading = false;
      }
    });
  }

  startEdit(user: UserResponse): void {
    this.editingUserId = user.id;
    this.successMessage = '';
    this.errorMessage = '';
    this.editForm.setValue({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      actif: user.actif,
      profileCompleted: user.profileCompleted,
      password: ''
    });
  }

  cancelEdit(): void {
    this.editingUserId = null;
    this.editForm.reset({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      role: 'PATIENT',
      actif: true,
      profileCompleted: false,
      password: ''
    });
  }

  saveEdit(): void {
    if (this.editingUserId === null) {
      return;
    }
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: UserPayload = this.editForm.getRawValue();
    this.userService.updateUser(this.editingUserId, payload).subscribe({
      next: () => {
        this.successMessage = 'User updated successfully.';
        this.isSaving = false;
        this.editingUserId = null;
        this.loadUsers();
      },
      error: (error) => {
        const status = error?.status;
        if (status === 409) {
          this.errorMessage = 'This email is already in use.';
        } else if (status === 403) {
          this.errorMessage = 'Admin privileges are required.';
        } else if (status === 400) {
          this.errorMessage = 'Please verify all fields before saving.';
        } else {
          this.errorMessage = 'Unable to update user.';
        }
        this.isSaving = false;
      }
    });
  }

  deleteUser(user: UserResponse): void {
    const confirmed = window.confirm(`Delete user ${user.prenom} ${user.nom}?`);
    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.successMessage = 'User deleted successfully.';
        this.loadUsers();
      },
      error: () => {
        this.errorMessage = 'Unable to delete user.';
      }
    });
  }

  confirmUser(user: UserResponse): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.userService.confirmUser(user.id).subscribe({
      next: () => {
        this.successMessage = `Confirmation email sent to ${user.email}.`;
        this.loadUsers();
      },
      error: (error) => {
        if (error?.status === 403) {
          this.errorMessage = 'Admin privileges are required.';
        } else {
          this.errorMessage = 'Unable to confirm user and send email.';
        }
      }
    });
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
