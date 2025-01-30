import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { config } from '@services/config';
import { ApiService } from '@services/api.service';
import { CommonFunctionService } from '@services/common-function.service';
import moment from 'moment';
import { Subscription } from 'rxjs';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { AdvanceTablePaginatorComponent } from '@shared/advance-table-paginator/advance-table-paginator.component';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
  selector: 'app-update-user',
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
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent implements OnInit {
  @Input() userData:any;
  @Input() userWal:any;
  @Output() onSave = new EventEmitter<any>();
    
  submitDisabled=false;
  adminForm!: FormGroup;
  adminData:any = [];
  constructor(private formBuilder: FormBuilder, private apiservice: ApiService, private utilities : CommonFunctionService) { }
  
  ngOnInit(){
    // console.log(this.rowData);
    this.initializeForm();
    this.GetAllAdmin();
  }
  
  initializeForm(){
    this.adminForm = this.formBuilder.group({
      SupportAdminId: [""],
      Mobile:[this.userData.Mobile],
      Id:[this.userData.UserId]
    });
  }
  GetAllAdmin(){
    this.apiservice.getRequest(config['getAllAdminList'],'getAllAdminList').subscribe({
      next:(data)=>{
        this.adminData= data
        // console.log(this.adminData)
      },
      error(err) {
        console.error('Error:', err);
      },
    });
  }
  onSubmit(){
    if(this.adminForm.get('SupportAdminId')?.getRawValue()==''){
      this.utilities.toastMsg('warning',"Please select Admin",'');
      return;
    }
    this.submitDisabled=true;
    this.apiservice.sendRequest(config['updateLead'],this.adminForm.getRawValue(),'updateLead').subscribe((data: any) => {
      this.submitDisabled=false;
      if (data.ErrorCode === "1") {
        this.utilities.toastMsg('success',"Success", data.ErrorMessage);
        setTimeout(()=>{
          this.onSave.emit();
        }, 1000);
      }
      else {
        this.utilities.toastMsg('warning',"Failed",data.Result + " : " + data.ErrorMessage);
      }
    }, (error) => {
      console.log(error);
    });
  }

}
