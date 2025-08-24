import {Component, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {CommonModule, isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  name: string | null = null;
  isLoggedin = signal<boolean>(false);
  constructor(private authService: AuthService,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.name = sessionStorage.getItem('name');   // ✅ only in browser
      this.isLoggedin = this.authService.getLoggedIn();
    }
  }

  getName(): string|null {
    return sessionStorage.getItem('name');
  }

  logout() {
    this.authService.logout();
    this.authService.setLoggedIn(false);
    this.router.navigate(['login']);
  }

  isAdmin():boolean{
    return this.authService.hasRole('ADMIN');
  }



}
