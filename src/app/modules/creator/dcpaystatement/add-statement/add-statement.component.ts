import { ActivatedRoute } from '@angular/router';

import { Component, OnInit,Input,Output,EventEmitter, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonFunctionService } from '@services/common-function.service';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { MultiInputHeaderComponent } from '@shared/multi-input-header/multi-input-header.component';
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
// import { element } from 'protractor';

import { FormControl, FormsModule, FormBuilder, FormGroup,Validators, FormArray, AbstractControl } from '@angular/forms';
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
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-add-statement',
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
  templateUrl: './add-statement.component.html',
  styleUrl: './add-statement.component.scss'
})
export class AddStatementComponent implements OnInit, OnDestroy {
  @Input() submitBtn!:boolean;
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  
  submitDisabled=false;
  
  resetBtn = true;
  statementForm!: FormGroup;
  adminPass = '';

  ReelsList: { Id: any; PageName: any; PromoURL: any }[] = [];
  
  PageSelected = new FormControl('',[Validators.required]);
  PageList: any =[];
  FilteredReels: any = [];
  
  constructor(private formBuilder: FormBuilder, private apiservice: ApiService, private utilities : CommonFunctionService) { }
  
  ngOnInit(){
    this.getAllData();
    this.initializeForm();
    this.PageSelected.valueChanges.subscribe(value => {
      this.FilteredReels = this.ReelsList.filter(page => page.PageName == value);
      this.statementForm.get('DCPromotionId')?.setValue('');
    });
  }
  
  getAllData()
  {
    let param = config['getDCPromotionList']+'?SiteCode='+sessionStorage.getItem('selectedSite');
    this.apiservice.getRequest(param,'getDCPromotionList').subscribe((data: any) => {
      this.ReelsList = [];
      this.PageList = [];
      data.forEach((element: any) => {
        let reelData = element.Name.split(" - ")
        this.ReelsList.push({
          Id:element.Id,
          PageName:reelData[0],
          PromoURL:reelData[1]
        });
      });
      this.PageList = Array.from(new Set(this.ReelsList.map(page => page.PageName)));
    }, (error) => {
      console.log(error);
    });
  }
  
  initializeForm(){
    this.statementForm = this.formBuilder.group({
      DCPromotionId: ["", [Validators.required]],
      Amount: ["", [Validators.required]],
      ReferenceId: ["", [Validators.required]],
      Description: ["", [Validators.required]],
      Type: ["Admin", [Validators.required]]
    });
  }
  
  onBack(){
    this.onCancel.emit();
  }
  
  onSubmit(){
    if(this.statementForm.invalid){
      this.utilities.toastMsg('warning','Please enter Required Data!','');
    }
    else{
      this.submitDisabled=true;
      let FormValue = this.statementForm.getRawValue();
      if(!FormValue.id){
        delete FormValue.id;
        this.apiservice.sendRequest(config['saveDCPaymentStatement'],FormValue).subscribe((data: any) => {
          // console.log(data);
          this.submitDisabled=false;
          if (data.ErrorCode === "1") {
            this.utilities.toastMsg('success',"Success", data.ErrorMessage);
            this.statementForm.disable();
            this.onSave.emit();
            this.onCancel.emit();
          }
          else {
            this.utilities.toastMsg('warning',"Failed",data.Result + " : " + data.ErrorMessage);
          }
        }, (error) => {
          console.log(error);
        });
      }
    }
  }
  
  ngOnDestroy(){
    
  }
}