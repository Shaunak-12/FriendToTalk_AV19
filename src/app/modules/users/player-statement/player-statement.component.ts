import { Component, OnInit,TemplateRef, ViewChild, Input,OnDestroy, Output, EventEmitter,OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctionService } from '@services/common-function.service';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';

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
import { AdvanceTablePaginatorComponent } from '@shared/advance-table-paginator/advance-table-paginator.component';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-player-statement',
  imports: [AdvanceTableComponent,AdvanceTablePaginatorComponent,
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
  templateUrl: './player-statement.component.html',
  styleUrl: './player-statement.component.scss'
})
export class PlayerStatementComponent implements OnInit, OnDestroy {
  @Input()userId!: number;
  @Input() uWalId:any;
  AllUserinfo:any=[];
  UserinfoData:any=[];
  rowCount: any ={f:0,l:0,t:0};
  pageCount=[100];
  pagesTotal=1;
  btnTotal: any=[];
  paginatorBlock:any=[];
  dynamicControls = [{placeholder:'Search',type:'text',label:'Search'}];
  UserCollumnHeaders:any = [
    [{value:'Sr. No.',bg:'white-drop'},{value:'Description',bg:'white-drop'},{value:'Bet',bg:'white-drop'},{value:'Win',bg:'white-drop'},{value:'Balance',bg:'white-drop'},{value:'Time',bg:'white-drop'}]
  ]  
  UserDataCollumns=this.UserCollumnHeaders;
  currentQuery: any ={"PageNo": 1,"PageSize":100};
  dIndex={psc_eS_col:0};
  currentWal = sessionStorage.getItem('WalChosen');
  private loaderSubscriber!: Subscription;
  private apiSubscriber: Subscription[]=[];
  apiLoader={psc_list:false,psc_eStatement:false,psc_eDAW:false};
  constructor(private apiservice: ApiService, private utilities: CommonFunctionService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentWal=this.uWalId;
    this.loaderSubscriber = this.apiservice.loaderService.loading$.subscribe((loading:any={}) => {
      this.apiLoader.psc_list=('getUserStatement' in loading)?true:false;
      this.apiLoader.psc_eStatement=('exportStatement' in loading)?true:false;
      this.apiLoader.psc_eDAW=('exportDepositAndWithdrawal' in loading)?true:false;
  });
    this.GetUserStatement(this.currentWal);
  }

  initializeData()
  {
    this.AllUserinfo = [];
    this.UserinfoData = [];
  }
  
  GetUserStatement(userselWal: any) {
    this.initializeData();
    this.currentWal=userselWal;
    let param = "?PageNo=" + this.currentQuery.PageNo + "&UserId=" + this.userId+'&WalletTypeId='+userselWal;
    this.apiSubscriber[0] = this.apiservice.getRequest(config['getUserStatement'] + param,'getUserStatement').subscribe((data: any) => {
      this.AllUserinfo=data;
      if(this.AllUserinfo[0]){
        this.UserDataCollumns=this.UserCollumnHeaders;
        this.pagesTotal=Math.ceil(this.AllUserinfo[0].TotalCount/this.currentQuery.PageSize);
        this.AllUserinfo.forEach((element:any,index:any) => {
          let ctz = element.CreatedDateTZ?" "+element.CreatedDateTZ:'';
          this.UserinfoData.push([
          {value:((this.currentQuery.PageNo-1)*this.currentQuery.PageSize)+(index+1),bg:'white-cell'},
          {value:element.Description,bg:'white-cell'},
          {value:element.Debit,bg:'white-cell'},
          {value:element.Credit,bg:'white-cell'},
          {value:element.Balance,bg:'white-cell'},
          {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss A, DD-MMM-yyyy")+ctz:'',bg:'white-cell'}
          ])
        });
        this.rowCount={f:this.UserinfoData[0][0].value,l:this.UserinfoData[this.UserinfoData.length-1][0].value,t:this.AllUserinfo[0].TotalCount};
        let LengthOfStatement = Math.ceil(this.AllUserinfo[0].TotalCount / 50000);
        this.btnTotal = Array.from({length: LengthOfStatement}, (v, i) => i);
        this.btnTotal.reverse();
        this.setPaginator();
      }
      else{
        this.rowCount={f:0,l:0,t:0};
        this.UserDataCollumns=this.utilities.TableDataNone;
      }
    }, (error) => {
      console.log(error);
    });
  }

  onPaginatorChange(paginatorQuery:any){
    if(paginatorQuery.action=='pageSize'){
      this.currentQuery.PageNo = 1;
      this.currentQuery.PageSize = paginatorQuery.pageSize;
    }
    else if(paginatorQuery.action=='pageNo'){
      this.currentQuery.PageNo = paginatorQuery.pageNo;
    }
    this.GetUserStatement(this.currentWal);
  }

  setPaginator(){
    this.paginatorBlock = [];
    if (this.currentQuery.PageNo <= 4) {
      for (let i = 1; i <= 10 && i <= this.pagesTotal; i++) {
        this.paginatorBlock.push(i);
      }
    }
    else {
      for (let i = this.currentQuery.PageNo - 3; i <= this.currentQuery.PageNo + 6 && i <= this.pagesTotal; i++) {
        this.paginatorBlock.push(i);
      }
    }
  }

  // DownloadStatementData() {
  //   let request = "?UserId=" + this.userId+'&RecordCount=50000'+"&WalletTypeId="+this.currentWal;
  //   let docname = 'Statement_Download_User_'+this.userId+'_'+moment(new Date()).format("DD/MM/yyyy");
  //   this.apiservice.exportExcel(config['exportStatement'] + request,docname,'exportStatement');
  // }

  DownloadStatementData(sBtn:number) {
    let rCount = 50000 * (sBtn+1);
    this.dIndex.psc_eS_col = sBtn;
    let request = "?UserId=" + this.userId+'&RecordCount='+rCount+"&WalletTypeId="+this.currentWal;;
    let docname = 'Statement_Download_User_'+this.userId+'_'+moment(new Date()).format("DD/MM/yyyy");
    this.apiservice.exportExcel(config['exportStatement'] + request,docname,'exportStatement');
  }

  DownloadDepositWithdrawalData() {
    let request = "?UserId=" + this.userId + "&WalletTypeId="+this.currentWal;
    let docname = 'Deposit_And_Withdrawal_User_'+this.userId+'_'+moment(new Date()).format("DD/MM/yyyy");
    this.apiservice.exportExcel(config['exportDepositAndWithdrawal'] + request,docname,'exportDepositAndWithdrawal');
  }

  ngOnDestroy(): void {
    if (this.loaderSubscriber) {
      this.loaderSubscriber.unsubscribe();
    }
    if(this.apiSubscriber[0]) {
      this.apiSubscriber[0].unsubscribe();
    }
  }
}