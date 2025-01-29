import {
  Component,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
// import {ToastrService} from 'ngx-toastr';
import { AppService } from '@services/app.service';

import { CommonModule } from '@angular/common';
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

// import { allIcons } from 'angular-feather/icons';
import { CurrencySymbolPipe } from '../../shared/currency-symbol.pipe';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FeatherModule } from 'angular-feather';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'login-box';
  public forgotPasswordForm!: UntypedFormGroup;
  public isAuthLoading = false;
  appService = inject(AppService);

  constructor(
      private renderer: Renderer2,
      private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
      this.renderer.addClass(
          document.querySelector('app-root'),
          'login-page'
      );
      this.forgotPasswordForm = new UntypedFormGroup({
          email: new UntypedFormControl(null, Validators.required)
      });
  }

  forgotPassword() {
      if (this.forgotPasswordForm.valid) {
      } else {
          this.toastr.error('Hello world!', 'Toastr fun!');
      }
  }

  ngOnDestroy(): void {
      this.renderer.removeClass(
          document.querySelector('app-root'),
          'login-page'
      );
  }
}
