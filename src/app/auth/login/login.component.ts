import { Component, OnInit, OnDestroy, Renderer2, HostBinding, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
// import { config } from '@services/config';
// import { AppService } from '@services/app.service';
// import { ApiService } from '@services/api.service';
// import { CommonFunctionService } from '@services/common-function.service';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { config } from '../../services/config'
import { AppService } from '../../services/app.service';
import { ApiService } from '../../services/api.service';
import { CommonFunctionService } from '../../services/common-function.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatProgressBarModule } from '@angular/material/progress-bar';

// import { FeatherModule } from 'angular-feather';
// import { allIcons } from 'angular-feather/icons';
import { CurrencySymbolPipe } from '../../shared/currency-symbol.pipe';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FeatherModule } from 'angular-feather';
import { RouterModule } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  // imports: [],
  standalone: true,

  imports: [RouterModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatTabsModule,
    MatDialogModule,
    MatRadioModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    FeatherModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // http = inject(HttpClient); // Inject HttpClient using inject()
  apiservice = inject(ApiService);
  appService = inject(AppService);
  utilities = inject(CommonFunctionService);
  renderer = inject(Renderer2);

  @HostBinding('class') class = 'login-box';
  loginForm!: UntypedFormGroup;
  isGoogleLoading = false;
  isFacebookLoading = false;
  isAuthLoading = false;
  private loaderSubscriber!: Subscription;
  private apiSubscriber: Subscription[] = [];
  // str.substring(str.indexOf(":") + 1);
  siteUrl = (window.location.hostname).substring((window.location.hostname).indexOf(".") + 1);
  showOTPForm = false;
  qrCodeVisible = false;
  qrImgPath = '';
  qrMsg = '';

  passwordType = 'password';
  eyeType = 'eye';

  constructor() {
    if (localStorage.getItem('personalDetails')) { localStorage.removeItem('personalDetails') }
  }

  ngOnInit() {
    this.utilities.clearLocalVars();
    this.loaderSubscriber = this.apiservice.loaderService.loading$.subscribe((loading: any = {}) => {
      this.isAuthLoading = !!(('emailAuthApi' in loading || 'loginApi' in loading || 'getAdminMenuMappingsData' in loading || 'getUserSite' in loading));
    });
    this.renderer.addClass(document.querySelector('app-root'), 'login-page');
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl(null, Validators.required),
      password: new UntypedFormControl(null, Validators.required),
      otpnumber: new UntypedFormControl(null, Validators.required),
      secretkey: new UntypedFormControl(null, Validators.required)
    });
  }

  async loginbyOTP() {
    this.qrCodeVisible = false;
    this.qrImgPath = '';
    this.qrMsg = '';
    if (this.showOTPForm) {
      await this.appService.loginByOTP(config['loginApi'], this.loginForm.value, 'loginApi');
    }
    else {
      let param = "?Email=" + this.loginForm.get('email')?.getRawValue();
      this.apiSubscriber[0] = this.apiservice.getRequest(config['emailAuthApi'] + param, 'emailAuthApi').subscribe((response: any) => {
        if (response) {
          if (response.ErrorCode == "1" || response.ErrorCode == "5") {
            if (response.ErrorCode == "1") {
              this.qrCodeVisible = true;
              this.qrImgPath = response.qrCodeImageUrl;
              this.qrMsg = response.ErrorMessage;
            }
            this.loginForm.get('secretkey')?.setValue(response.Result);
            this.showOTPForm = true;
            this.utilities.toastMsg("success", "Success", response.ErrorMessage);
          } else {
            this.utilities.toastMsg("error", "Failed", response.ErrorMessage);
          }
        }
      }, (error) => {
        this.utilities.toastMsg("warning", "Please try again", "");
      });
    }
  }

  togglePassVisible() {
    if (this.passwordType == 'password') {
      this.passwordType = 'text';
      this.eyeType = 'eye-off';
    }
    else {
      this.passwordType = 'password';
      this.eyeType = 'eye';
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.querySelector('app-root'), 'login-page');
    if (this.loaderSubscriber) {
      this.loaderSubscriber.unsubscribe();
    }
    if (this.apiSubscriber[0]) {
      this.apiSubscriber[0].unsubscribe();
    }
  }
}