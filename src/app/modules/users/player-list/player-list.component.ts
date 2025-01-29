
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
import { AdvanceTitleHeadNewComponent } from '@shared/advance-title-head-new/advance-title-head-new.component';
import { AdvanceTablePaginatorComponent } from '@shared/advance-table-paginator/advance-table-paginator.component';
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
import { ConversationComponent } from '../player-details/conversation/conversation.component';

interface Wallet {
  Id: number;
  Name: string;
  Code: string;
}
@Component({
  selector: 'app-player-list',
  imports: [AdvanceTitleHeadNewComponent,AdvanceTablePaginatorComponent,AdvanceTableComponent,ConversationComponent,
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
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent implements OnInit {
  @ViewChild('viewConversation') viewConversation!: TemplateRef<any>;
  AllUserinfo:any=[];
  UserinfoData:any=[];
  rowCount: any ={f:0,l:0,t:0};
  pageCount=[10,50,100,500,1000];
  pagesTotal=1;
  paginatorBlock:any=[];
  userId :Number=0
  userWals:Wallet[] = JSON.parse(sessionStorage.getItem('WalList')|| '{}');
  dynamicControls = [
    {changeAction:'submit',que:'wallet',type:'dropdown',default:parseInt(sessionStorage.getItem('WalChosen') || '{}'),options:this.userWals.map(({Id, Name, Code}) => ({ op:Name+' - '+Code, val:Id })),subque:[]},
    {que:'PlayerId',type:'input',subque:[]},
    {que:'Search',type:'input',subque:[]}
  ];
  UserCollumnHeaders:any = [
    [{value:'Sr. No.',bg:'white-drop'},{value:'Id',bg:'white-drop'},{value:'Name',bg:'white-drop'},{value:'User Name',bg:'white-drop'},{value:'Mobile',bg:'white-drop'},{value:'Amount',bg:'white-drop'},{value:'Rating',bg:'white-drop'},{value:'Player Age',bg:'white-drop'},{value:'Date',bg:'white-drop'},{value:'View',bg:'white-drop'}]
  ]
  UserDataCollumns=this.UserCollumnHeaders;
  UserCollumnLoading = false;
  currentQuery={"Search": "","PageNo": 1,"PageSize": this.pageCount[0],"SiteCode": sessionStorage.getItem('selectedSite'),"WalletTypeId":sessionStorage.getItem('WalChosen'),"PlayerId":""};
  private apiSubscriber: Subscription[]=[]
  constructor(private apiservice: ApiService, private utilities: CommonFunctionService,private dialog:MatDialog) { }
  
  ngOnInit(): void {
    this.GetAllUsers();
  }
  
  initializeData()
  {
    this.UserCollumnLoading = true;
    this.AllUserinfo = [];
    this.UserinfoData = [];
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
    this.GetAllUsers();
  }
  
  GetAllUsers() {
    this.initializeData();
    this.apiSubscriber[0] = this.apiservice.sendRequest(config['getAllPlayer'], this.currentQuery).subscribe((data: any) => {
      this.UserCollumnLoading = false;
      this.AllUserinfo=data;
      console.log("this.AllUserinfo:-", this.AllUserinfo);
      if(this.AllUserinfo[0]){
        this.UserDataCollumns=this.UserCollumnHeaders;
        this.pagesTotal=Math.ceil(this.AllUserinfo[0].TotalCount/this.currentQuery.PageSize);
        this.AllUserinfo.forEach((element:any,index:any) => {
          let ctz = element.CreatedDateTZ?" "+element.CreatedDateTZ:'';
          this.UserinfoData.push([
          {value:((this.currentQuery.PageNo-1)*this.currentQuery.PageSize)+(index+1),bg:'white-cell'},
          {value:element.UserId,bg:'white-cell'},
          {value:element.FName,bg:'white-cell'},
          {value:element.UserName,bg:'white-cell'},
          {value:element.Mobile,bg:'white-cell'},
          {value:element.CurrencyType+' '+this.utilities.roundOffNum(element.AccountBalance),bg:'white-cell'},
          {value:element.Rating,bg:'white-cell'},
          {value:element.PlayerAge,bg:'white-cell'},
          {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss A, DD-MMM-yyyy")+ctz:'',bg:'white-cell'},
          {bg:'white-cell',icon:'Multi',value:[
            ...([{value:'View',bg:'white-cell',icon:'None'}]),
            ...([{value:'Add Conversation',bg:'white-cell',icon:'None'}]),
          ] }
          ])
        });
        this.rowCount={f:this.UserinfoData[0][0].value,l:this.UserinfoData[this.UserinfoData.length-1][0].value,t:this.AllUserinfo[0].TotalCount};
        this.setPaginator();
      }
      else{
        this.rowCount={f:0,l:0,t:0};
        this.UserDataCollumns=this.utilities.TableDataNone;
      }
    }, (error) => {
      this.UserCollumnLoading = false;
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
    if(formVal.type=='View'){
      window.open('/users/playerdetailview/'+this.AllUserinfo[formVal.row].UserId, '_blank');
    } else
    if(formVal.type=='Add Conversation'){
      this.userId = this.AllUserinfo[formVal.row].UserId;
      this.addConver();
    }
  }
  addConver(){
    let dialogRef = this.dialog.open(this.viewConversation, {
      height: '900x',
      width: '800px',
      panelClass: 'screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {})
  }
  getSearchQuery(formVal:any){
    this.currentQuery.Search=formVal.Search.value;
    this.currentQuery.PageNo = 1;
    this.currentQuery.WalletTypeId = formVal.wallet.value;
    this.currentQuery.PlayerId = formVal.PlayerId.value;
    sessionStorage.setItem('WalChosen',formVal.wallet.value);
    this.GetAllUsers();
  }

  ngOnDestroy() {
    if(this.apiSubscriber[0]) {
      this.apiSubscriber[0].unsubscribe();
    }
  }
  back(){
    this.dialog.closeAll();
  }
}