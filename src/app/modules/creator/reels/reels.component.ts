import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TitleHeaderComponent } from '@shared/title-header/title-header.component';
import { StatusPageComponent } from '../pages/status-page/status-page.component';
import { AdvanceTablePaginatorComponent } from '@shared/advance-table-paginator/advance-table-paginator.component';
import { CommonFunctionService } from '@services/common-function.service';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { MultiInputHeaderComponent } from '@shared/multi-input-header/multi-input-header.component';
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
// import { element } from 'protractor';

import { FormControl, FormsModule, FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
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
import { ApproveReelComponent } from './approve-reel/approve-reel.component';


@Component({
  selector: 'app-reels',
  imports: [TitleHeaderComponent,AdvanceTableComponent,AdvanceTablePaginatorComponent,ApproveReelComponent,
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
  templateUrl: './reels.component.html',
  styleUrl: './reels.component.scss'
})
export class ReelsComponent implements OnInit , OnDestroy {
  @ViewChild('AddReelDialogopen') AddReelDialogopen!: TemplateRef<any>;
  @ViewChild('ApproveReelDialogOpen') ApproveReelDialogOpen!: TemplateRef<any>;
  todayDate = new Date();
  refDate = new Date();
  dateValue: any=[new Date(this.refDate.setMonth(this.refDate.getMonth()-1)),new Date()];
  
  buttonData=[{name:'Export',disabled:true,value:'export'}];
  
  reelsCollumns:any = [];
  
  reelsCollumnHeaders:any = [
    [
      {value:'Sr. No.',bg:'white-drop'},
      {value:'Id',bg:'white-drop'},
      {value:'Video',bg:'white-drop'},
      {value:'URL',bg:'white-drop'},
      {value:'Description',bg:'white-drop'},
      {value:'Upload Date',bg:'white-drop'},
      {value:'View Count',bg:'white-drop'},
      {value:'Created By',bg:'white-drop'},
      {value:'Created Date',bg:'white-drop'},
      {value:'Updated Date',bg:'white-drop'},
      {value:'Profile',bg:'white-drop'},
      {value:'View',bg:'white-drop'},
      {value:'Status',bg:'white-drop'},
    ]
  ];
  
  allPageData: Array<{ TotalCount: number; Id: number; ImageUrl: string; URL: string; Handle: string; Description: string; UploadDate: string; ViewCount: number; CreatedBy: string; CreatedDate: string; CreatedDateTZ: string; ViewCreatedDate: string; Status: string; DCPageName: string; StatusId: any; }> = [];
  PageRows: Array<Array<{ value: any; bg: string; icon?: string; height?: string; width?: string; rounded?: number; sufText?: any; iconvalue?: string; }>> = [];
  
  pageNo=1;
  rowCount: any ={f:0,l:0,t:0};
  pageCount=[10,50,100,500,1000];
  pagesTotal=1;
  paginatorBlock:any=[];
  
  currentQuery = {"Dates":[this.dateValue[0],this.dateValue[1]],"Search": "","PageNo": 1,"PageSize": this.pageCount[0],"SiteCode":sessionStorage.getItem('selectedSite')};
  
  private loaderSubscriber!: Subscription;
  private apiSubscriber: Subscription[]=[];
  apiLoader={udl_list:false,udl_export:false};
  
  dIndex={status:{row:0,col:0,use:false}};
  SelectedDCPage={};
  AcceptRejectVar = '';
  pdataToView = {};
  constructor(private apiservice :ApiService, private utilities : CommonFunctionService, private dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.loaderSubscriber = this.apiservice.loaderService.loading$.subscribe((loading:any={}) => {
      this.apiLoader.udl_list=('getDCPromotion' in loading)?true:false;
    });
    this.GetReelsData(this.currentQuery);
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
  
  searchReelsData(searchQuery:any){
    this.currentQuery.Dates=searchQuery.Dates;
    this.currentQuery.PageNo = 1;
    this.currentQuery.Search = searchQuery.searchInput;
    this.GetReelsData(this.currentQuery);
  }
  
  onPaginatorChange(paginatorQuery:any){
    if(paginatorQuery.action=='next'){
      this.currentQuery.PageNo = this.currentQuery.PageNo+1;
    }
    else if(paginatorQuery.action=='previous'){
      this.currentQuery.PageNo = this.currentQuery.PageNo-1;
    }
    else if(paginatorQuery.action=='pageSize'){
      this.currentQuery.PageNo = 1;
      this.currentQuery.PageSize = paginatorQuery.pageSize;
    }
    else if(paginatorQuery.action=='pageNo'){
      this.currentQuery.PageNo = paginatorQuery.pageNo;
    }
    this.GetReelsData(this.currentQuery);
  }
  
  initializeData(){
    this.dIndex={status:{row:0,col:0,use:false}};
    this.PageRows=[];
    this.reelsCollumns=[];
    this.pagesTotal=1;
    this.buttonData[0].disabled=true;
    this.allPageData=[];
  }
  
  GetReelsData(searchQuery:any){
    let request = {
      "StartDateTime": moment(searchQuery.Dates[0]).format("MM-DD-yyyy"),
      "EndDateTime": moment(searchQuery.Dates[1]).format("MM-DD-yyyy"),
      "PageNo": searchQuery.PageNo,
      "PageSize": searchQuery.PageSize,
      "SiteCode": searchQuery.SiteCode,
      "Search":searchQuery.Search
    };
    this.initializeData();
    this.apiSubscriber[0] = this.apiservice.sendRequest(config['getDCPromotion'], request,'getDCPromotion').subscribe((data: any) => {
      this.currentQuery=searchQuery;
      this.allPageData=data;
      if(this.allPageData[0]){
        this.buttonData[0].disabled=false;
        this.reelsCollumns=this.reelsCollumnHeaders;
        this.pagesTotal=Math.ceil(this.allPageData[0].TotalCount/searchQuery.PageSize);
        this.allPageData.forEach((element:any,index:any) => {
          let ctz = element.CreatedDateTZ?" "+element.CreatedDateTZ:'';
          this.PageRows.push([
            {value:((this.currentQuery.PageNo-1)*this.currentQuery.PageSize)+(index+1),bg:'white-cell'},
            {value:element.Id,bg:'white-cell'},
            {value:element.ImageUrl,bg:'white-cell',icon:'Image',height:'11',width:'6',rounded:0.3},
            {value:element.URL,bg:'white-cell',sufText:element.Handle},
            {value:element.Description?(element.Description).slice(0,50)+' ...':'',bg:'white-cell'},
            {value:element.UploadDate?moment(element.UploadDate).format("h:mm:ss A, DD-MMM-yyyy"):'',bg:'white-cell'},
            {value:this.utilities.abbreviateNumber(element.ViewCount),bg:'white-cell'},
            {value:element.CreatedBy,bg:'white-cell'},
            {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss A, DD-MMM-yyyy")+ctz:'',bg:'white-cell'},
            {value:element.ViewCreatedDate?moment(element.ViewCreatedDate).format("h:mm:ss A, DD-MMM-yyyy"):'',bg:'white-cell'},
            {value:'',bg:'white-cell',icon:'feather',iconvalue:'instagram'},
            {value:'',bg:'white-cell',icon:'View'},
            {bg:'white-cell',icon:'Multi',value:[
              ...(element.Status=='Pending'?[{value:'Approve',bg:'white-cell',icon:'None'},{value:'Reject',bg:'white-cell',icon:'None'}]:[{value:element.Status,bg:'white-cell'}])
            ]
            }
          ])
        });
        this.rowCount={f:this.PageRows[0][0].value,l:this.PageRows[this.PageRows.length-1][0].value,t:this.allPageData[0].TotalCount};
        this.setPaginator();
      }
      else{
        this.rowCount={f:0,l:0,t:0};
        this.reelsCollumns=this.utilities.TableDataNone;
      }      
    }, (error) => {
      console.log(error);
    });
  }
  
  onValueChange(formVal:any){
    // console.log(formVal);
    if(formVal.col==10 && formVal.type=='instagram'){
      window.open('https://www.instagram.com/'+this.allPageData[formVal.row].Handle+'/reels/', '_blank');
    }
    if(formVal.col==2 && formVal.type=='Image'){
      window.open('https://www.instagram.com/reel/'+this.allPageData[formVal.row].URL+'/', '_blank');
    }
    if(formVal.col==11 && formVal.type=='View'){
      let extrabit = Math.floor(Math.random() * 20) + 1;
      window.open('/creator/reel-history/'+(this.allPageData[formVal.row].Id * 3 + extrabit)+'/'+extrabit+'/'+this.allPageData[formVal.row].DCPageName+'/'+this.allPageData[formVal.row].URL, '_blank');
    }
    if(formVal.col==12 && formVal.type=='Approve'){
      this.AcceptRejectVar="A";
      this.pdataToView=this.allPageData[formVal.row];
      this.ApproveOpenPopup();
    }
    if(formVal.col==12 && formVal.type=='Reject'){
      this.AcceptRejectVar="R";
      this.pdataToView=this.allPageData[formVal.row];
      // console.log(this.allPageData[formVal.row]);
      this.ApproveOpenPopup();
    }
  }

  ApproveOpenPopup() {
    let dialogRef = this.dialog.open(this.ApproveReelDialogOpen, {
      height: '900x',
      width: '600px',
      panelClass: 'screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {})
  }
  
  AddPageOpenPopup() {
    let dialogRef = this.dialog.open(this.AddReelDialogopen, {
      width: '800px',
      panelClass: 'screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
  
  ngOnDestroy(): void {
    if (this.loaderSubscriber) {
      this.loaderSubscriber.unsubscribe();
    }
    if(this.apiSubscriber[0]) {
      this.apiSubscriber[0].unsubscribe();
    }
  }
  
  closePopup(){
    this.dialog.closeAll();
  }
  
  AlterToggle(pageStatus: any){
    this.PageRows[this.dIndex.status.row][this.dIndex.status.col].value=pageStatus.value;
    this.allPageData[this.dIndex.status.row].StatusId=pageStatus.value;
  }
}