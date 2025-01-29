import { CommonFunctionService } from '@services/common-function.service';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';


import { CommonModule } from '@angular/common';
import { Component, OnInit,TemplateRef, ViewChild, Input, Output, EventEmitter,OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {Validators,FormControl,FormsModule,FormBuilder, FormGroup, FormArray, AbstractControl} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
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
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-approve-details',
  imports: [
    MatProgressSpinnerModule,CommonModule,
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
                          // FeatherModule.pick(allIcons),
                          MatCheckboxModule,
                          MatExpansionModule,
                          MatProgressBarModule
  ],
  templateUrl: './approve-details.component.html',
  styleUrl: './approve-details.component.scss'
})
export class ApproveDetailsComponent implements OnInit {

  @Input() userData:any;
  @Input() AcceptRejectVar='A';
  @Output() onCancel = new EventEmitter<any>();

  DataLoader=false;
  BankDataCollumns=[]
  BankDataRows:any=[];
  UTRNumber=new FormControl('',Validators.required);
  Description=new FormControl('',Validators.required);

  approveDisabled=false;
  trxdisabled=false;

  constructor(private apiservice: ApiService, private utilities : CommonFunctionService) { }

  ngOnInit(){
    // console.log(this.userData);
    this.BankDataRows=[
    [{value:'Account Number',bg:'white-cell'},{value:this.userData.AccountNumber,bg:'white-cell'}],
    [{value:'Bank Name',bg:'white-cell'},{value:this.userData.BankName,bg:'white-cell'}],
    [{value:'Branch Name',bg:'white-cell'},{value:this.userData.BranchName,bg:'white-cell'}],
    [{value:'Holder Name',bg:'white-cell'},{value:this.userData.AccountHolderName,bg:'white-cell'}],
    [{value:'IFSC Code',bg:'white-cell'},{value:this.userData.IfscCode,bg:'white-cell'}]
    ]
  }

  onBack(){
    this.onCancel.emit();
  }

  onTransfer(){
    let param = {Id:this.userData.Id}
    this.trxdisabled=true;
    this.apiservice.sendRequest(config['transferFundViaPayconnect'],param).subscribe((data: any) => {
      this.trxdisabled=false;
      if (data.ErrorCode == "1") {
        this.utilities.toastMsg('success',data.Result, data.ErrorMessage);
      }
      else {
        this.utilities.toastMsg('warning',data.Result,data.ErrorMessage);
      }
    }, (error) => {
      this.trxdisabled=false;
      console.log(error);
    });
  }

  onApprove(){
    if(this.AcceptRejectVar == 'A' && !this.UTRNumber.value){
      this.utilities.toastMsg('error',"Please Fill UTR Number","");
      return;
    }
    if(this.AcceptRejectVar == 'R' && !this.Description.value){
      this.utilities.toastMsg('error',"Please Fill Description","");
      return;
    }
    let param = {Id:this.userData.Id,StatusCode:(this.AcceptRejectVar=='A'?"A":"R"),Description:this.Description.value,UTRNumber:this.UTRNumber.value};
    this.approveDisabled=true;
    this.apiservice.sendRequest(config['approveWithdrawal'],param).subscribe((data: any) => {
      this.approveDisabled=false;
      if (data.ErrorCode == "1") {
        this.utilities.toastMsg('success',data.Result, data.ErrorMessage);
        this.onBack();
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