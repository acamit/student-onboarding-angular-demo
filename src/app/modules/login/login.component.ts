import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  LoginService
} from '../../services/login/login.service';
import {
  LoginInfo
} from '../../DTO/loginInfo';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  first
} from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginInfo: LoginInfo = new LoginInfo();
  floatLabel: string = "auto";
  loading = false;
  submitted = false;
  returnUrl: string;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router, private _loginService: LoginService) {
    if (this._loginService.currentUserValue) {
      this.router.navigate(['/students']);
    }
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['nagarro', Validators.required],
      password: ['nagarro', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/students';
  }
  get loginDetails() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this._loginService.login(this.loginDetails.username.value, this.loginDetails.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.loading = false;
          this.errorMessage = error;
        });
  }
}
