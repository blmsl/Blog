import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MatSnackBar } from '@angular/material';

import { AuthenticationService } from 'app/_services/authentication.service';

// pg 225 Angular 2 Development with Typescript
function equalValidator({value}: FormGroup): {[key: string]: any} {
  const [first, ...rest] = Object.keys(value || {});
  const valid = rest.every(v => value[v] === value[first]);
  return valid ? null : {equal: true};
}

@Component({
  selector: 'app-register',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss']
})
export class RegisterModalComponent {

  title = 'Register';
  public registerGroup: FormGroup;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private auth: AuthenticationService,
    private dialogRef: MatDialogRef<RegisterModalComponent>,
    private snackBar: MatSnackBar
  ) {
    this.registerGroup = fb.group({
      'username': new FormControl('', Validators.required),
      'email': new FormControl('', Validators.required),
      'name': new FormControl('', Validators.required),
      'passwordsGroup': fb.group({
        'password': new FormControl('', Validators.required),
        'confirmPassword': new FormControl(''),
      }, {validator: equalValidator})
    });
  }

  register(formValue: any, isFormValid: boolean) {
    if (isFormValid) {
      const username = formValue.username;
      const password = formValue.passwordsGroup.password;

      const email = formValue.email;
      const name = formValue.name;

      this.auth.register(username, password, email, name)
        .subscribe(result => {
          if (result === true) {
              this.dialogRef.close(name);
              this.router.navigate(['articles']);
          } else {
            this.snackBar.open('Registration failed.', '', {
              duration: 4000
            });
          }
        }, error => {
          this.snackBar.open('Error! This username has already been selected', '', {
            duration: 4000
          });
        });
    }
  }
}
