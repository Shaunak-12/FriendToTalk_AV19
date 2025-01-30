import { ActivatedRoute } from '@angular/router';
import { TitleHeaderComponent } from '@shared/title-header/title-header.component';
import { AdvanceTablePaginatorComponent } from '@shared/advance-table-paginator/advance-table-paginator.component';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { MultiInputHeaderComponent } from '@shared/multi-input-header/multi-input-header.component';
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
// import { element } from 'protractor';

import { Component, OnInit, Input, Output, EventEmitter,OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { config } from '@services/config';
import { ApiService } from '@services/api.service';
import { CommonFunctionService } from '@services/common-function.service';
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
  selector: 'app-approve-reel',
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
  templateUrl: './approve-reel.component.html',
  styleUrl: './approve-reel.component.scss'
})
export class ApproveReelComponent implements OnInit {

  @Input() pageData:any;
  @Input() AcceptRejectVar='A';
  @Output() onCancel = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();

  DataLoader=false;
  BankDataCollumns=[]
  BankDataRows:any=[];
  Description=new FormControl('',Validators.required);

  approveDisabled=false;
  trxdisabled=false;

  constructor(private apiservice: ApiService, private utilities : CommonFunctionService) { }

  ngOnInit(){
    // console.log(this.pageData);
  }

  onBack(){
    this.onCancel.emit();
  }

  onApprove(){
    if(!this.Description.value && this.AcceptRejectVar=='R'){
      this.utilities.toastMsg('error',"Fill Description to Reject","");
    }
    else{
      let param = {Id:this.pageData.Id,StatusCode:(this.AcceptRejectVar=='A'?"A":"R"),Remarks:this.Description.value};
      this.approveDisabled=true;
      this.apiservice.sendRequest(config['changeDCPromotionStatus'],param).subscribe((data: any) => {
        this.approveDisabled=false;
        if (data.ErrorCode == "1") {
          this.utilities.toastMsg('success',data.Result, data.ErrorMessage);
          this.onBack();
          this.onSubmit.emit();
        }
        else {
          this.utilities.toastMsg('warning',data.Result,data.ErrorMessage);
        }
      }, (error) => {
        this.approveDisabled=false;
        console.log(error);
      });
    }
  }
}