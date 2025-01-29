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
import { MultiInputHeaderComponent } from '@shared/multi-input-header/multi-input-header.component';
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
@Component({
  selector: 'app-player',
  imports: [MultiInputHeaderComponent, AdvanceTableComponent,
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
            // FeatherModule.pick(allIcons),
            MatCheckboxModule,
            MatExpansionModule,
            MatProgressBarModule
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 

})
export class PlayerComponent implements OnInit {
  @ViewChild('addForm') addForm!: TemplateRef<any>;
  AllRequestinfo:any=[];
  errorDataInfo:any=[];
  rowCount: any ={f:0,l:0,t:0};
  pageCount=[10,50,100,500,1000];
  pagesTotal=1;
  udataToView: any ={};
  AcceptRejectVar="A";
  paginatorBlock:any=[];
  userWals = JSON.parse(sessionStorage.getItem('WalList')||'{}');
  defWal=this.userWals.filter((wal: { Id: number; Name: string; Code: string; }) => wal.Id === parseInt(sessionStorage.getItem('WalChosen') || '{}'))[0];
  allTmp:any=[];
  allLev:any=[];
  defTmp:any=[];
  dynamicControls = [
    {type:'select',default:{name:this.defWal.Name+'-'+this.defWal.Code,value:this.defWal.Id},options:this.userWals.filter(({Id}: {Id: number})=>Id!==this.defWal.Id).map(({Id,Name,Code}: {Id: number, Name: string, Code: string})=>({name:Name+'-'+Code,value:Id}))},
    {changeAction:'submit',type:'select',default:{name:'Select',value:''},options:[{name:'BZ',value:'BZ'}]}
  ];
  UserCollumnHeaders:any = [[
    {value:'Sr. No.',bg:'white-drop'},
    // {value:'Id',bg:'white-drop'},
    {value:'Level Name',bg:'white-drop'},
    {value:'Template Name',bg:'white-drop'},
    {value:'Deposit Amt Criteria',bg:'white-drop'},
    {value:'Bet Amt Criteria',bg:'white-drop'},
    {value:'Bet Turnover Wagering',bg:'white-drop'},
    {value:'Daily Reward',bg:'white-drop'},
    {value:'Weekly Reward',bg:'white-drop'},
    {value:'Monthly Reward',bg:'white-drop'},
    {value:'Upgrade Reward',bg:'white-drop'},
    {value:'Withdrawal Turnover Wagering',bg:'white-drop'},
    {value:'Day Freq',bg:'white-drop'},
    {value:'Week Freq',bg:'white-drop'},
    {value:'Month Freq',bg:'white-drop'},
    {value:'Created Date',bg:'white-drop'},
    {value:'Updated Date',bg:'white-drop'}
  ]];
  dIndex={status:{row:0,col:0,use:false}}
  UserDataCollumns=this.UserCollumnHeaders;
  currentQuery={"SiteCode":sessionStorage.getItem('selectedSite'),"WalletTypeId":sessionStorage.getItem('WalChosen'),"Type":'BZ',"PageSize":this.pageCount[0],"PageNo":1};
  private loaderSubscriber!: Subscription;
  private apiSubscriber: Subscription[]=[];
  apiLoader={crc_list:false};
  constructor(private apiservice: ApiService, private utilities: CommonFunctionService,private dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.loaderSubscriber = this.apiservice.loaderService.loading$.subscribe((loading:any={}) => {
      this.apiLoader.crc_list=('getUsrForTmpCfg' in loading)?true:false;
      if (this.dIndex.status.use)
      {
        if (this.errorDataInfo &&this.errorDataInfo[this.dIndex.status.row] &&this.errorDataInfo[this.dIndex.status.row][this.dIndex.status.col])
        {
          const errorInfo = this.errorDataInfo[this.dIndex.status.row][this.dIndex.status.col];
          errorInfo['loader'] = 'saveLan' in loading ? true : false;
        }
      }
    });
    // this.apiSubscriber[0] = this.apiservice.getRequest(config['getAllTemplates']+"?SiteCode="+sessionStorage.getItem('selectedSite'), 'getAllTemplates').subscribe((data: any) => {
    //   this.allTmp=data;
    //   this.selWal({C0:this.currentQuery.WalletTypeId});
    // }, (error) => {
    //   console.log(error);
    // });
    this.apiSubscriber[0] = this.apiservice.getRequest(config['getAllLevels']+"?SiteCode="+sessionStorage.getItem('selectedSite'), 'getAllLevels').subscribe((data: any) => {
      this.allLev=data;
    }, (error) => {
      console.log(error);
    });
    this.GetAll();
  }
  
  initializeData()
  {
    this.AllRequestinfo = [];
    this.errorDataInfo = [];
    this.udataToView = {};
    // this.currentQuery.WalletTypeId=sessionStorage.getItem('WalChosen');
  }
  
  onPaginatorChange(paginatorQuery:any){
    if(paginatorQuery.action=='pageSize'){
      this.currentQuery.PageNo = 1;
      this.currentQuery.PageSize = paginatorQuery.pageSize;
    }
    else if(paginatorQuery.action=='pageNo'){
      this.currentQuery.PageNo = paginatorQuery.pageNo;
    }
    this.GetAll();
  }
  
  GetAll() {
    this.initializeData();
    this.apiSubscriber[0] = this.apiservice.sendRequest(config['getUsrForTmpCfg'],this.currentQuery, 'getUsrForTmpCfg').subscribe((data: any) => {
      this.AllRequestinfo=data;
      if(this.AllRequestinfo[0]){
        this.UserDataCollumns=this.UserCollumnHeaders;
        this.pagesTotal=Math.ceil(this.AllRequestinfo[0].TotalCount/this.currentQuery.PageSize);
        this.AllRequestinfo.forEach((element:any,index:any) => {
          let ctz = element.CreatedDateTZ?" "+element.CreatedDateTZ:'';
          this.errorDataInfo.push([
            {value:((this.currentQuery.PageNo-1)*this.currentQuery.PageSize)+(index+1),bg:'white-cell'},
            // {value:element.Id,bg:'white-cell'},
            {value:element.LevelName,bg:'white-cell'},
            {value:element.TemplateName,bg:'white-cell'},
            {value:element.DepositAmtCriteria,bg:'white-cell'},
            {value:element.BetAmtCriteria,bg:'white-cell'},
            {value:element.BetTurnoverWegring,bg:'white-cell'},
            {value:element.DailyReward,bg:'white-cell'},
            {value:element.WeeklyReward,bg:'white-cell'},
            {value:element.MonthlyReward,bg:'white-cell'},
            {value:element.UpgradeReward,bg:'white-cell'},
            {value:element.WithdrawalTurnoverWegering,bg:'white-cell'},
            {value:element.DayFreq,bg:'white-cell'},
            {value:element.WeekFreq,bg:'white-cell'},
            {value:element.MonthFreq,bg:'white-cell'},
            {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss A, DD-MMM-yyyy")+ctz:'',bg:'white-cell'},
            {value:element.UpdatedDate?moment(element.UpdatedDate).format("h:mm:ss A, DD-MMM-yyyy")+ctz:'',bg:'white-cell'},
          ])
        });
        this.rowCount={f:this.errorDataInfo[0][0].value,l:this.errorDataInfo[this.errorDataInfo.length-1][0].value,t:this.AllRequestinfo[0].TotalCount};

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
  
  onValueChange(formVal:any){
    if(formVal.col==3){
      this.dIndex.status.use = true;
      this.dIndex.status.row = formVal.row;
      this.dIndex.status.col = formVal.col;
      this.udataToView=this.AllRequestinfo[formVal.row];
      let param = {
        "LanguageCode":this.udataToView['LanguageCode'],
        "APIErrorCode":this.udataToView['APIErrorCode'],
        "ErrorMessage":formVal.value
      }
      this.saveMsg(param);
    }
  }
  
  saveMsg(param:any){
    this.apiservice.sendRequest(config['saveLan'],param,'saveLan').subscribe((data: any)=>{
      if (data) {
        if (data['ErrorCode'] == '1' ) {
          this.utilities.toastMsg('success',"Success", data['ErrorMessage']);
          this.GetAll();
        } else {
          this.utilities.toastMsg('error',"Failed",data['ErrorMessage']);
        }
      }
    }, (error) => {
      console.log(error);
    }
    );
  }
  
  getSearchQuery(formVal:any)
  {
    this.currentQuery.WalletTypeId=formVal.C0;
    this.currentQuery.Type=formVal.C1;
    console.log(formVal);
    this.GetAll();
  }
  
  selWal(formVal:any)
  {
    let mTmp = this.allTmp.find((wal: { WalletTypeId: any; }) => wal.WalletTypeId == formVal.C0);
    if(mTmp&&mTmp.WalletwsList[0]){
      this.defTmp=mTmp.WalletwsList.map(({ Id, Name }: { Id: number; Name: string }) => ({ name: Name, value: Id }));
      this.dynamicControls[1].options=this.defTmp;
    }
    else{
      this.dynamicControls[1].options=[];
    }
  }
  
  openPopup() {
    let dialogRef = this.dialog.open(this.addForm, {
      width: '800px',
      panelClass: 'screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.closePopup();
    })
  }
  
  closePopup(){
    this.dialog.closeAll();
  }
  
  ngOnDestroy() {
    if (this.loaderSubscriber) {
      this.loaderSubscriber.unsubscribe();
    }
    if(this.apiSubscriber[0]) {
      this.apiSubscriber[0].unsubscribe();
    }
  }
}