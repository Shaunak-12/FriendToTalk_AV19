import { config } from '@services/config';
import { ApiService } from '@services/api.service';
import { CommonFunctionService } from '@services/common-function.service';
import { Component, OnInit,Input, Output, EventEmitter, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TitleHeaderComponent } from '@shared/title-header/title-header.component';
import { AdvanceTablePaginatorComponent } from '@shared/advance-table-paginator/advance-table-paginator.component';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { MultiInputHeaderComponent } from '@shared/multi-input-header/multi-input-header.component';
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
// import { element } from 'protractor';
import { FormControl, FormsModule,Validators, FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
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
  selector: 'app-add-page',
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
  templateUrl: './add-page.component.html',
  styleUrl: './add-page.component.scss'
})
export class AddPageComponent implements OnInit {
  @Input() submitBtn!:boolean;
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  
  submitDisabled=false;
  
  resetBtn = true;
  adminForm!: FormGroup;
  adminPass = '';

  fullURL = new FormControl('',Validators.required);

  constructor(private formBuilder: FormBuilder, private apiservice: ApiService, private utilities : CommonFunctionService) { }

  ngOnInit(){
    this.initializeForm();
    this.fullURL.valueChanges.subscribe((value)=>{
      let handleCode = value!.match(/^https:\/\/www\.instagram\.com\/([^/?]+)/);
      this.adminForm.get('Handle')?.setValue(handleCode?handleCode[1]:'');
    });
  }
  
  initializeForm(){
    this.adminForm = this.formBuilder.group({
      Name: ["", [Validators.required]],
      Mobile: ["", [Validators.required,Validators.pattern('[6-9]\\d{9}')]],
      WesiteURL: [""],
      Password: ["", [Validators.required]],
      PageName: ["", [Validators.required]],
      Handle: ["", [Validators.required]],
      Type: ["Admin", [Validators.required]],
      SiteCode: [sessionStorage.getItem('selectedSite')]
      });
  }
  
  onBack(){
    this.onCancel.emit();
  }
  
  onSubmit(){
    if(this.adminForm.invalid){
      this.utilities.toastMsg('warning','Please enter Required Data!','');
    }
    else{
      this.submitDisabled=true;
      let FormValue = this.adminForm.getRawValue();
      if(!FormValue.id){
        delete FormValue.id;
        this.apiservice.sendRequest(config['saveCreatorPage'],FormValue).subscribe((data: any) => {
          // console.log(data);
          this.submitDisabled=false;
          if (data.ErrorCode === "1") {
            this.utilities.toastMsg('success',"Success", data.ErrorMessage);
            this.adminPass=data.ErrorMessage;
            this.adminForm.disable();
            this.onSave.emit();
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
}