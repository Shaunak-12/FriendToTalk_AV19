import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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

@Component({
  selector: 'app-reel-history',
  imports: [TitleHeaderComponent, AdvanceTableComponent,AdvanceTablePaginatorComponent,
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
  templateUrl: './reel-history.component.html',
  styleUrl: './reel-history.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
})
export class ReelHistoryComponent implements OnInit , OnDestroy {
  @ViewChild('AddPageDialogopen') AddPageDialogopen!: TemplateRef<any>;
  @ViewChild('BlockUserPopUp') BlockUserPopUp!: TemplateRef<any>;
  todayDate = new Date();
  refDate = new Date();
  dateValue: any=[new Date(this.refDate.setMonth(this.refDate.getMonth()-1)),new Date()];
  
  buttonData=[{name:'Export',disabled:true,value:'export'}];
  
  rHistoryCollumns:any = [];
  
  rHistoryCollumnHeaders:any = [
    [
      {value:'Sr. No.',bg:'white-drop'},
      {value:'View Count',bg:'white-drop'},
      {value:'Created Date',bg:'white-drop'},
    ]
  ];
  
  allPageData: { TotalCount: number; CreatedDateTZ?: string; ViewCount: number; CreatedDate?: string; }[] = [];
  PageRows: { value: any; bg: string; }[] = [];
  
  pageNo=1;
  rowCount: any ={f:0,l:0,t:0};
  pageCount=[10,50,100,500,1000];
  pagesTotal=1;
  paginatorBlock:any=[];

  // reelId: any;
  // pageName: any;
  // reelName: any;

  reelId!: number;
  pageName!: string | null;
  reelName!: string | null;
  currentQuery: any;
  
  private loaderSubscriber!: Subscription;
  private apiSubscriber: Subscription[]=[];
  apiLoader={udl_list:false,udl_export:false};


  
  constructor(private apiservice :ApiService, private utilities : CommonFunctionService, private route: ActivatedRoute) {
    this.reelId = ((parseInt(this.route.snapshot.paramMap.get('id')||'')-parseInt(this.route.snapshot.paramMap.get('extrabit')||''))/3);
    this.pageName = this.route.snapshot.paramMap.get('pname');
    this.reelName = this.route.snapshot.paramMap.get('rname');
    this.currentQuery = {"Dates":[this.dateValue[0],this.dateValue[1]],"intParam1": this.reelId,"PageNo": 1,"PageSize": this.pageCount[0],"SiteCode":sessionStorage.getItem('selectedSite')};
  }
  
  ngOnInit(): void {
    this.loaderSubscriber = this.apiservice.loaderService.loading$.subscribe((loading:any={}) => {
      this.apiLoader.udl_list=('getDCViewHistoryViaId' in loading)?true:false;
    });
    this.GetPagesData(this.currentQuery);
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
  
  searchPagesData(searchQuery:any){
    this.currentQuery.Dates=searchQuery.Dates;
    this.currentQuery.PageNo = 1;
    this.GetPagesData(this.currentQuery);
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
    this.GetPagesData(this.currentQuery);
  }
  
  initializeData(){
    this.PageRows=[];
    this.rHistoryCollumns=[];
    this.pagesTotal=1;
    this.buttonData[0].disabled=true;
    this.allPageData=[];
  }
  
  GetPagesData(searchQuery:any){
    let request = {
      "StartDateTime": moment(searchQuery.Dates[0]).format("MM-DD-yyyy"),
      "EndDateTime": moment(searchQuery.Dates[1]).format("MM-DD-yyyy"),
      "PageNo": searchQuery.PageNo,
      "PageSize": searchQuery.PageSize,
      "SiteCode": searchQuery.SiteCode,
      "intParam1":searchQuery.intParam1
    };
    this.initializeData();
    this.apiSubscriber[0] = this.apiservice.sendRequest(config['getDCViewHistoryViaId'], request,'getDCViewHistoryViaId').subscribe((data: any) => {
      this.currentQuery=searchQuery;
      this.allPageData=data;
      if(this.allPageData[0]){
        this.buttonData[0].disabled=false;
        this.rHistoryCollumns=this.rHistoryCollumnHeaders;
        this.pagesTotal=Math.ceil(this.allPageData[0].TotalCount/searchQuery.PageSize);
        this.allPageData.forEach((element:any,index:any) => {
          let ctz = element.CreatedDateTZ?" "+element.CreatedDateTZ:'';
          this.PageRows.push(
            {value:((this.currentQuery.PageNo-1)*this.currentQuery.PageSize)+(index+1),bg:'white-cell'},
            {value: this.utilities.abbreviateNumber(element.ViewCount),bg:'white-cell'},
            {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss A, DD-MMM-yyyy")+ctz:'',bg:'white-cell'},
          )
        });
        this.rowCount={f:this.PageRows[0].value,l:this.PageRows[this.PageRows.length-1].value,t:this.allPageData[0].TotalCount};
        this.setPaginator();
      }
      else{
        this.rowCount={f:0,l:0,t:0};
        this.rHistoryCollumns=this.utilities.TableDataNone;
      }      
    }, (error) => {
      console.log(error);
    });
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
