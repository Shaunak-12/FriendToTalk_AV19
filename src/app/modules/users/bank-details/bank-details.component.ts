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
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-bank-details',
  imports: [AdvanceTableComponent,
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
                              FeatherModule,
                              MatCheckboxModule,
                              MatExpansionModule,
                              MatProgressBarModule
  ],
  templateUrl: './bank-details.component.html',
  styleUrl: './bank-details.component.scss'
})
export class BankDetailsComponent implements OnInit {
  
  @Input() userData:any;
  @Output() onCancel = new EventEmitter<any>();
  
  DataLoader=false;
  BankDataCollumns=[]
  BankDataRows:any=[];
  sSite=sessionStorage.getItem('selectedSite');
  
  constructor(private utilities:CommonFunctionService) { }
  
  ngOnInit(){
      this.BankDataRows=[
        [{value:'Account Number',bg:'white-cell'},{value:this.userData.AccountNumber,bg:'white-cell'}],
        [{value:'Amount',bg:'white-cell'},{value:this.utilities.roundOffNum(this.userData.AccountBalance),bg:'white-cell'}],
        [...(this.userData.BankName?[{value:'Bank Name	',bg:'white-cell'},{value:this.userData.BankName,bg:'white-cell'}]:[{value:'Wallet Name	',bg:'white-cell'},{value:this.userData.WalletName,bg:'white-cell'}])],
        [...(this.userData.BranchName?[{value:'Branch Name	',bg:'white-cell'},{value:this.userData.BranchName,bg:'white-cell'}]:[])],
        [{value:'Holder Name	',bg:'white-cell'},{value:this.userData.AccountHolderName,bg:'white-cell'}],
        [...(this.userData.IfscCode?[{value:'IFSC Code	',bg:'white-cell'},{value:this.userData.IfscCode,bg:'white-cell'}]:[])]
      ]
  }

  copytoclipboard() {
    let copiedDetail = "Account Number : "+this.userData.AccountNumber
    +"\nAmount : "+this.userData.AccountBalance
    +(this.userData.BankName?("\nBank Name : "+this.userData.BankName):("\nWallet Name : "+this.userData.WalletName))
    +(this.userData.BranchName?("\nBranch Name : "+this.userData.BranchName):'')
    +"\nHolder Name : "+this.userData.AccountHolderName
    +(this.userData.IfscCode?("\nIFSC Code : "+this.userData.IfscCode):'');
    navigator.clipboard.writeText(copiedDetail);
    this.utilities.toastMsg('success','Copied : ',copiedDetail);
  }
  
  onBack(){
    this.onCancel.emit();
  }
}