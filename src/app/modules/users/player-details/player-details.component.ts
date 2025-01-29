import { CommonFunctionService } from '@services/common-function.service';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';


import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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

import { DynaTableComponent } from '@shared/dyna-table/dyna-table.component';
import { PlayerDepositComponent } from '../player-deposit/player-deposit.component';
import { PlayerStatementComponent } from '../player-statement/player-statement.component';
import { PlayerWithdrawComponent } from '../player-withdraw/player-withdraw.component';
import { PlayerGamePlayedComponent } from '../player-game-played/player-game-played.component';
import { PlayerCallLogComponent } from '../player-call-log/player-call-log.component';
import { PlayerOnlineDepositComponent } from '../player-online-deposit/player-online-deposit.component';
import { PlayerDetailsIssueComponent } from '../player-details-issue/player-details-issue.component';
import { OnlineDepositWithdrawComponent } from '../online-deposit-withdraw/online-deposit-withdraw.component';
import { BlockUserComponent } from '../block-user/block-user.component';
import { EditRolloveramountComponent } from './edit-rolloveramount/edit-rolloveramount.component';
import { ActivatedRoute } from '@angular/router';
import { FeatherModule } from 'angular-feather';



@Component({
  selector: 'app-player-details',
  imports: [DynaTableComponent,PlayerDepositComponent,PlayerStatementComponent,PlayerWithdrawComponent,PlayerGamePlayedComponent,PlayerCallLogComponent,PlayerOnlineDepositComponent,PlayerDetailsIssueComponent,OnlineDepositWithdrawComponent,BlockUserComponent,EditRolloveramountComponent,
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
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.scss'
})
export class PlayerDetailsComponent implements OnInit {
  @ViewChild('DepositWithdrawPopUp') DepositWithdrawPopUp!: TemplateRef<any>;
  @ViewChild('BlockUserPopUp') BlockUserPopUp!: TemplateRef<any>;
  @ViewChild('playDepo')
  playDepoComp!: PlayerDepositComponent;
  @ViewChild('playStat') playStatComp!: PlayerStatementComponent;
  @ViewChild('playWith') playWithComp!: PlayerWithdrawComponent;
  @ViewChild('playCall') playCallComp!: PlayerCallLogComponent;
  @ViewChild('playGam') playGamComp!: PlayerGamePlayedComponent;
  @ViewChild('playOnDepo') playOnDepoComp!: PlayerOnlineDepositComponent;
  @ViewChild('editRollAmount') editRollAmount!:TemplateRef<any> ;
  BasicDetail:any=[];
  isReal=0;
  pagesTotal=1;
  paginatorBlock:any=[];
  dynamicControls = [{placeholder:'Search',type:'text',label:'Search'}];
  userId = 0;
  UserCollumnLoading = false;
  isCredit=false;
  walSelected=true;
  hasDepositAccess=0;
  walList: { WalletTypeId: number; [key: string]: any }[] = [];
  selectedPlayerWal: any = "";
  walTable: any =[];
  rowCount: any ={f:0,l:0,t:0};
  walId: any =1;
  UserCollumnHeaders = [
    [
      {value:'Sr. No.',bg:'white-drop'}, {value:'Wallet Name',bg:'white-drop'},{value:'Rating',bg:'white-drop'},
       {value:'Code',bg:'white-drop'}, {value:'Type',bg:'white-drop'},
      {value:'Symbol',bg:'white-drop'}, {value:'Unique ID',bg:'white-drop'},
      {value:'Complete Level Name',bg:'white-drop'},{value:'Current Level Name',bg:'white-drop'},
      {value:'Current Level Criteria',bg:'white-drop'}, {value:'Balance',bg:'white-drop'},
      {value:'Deposit',bg:'white-drop'}, {value:'Bonus',bg:'white-drop'},
     {value:'Total Deposit',bg:'white-drop'},{value:'Total Withdraw',bg:'white-drop'},
     {value:'Normal Rollover Amount',bg:'white-drop'},{value:'Slots Rollover Amount',bg:'white-drop'},
     {value:'Sports Rollover Amount',bg:'white-drop'},
     {value:'Crash Rollover Amount',bg:'white-drop'},
     {value:'Table Rollover Amount',bg:'white-drop'},
     {value:'Fishing Rollover Amount',bg:'white-drop'},
     {value:'Live Rollover Amount',bg:'white-drop'},
     {value:'Action',bg:'white-drop'}
    ]
  ];
  walObj:any={};
  rowData:any ;
  UserDataCollumns=this.UserCollumnHeaders;
  personDetails = JSON.parse(localStorage.getItem('personalDetails') || '{}');
  constructor(private apiservice: ApiService, private utilities: CommonFunctionService,private route: ActivatedRoute, private dialog: MatDialog) { }
  
  ngOnInit(): void {
    let paramId = this.route.snapshot.paramMap.get('id');
    if(paramId){
      this.userId = parseInt(paramId);
      this.GetUserDetails();
    }
  }
  
  setPlayerWal(wId:any){
    this.selectedPlayerWal = wId;
    this.walObj=this.walList.find(obj => obj.WalletTypeId == wId);
    if(this.playDepoComp){
      this.playDepoComp.GetUserStatement(this.selectedPlayerWal);
    }
    if(this.playStatComp){
      this.playStatComp.GetUserStatement(this.selectedPlayerWal);
    }
    if(this.playWithComp){
      this.playWithComp.GetUserStatement(this.selectedPlayerWal);
    }
    if(this.playCallComp){
      this.playCallComp.GetUserStatement(this.selectedPlayerWal);
    }
    if(this.playGamComp){
      this.playGamComp.GetUserStatement(this.selectedPlayerWal);
    }
    if(this.playOnDepoComp){
      this.playOnDepoComp.GetUserStatement(this.selectedPlayerWal);
    }
  }
  
  copytoclipboard(hashid: any) {
    navigator.clipboard.writeText(hashid);
    this.utilities.toastMsg('success','Copied : ',hashid);
  }
  
  initializeData()
  {
    this.UserCollumnLoading = true;
    this.BasicDetail = {};
    this.walTable=[];
    this.walList=[];
    this.UserDataCollumns=this.UserCollumnHeaders;
  }
  
  GetUserDetails()
  {
    this.initializeData();
    let params = config['getUserData']+'?UserId='+this.userId;
    this.apiservice.getRequest(params,'getUserData').subscribe((data: any) => {
      if(data){
        this.walList=data.Wallets;
        this.selectedPlayerWal=this.walList[0].WalletTypeId;
        this.walObj=this.walList[0];
        this.UserCollumnLoading = false;
        this.BasicDetail=data;
        this.BasicDetail.newUId=(this.BasicDetail.UniqueId).slice(0,30)+' ...';
        if(this.BasicDetail.Wallets[0]){
          this.BasicDetail.Wallets.forEach((element:any,index:any) => {
            this.walTable.push(
              {rInfo:[{value:index+1,bg:'white-cell'},
              {value:element.WalletName,bg:'white-cell'},
              {value:element.Rating,bg:'white-cell'},
              {value:element.WalletCode,bg:'white-cell'},
              {value:element.CurrencyType,bg:'white-cell'},
              {value:'',inHTML:element.CurrencySymbol,HTMLstyle:'innerHTML',bg:'white-cell'},
              // {value:element.WalletUniqueId.slice(0,8)+' ... (Copy)',bg:'white-cell',icon:"None"},
              {bg:'white-cell',icon:'Multi',value:[{value:element.WalletUniqueId.slice(0,8)+' ...',bg:'white-cell'},{value:'',bg:'white-cell',icon:'feather_only',iconvalue:'copy',color:"#12a0ff"}]},
              {value:element.LevelName,bg:'white-cell'},
              {value:element.NextLevelName,bg:'white-cell'},
              // {value:"Deposit Amount: "+element.NextLevelDepositAmtCriteria+"Bets Amount: "+element.NextLevelDepositAmtCriteria,bg:'white-cell'},
              {bg:'white-cell',icon:'Multi',value:[
                ...(element.NextLevelDepositAmtCriteria?[{value:['Deposit Amount : '+element.NextLevelDepositAmtCriteria]}]:[{value:''}]),
                {brLine:element.NextLevelBetAmtCriteria?true:false},
                ...(element.NextLevelBetAmtCriteria?[{value:['Bets Amount : '+element.NextLevelBetAmtCriteria]}]:[{value:''}]),
              
              ]},
              {value:element.AccountBalance,bg:'white-cell'},
              {value:element.DepositAmount,bg:'white-cell'},
              {value:element.BonusAmount,bg:'white-cell'},
              {value:element.TotalDepositAmount,bg:'white-cell'},
              {value:element.TotalWithdrawAmount,bg:'white-cell'},
              {value:element.NormalRolloverAmount,bg:'white-cell'},
              {value:element.SlotsRolloverAmount,bg:'white-cell'},
              {value:element.SportsRolloverAmount,bg:'white-cell'},
              {value:element.CrashRolloverAmount,bg:'white-cell'},
              {value:element.TableRolloverAmount,bg:'white-cell'},
              {value:element.FishingRolloverAmount,bg:'white-cell'},
              {value:element.LiveRolloverAmount,bg:'white-cell'},
              {value:(this.personDetails.RoleCode == 'SA' || this.personDetails.RoleCode == 'BOH' || this.personDetails.RoleCode == 'BO')?'Edit':'',bg:'white-cell',icon:(this.personDetails.RoleCode == 'SA' || this.personDetails.RoleCode == 'BOH' || this.personDetails.RoleCode == 'BO')?'None':''}
            ],
              rData:element
            })
          });
          this.rowCount={f:1,l:this.BasicDetail.Wallets[this.BasicDetail.Wallets.length-1],t:this.BasicDetail.Wallets.length};
          this.apiservice.getRequest(config['hasDepositAccess'],'hasDepositAccess').subscribe((data2: any) => {
            this.hasDepositAccess = data2;
            if(this.hasDepositAccess==1||this.hasDepositAccess==2){
              this.UserDataCollumns=[[ ...this.UserCollumnHeaders[0] ,{value:'Deposit',bg:'white-drop'},{value:'Withdraw',bg:'white-drop'}]];
              this.BasicDetail.Wallets.forEach((element:any,index:any) => {
                this.walTable[index].rInfo.push(
                  {value:'Deposit',bg:'white-cell',icon:'None'},
                  ...(element.IsRealMoney==1?[{value:'Withdraw',bg:'white-cell',icon:'None'}]:[{value:'',bg:'white-cell'}])
                )
              });
            }
          }, (error) => {
            this.UserCollumnLoading = false;
            console.log(error);
          });
        }
        else{
          this.rowCount={f:0,l:0,t:0};
          this.UserDataCollumns=this.utilities.TableDataNone;
        }
      }
      else{
        this.UserCollumnLoading = false;
      }
    }, (error) => {
      this.UserCollumnLoading = false;
      console.log(error);
    });
  }


  
  DepositOpen() {
    this.isCredit=true;
    let dialogRef = this.dialog.open(this.DepositWithdrawPopUp, {
      width: '800px',
      panelClass: 'screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
  
  BlockToggle(){
    let dialogRef = this.dialog.open(this.BlockUserPopUp, {
      width: '400px',
      panelClass: 'screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {});    
  }
  
  WithdrawOpen(){
    this.isCredit=false;
    let dialogRef = this.dialog.open(this.DepositWithdrawPopUp, {
      width: '800px',
      panelClass: 'screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
  
  closePopup(){
    this.dialog.closeAll();
  }
  
  onSavePopup(){
    this.GetUserDetails();
  }

  onValueChange(formVal: any){
    // console.log(formVal);
    if(formVal.type=='Deposit'){
      this.isReal=formVal.data.IsRealMoney;
      this.walId=formVal.data.WalletTypeId;
      this.DepositOpen();
    }
    else if(formVal.type=='Withdraw'){
      this.walId=formVal.data.WalletTypeId;
      this.WithdrawOpen();
    }
    else if (formVal.type.includes("copy")){
      this.copytoclipboard(formVal.data.WalletUniqueId);
    }else if(formVal.type == 'Edit'){
      
      this.walId=formVal.data.WalletTypeId;
      this.rowData=formVal.data;
      let dialogRefedit = this.dialog.open(this.editRollAmount, {
        width: '800px',
        panelClass: 'screen-dialog',
      });
      dialogRefedit.afterClosed().subscribe(result => {});
    }
  }
}