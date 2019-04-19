import {
  Component
} from '@angular/core';
import {
  LoginService
} from './services/login/login.service';
import {
  Router
} from '@angular/router';
import {
  User
} from './Entities/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Student Onboarding';
  currentUser: User;
  constructor(private loginService: LoginService, private router: Router) {
    this.loginService.currentUser.subscribe(x => this.currentUser = x);
  }
  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
