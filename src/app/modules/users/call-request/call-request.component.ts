
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
import { environment } from 'environments/environment';
import { AdvanceTitleHeadNewComponent } from '@shared/advance-title-head-new/advance-title-head-new.component';
import { AdvanceTablePaginatorComponent } from '@shared/advance-table-paginator/advance-table-paginator.component';
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
import { ConfirmBoxComponent } from './confirm-box/confirm-box.component';
import { CallRequestCompleteComponent } from '../call-request-complete/call-request-complete.component';

interface Wallet {
  Id: any;
  Name: string;
  Code: string;
  CurrencyType: any;
  CurrencySymbol: any;
  IsRealMoney: any;
  Wallets: any;
}
@Component({
  selector: 'app-call-request',
  imports: [AdvanceTitleHeadNewComponent,AdvanceTablePaginatorComponent,AdvanceTableComponent,CallRequestCompleteComponent,ConfirmBoxComponent,
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
  templateUrl: './call-request.component.html',
  styleUrl: './call-request.component.scss'
})
export class CallRequestComponent implements OnInit {
  @ViewChild('CallRequestCompletePopUp') CallRequestCompletePopUp!: TemplateRef<any>;
  @ViewChild('statusChange') statusChange!: TemplateRef<any>;
  AllCallRequestinfo:any=[];
  CallRequestinfoData:any=[];
  rowCount : any ={f:0,l:0,t:0};
  pageCount=[10,50,100,500,1000];
  pagesTotal=1;
  udataToView: any={};
  AcceptRejectVar="A";
  paginatorBlock:any=[];

userData = JSON.parse(localStorage.getItem('personalDetails') || '{}');
  userWals:Wallet[] = (JSON.parse(sessionStorage.getItem('WalList') || '{}'));
  finList = this.userWals.push({"Id":"0","Name":"All","Code":"Wallets","CurrencyType":"Wallets","CurrencySymbol":"&#8377;","IsRealMoney":1,"Wallets":null});
  dynamicControls = [
    {changeAction:'submit',que:'wallet',type:'dropdown',default:"0",options:this.userWals.map(({Id, Name, Code}) => ({ op:Name+' - '+Code, val:Id })),subque:[]},
    {changeAction:'submit',que:'filter',type:'dropdown',default:0,options:[{op:'All',val:0},{op:'Complete',val:1},{op:'Incomplete',val:2}],subque:[]},
    {que:'PlayerId',type:'input',subque:[]},
    {que:'Search',type:'input',subque:[]}
  ];
  UserCollumnHeaders:any = [
    [{value:'Sr. No.',bg:'white-drop'},{value:'Id',bg:'white-drop'},{value:'Name',bg:'white-drop'},{value:'User Name',bg:'white-drop'},
    {value:'Mobile',bg:'white-drop'},{value:'Date',bg:'white-drop'},{value:'Remark',bg:'white-drop'},{value:'Wallet',bg:'white-drop'},{value:'Action',bg:'white-drop'}]
  ];
  UserDataCollumns=this.UserCollumnHeaders;
  currentQuery={"Search": "","PageNo": 1,"PageSize": this.pageCount[2],"filter":0,"SiteCode": sessionStorage.getItem('selectedSite'),"WalletTypeId":0,"PlayerId":""};
  private loaderSubscriber!: Subscription;
  private apiSubscriber: Subscription[]=[];
  apiLoader={crc_list:false};
  constructor(private apiservice: ApiService, private utilities: CommonFunctionService,private dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.loaderSubscriber = this.apiservice.loaderService.loading$.subscribe((loading:any={}) => {
      this.apiLoader.crc_list=('getCallBackRequest' in loading)?true:false;
    });
    this.GetAllCallRequests();
  }
  
  initializeData()
  {
    this.AllCallRequestinfo = [];
    this.CallRequestinfoData = [];
    this.udataToView = {};
    if(this.apiSubscriber[0]) {
      this.apiSubscriber[0].unsubscribe();
    }
  }
  
  onPaginatorChange(paginatorQuery:any){
    if(paginatorQuery.action=='pageSize'){
      this.currentQuery.PageNo = 1;
      this.currentQuery.PageSize = paginatorQuery.pageSize;
    }
    else if(paginatorQuery.action=='pageNo'){
      this.currentQuery.PageNo = paginatorQuery.pageNo;
    }
    this.GetAllCallRequests();
  }
  
  GetAllCallRequests() {
    this.initializeData();
    this.apiSubscriber[0] = this.apiservice.sendRequest(config['getCallBackRequest'], this.currentQuery, 'getCallBackRequest').subscribe((data: any) => {
      this.AllCallRequestinfo=data;
      console.log("this.AllCallRequestinfo:- ",this.AllCallRequestinfo);
      if(this.AllCallRequestinfo[0]){
        this.UserDataCollumns=this.UserCollumnHeaders;
        this.pagesTotal=Math.ceil(this.AllCallRequestinfo[0].TotalCount/this.currentQuery.PageSize);
        let bg_cell = ''
        this.AllCallRequestinfo.forEach((element:any,index:any) => {
          bg_cell = element.FirstDeposit && (element.StatusCode == 'PR' || element.StatusCode == 'P')?'blue-blink-cell':'white-cell';
          this.CallRequestinfoData.push([
            {value:((this.currentQuery.PageNo-1)*this.currentQuery.PageSize)+(index+1),bg:bg_cell},
            {value:element.UserId,bg:bg_cell},
            {value:element.FName + ' ' + element.LName,bg:bg_cell},
            {value:element.UserName,bg:bg_cell},
            {value:element.Mobile,bg:bg_cell},
            {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss A, DD-MMM-yyyy")+" "+element.CreatedDateTZ:'',bg:bg_cell,sufText:element.TimeAgo},
            {value:element.Description,bg:bg_cell},
            {value:element.WalletCode,bg:bg_cell},
            {bg:bg_cell,icon:'Multi',value:[
              ...(element.Description?[{value:'',bg:bg_cell}]:[{value:'Complete',bg:bg_cell,icon:'None'}]),
              ...(((this.userData.RoleCode == 'SA' ||this.userData.RoleCode == 'BO' || this.userData.RoleCode == 'CSBD') &&  element.CallStatus == 'P' && element.StatusId != '1') ? [{value:'Call',bg:bg_cell,icon:'None'}]:[]),
              ...(((this.userData.RoleCode == 'SA') &&  element.CallStatus == 'A' &&(  element.Description == 'null' || element.Description == null || element.Description == '') ) ? [{value:'Reset Call',bg:bg_cell,icon:'None'}]:[]),
              ...(element.urlLink?[{value:'',bg:bg_cell,icon:'feather',iconvalue:'external-link'}]:[]),

            ]},
          ])
        });
        this.rowCount={f:this.CallRequestinfoData[0][0].value,l:this.CallRequestinfoData[this.CallRequestinfoData.length-1][0].value,t:this.AllCallRequestinfo[0].TotalCount};
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
  onClose(){
    this.dialog.closeAll();
    this.GetAllCallRequests();
  }
  onValueChange(formVal:any){
    console.log(formVal)
    if(formVal.type=='Complete'){
      this.udataToView=this.AllCallRequestinfo[formVal.row];
      this.CompleteOpenPopup();
    }
    if(formVal.type=='Call'){
      this.udataToView=this.AllCallRequestinfo[formVal.row];
      this.CallToPlayer();
    }
    if(formVal.type=='Reset Call'){
      this.udataToView=this.AllCallRequestinfo[formVal.row];
      this.ResetCall();
    }
    if(formVal.type=='external-link'){
      this.udataToView=this.AllCallRequestinfo[formVal.row];
      window.open(this.udataToView['urlLink'],'_blank');
    }
  }
  ResetCall(){
    let dialogRef = this.dialog.open(this.statusChange, {
      height: '900x',
      width: '600px',
      panelClass: 'screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {})
  }
  CallToPlayer(){
    let call = {"ID":this.udataToView['Id'],"PlayerMobile":this.udataToView['tempMobile']}
    this.apiSubscriber[2] = this.apiservice.sendRequest(config['getAdminCall'],call, 'getAdminCall').subscribe({
      next: (data:any) => {
        if(data.ErrorCode == '1'){
          let data = {Diresu:this.userData.UserId,Edocetis:sessionStorage.getItem('selectedSite'),Phone:this.udataToView['tempMobile'],cntryCode:this.udataToView['CountryCode']}
          const encodedData = btoa(JSON.stringify(data));
          window.open(environment.callUrl+'call.htm?data='+encodedData,'_blank')
        }else{
          this.utilities.toastMsg("warning",data.Result,data.ErrorMessage)
        }
      },
      error(err) {
        console.error('Error:', err);
      },
    });
  }
  onSavePopup(){
    this.GetAllCallRequests();
    this.dialog.closeAll();
  }
  
  CompleteOpenPopup() {
    let dialogRef = this.dialog.open(this.CallRequestCompletePopUp, {
      height: '900x',
      width: '600px',
      panelClass: 'screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {})
  }
  
  getSearchQuery(formVal:any)
  {
    this.currentQuery.filter=formVal.filter.value;
    this.currentQuery.Search=formVal.Search.value;
    this.currentQuery.PlayerId = formVal.PlayerId.value;
    this.currentQuery.WalletTypeId = formVal.wallet.value;
    this.currentQuery.PageNo = 1;
    this.GetAllCallRequests();
  }
  
  ngOnDestroy() {
    if (this.loaderSubscriber) {
      this.loaderSubscriber.unsubscribe();
    }
    if(this.apiSubscriber[0]) {
      this.apiSubscriber[0].unsubscribe();
    }
    if(this.apiSubscriber[2]) {
      this.apiSubscriber[2].unsubscribe();
    }
  }
}