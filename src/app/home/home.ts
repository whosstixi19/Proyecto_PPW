import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Programador } from '../models/user.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  programadores: Programador[] = [];
  loading = false;
  isAuthenticated = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    await this.loadProgramadores();
  }

  async loadProgramadores() {
    this.programadores = await this.userService.getProgramadores();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  isAdmin() {
    return this.authService.hasRole('admin');
  }

  isProgramador() {
    return this.authService.hasRole('programador');
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  goToAsesorias() {
    this.router.navigate(['/asesorias']);
  }
}
