import { CommonFunctionService } from '@services/common-function.service';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';


import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
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
  selector: 'app-editlevtempconf',
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
  templateUrl: './editlevtempconf.component.html',
  styleUrl: './editlevtempconf.component.scss'
})
export class EditlevtempconfComponent implements OnInit {
  @Input() levtempData:any;
  @Input() submitBtn!:boolean;
  @Input() tmpArr:any=[];
  @Input() levArr:any=[];
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  submitDisabled=false;
  resetBtn = true;
  addForm!: FormGroup;
  adminPass = '';
  userWals:any=[];
  tmpOps:any=[];
  levOps:any=[];
  constructor(private formBuilder: FormBuilder, private apiservice: ApiService, private utilities : CommonFunctionService) { }
  ngOnInit(){
    console.log(this.levtempData);
    this.userWals = JSON.parse(sessionStorage.getItem('WalList')||'{}');
    this.initializeForm();
  }
  
  initializeForm(){
    this.addForm = this.formBuilder.group({
      Id:[this.levtempData.Id],
      WalletTypeId:[this.levtempData.WalletTypeId],
      SiteCode:[sessionStorage.getItem('selectedSite')],
      DepositAmtCriteria: [this.levtempData.DepositAmtCriteria],
      BetAmtCriteria: [this.levtempData.BetAmtCriteria, [Validators.required]],
      BetTurnoverWegring: [this.levtempData.BetTurnoverWegring, [Validators.required]],
      DailyReward: [this.levtempData.DailyReward, [Validators.required]],
      WeeklyReward: [this.levtempData.WeeklyReward, [Validators.required]],
      MonthlyReward: [this.levtempData.MonthlyReward, [Validators.required]],
      UpgradeReward: [this.levtempData.UpgradeReward, [Validators.required]],
      DepositWithdrawalTurnoverWegering: [this.levtempData.DepositWithdrawalTurnoverWegering, [Validators.required]],
      WithdrawalTurnoverWegering: [this.levtempData.WithdrawalTurnoverWegering, [Validators.required]],
      DayFreq: [this.levtempData.DayFreq, [Validators.required]],
      WeekFreq: [this.levtempData.WeekFreq, [Validators.required]],
      MonthFreq :[this.levtempData.MonthFreq, [Validators.required]],
      DailyDepositAmount: [this.levtempData.DailyDepositAmount, [Validators.required]],
      WeeklyDepositAmount: [this.levtempData.WeeklyDepositAmount, [Validators.required]],
      MonthlyDepositAmount :[this.levtempData.MonthlyDepositAmount, [Validators.required]],
    });
  }
  
  onBack(){
    this.onCancel.emit();
  }

  onSubmit(){
    if(this.addForm.invalid){
      this.utilities.toastMsg('warning','Please enter Required Data!','');
    }
    else{
      this.submitDisabled=true;
      let FormValue = this.addForm.getRawValue();
        this.apiservice.sendRequest(config['setLevTmpMap'],FormValue,"setLevTmpMap").subscribe((data: any) => {
          this.submitDisabled=false;
          if (data.ErrorCode === "1") {
            this.utilities.toastMsg('success',"Success", data.ErrorMessage);
            this.adminPass=data.ErrorMessage;
            this.addForm.disable();
            this.onCancel.emit();
          }
          else {
            this.utilities.toastMsg('warning',"Failed",data.Result + " : " + data.ErrorMessage);
          }
          this.onSave.emit();
        }, (error) => {
          console.log(error);
        });
    }
  }
}