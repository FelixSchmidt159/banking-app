import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth-service';
import {UserData} from '../api/Api';
import {Router} from '@angular/router';
import {UserService} from '../services/user-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  invalid: boolean;

  constructor(private fb: FormBuilder, private authService: AuthService, private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe(async (data: UserData) => {
        sessionStorage.setItem('user', JSON.stringify(data));
        await this.router.navigateByUrl('/user').then(() => {
        });
      }, error => {
        this.invalid = true;
        console.log(error);
      });
    }
  }

  close(): void {
    this.invalid = false;
  }
}


