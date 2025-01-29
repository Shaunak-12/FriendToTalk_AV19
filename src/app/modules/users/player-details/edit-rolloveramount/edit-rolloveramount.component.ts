import { CommonFunctionService } from '@services/common-function.service';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';


import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Validators, FormControl, FormsModule, FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { FeatherModule } from 'angular-feather';
@Component({
  selector: 'app-edit-rolloveramount',
  imports: [
    MatProgressSpinnerModule, CommonModule,
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
    MatSlideToggleModule,
    FeatherModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  templateUrl: './edit-rolloveramount.component.html',
  styleUrl: './edit-rolloveramount.component.scss'
})
export class EditRolloveramountComponent implements OnInit {
  @Input() submitBtn!: boolean;
  @Input() userData: any;
  @Input() walId: any;
  @Input() rowDataIn: any;
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  submitDisabled = false;

  resetBtn = true;
  rolleditform!: FormGroup;
  rollPass = '';

  constructor(private formBuilder: FormBuilder, private apiservice: ApiService, private utilities: CommonFunctionService) { }

  ngOnInit() {
    this.initializeForm();
    // console.log(this.userData);
  }

  initializeForm() {
    this.rolleditform = this.formBuilder.group({
      NormalRolloverAmount: [this.rowDataIn.NormalRolloverAmount, [Validators.required]],
      SlotsRolloverAmount: [this.rowDataIn.SlotsRolloverAmount, [Validators.required]],
      SportsRolloverAmount: [this.rowDataIn.SportsRolloverAmount, [Validators.required]],
      CrashRolloverAmount: [this.rowDataIn.CrashRolloverAmount, [Validators.required]],
      TableRolloverAmount: [this.rowDataIn.TableRolloverAmount, [Validators.required]],
      FishingRolloverAmount: [this.rowDataIn.FishingRolloverAmount, [Validators.required]],
      LiveRolloverAmount: [this.rowDataIn.LiveRolloverAmount, [Validators.required]],
      SiteCode: [sessionStorage.getItem('selectedSite')]
    });
  }

  onBack() {
    this.onCancel.emit();
  }

  onSubmit() {
    if (this.rolleditform.invalid) {
      this.utilities.toastMsg('warning', 'Please enter Required Data!', '');
    }
    else {
      this.submitDisabled = true;
      let FormValue = this.rolleditform.getRawValue();
      FormValue.WalletTypeId = this.walId;
      FormValue.UserId = this.userData.Id;
      if (!FormValue.id) {
        delete FormValue.id;
        this.apiservice.sendRequest(config['rollOverupdate'], FormValue).subscribe((data: any) => {
          this.submitDisabled = false;
          if (data.ErrorCode === "1") {
            this.utilities.toastMsg('success', "Success", data.ErrorMessage);
            this.rollPass = data.ErrorMessage;
            this.rolleditform.disable();
            this.onCancel.emit();
          }
          else {
            this.utilities.toastMsg('warning', "Failed", data.Result + " : " + data.ErrorMessage);
          }
          this.onSave.emit();
        }, (error) => {
          console.log(error);
        });
      }
    }
  }

}
