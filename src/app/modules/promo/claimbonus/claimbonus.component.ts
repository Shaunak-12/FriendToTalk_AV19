import { Component, OnInit, Input, Output, EventEmitter,OnDestroy, TemplateRef, ViewChild  } from '@angular/core';
import { CommonFunctionService } from '@services/common-function.service';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { Target } from 'angular-feather/icons';
import { environment } from 'environments/environment';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { AdvanceTablePaginatorComponent } from '@shared/advance-table-paginator/advance-table-paginator.component';
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
// import { element } from 'protractor';
import { FormControl, FormsModule, FormBuilder, FormGroup,Validators, FormArray, AbstractControl } from '@angular/forms';
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
import { AdvanceTitleHeadNewComponent } from '@shared/advance-title-head-new/advance-title-head-new.component';

@Component({
  selector: 'app-claimbonus',
  imports: [AdvanceTitleHeadNewComponent,AdvanceTableComponent,AdvanceTablePaginatorComponent,
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
  templateUrl: './claimbonus.component.html',
  styleUrl: './claimbonus.component.scss'
})
export class ClaimbonusComponent implements OnInit, OnDestroy {
  AllDatainfo:any=[];
  AllData:any=[];
  rowCount:any ={f:0,l:0,t:0};
  pageCount=[10,50,100,500,1000];
  pagesTotal=1;
  paginatorBlock:any=[];
  finList = (JSON.parse(sessionStorage.getItem('WalList')||'{}'));
  dynamicControls = [
    {changeAction:'submit',que:'wallet',type:'dropdown',default:parseInt(sessionStorage.getItem('WalChosen')||'{}'),options:this.finList.map(({Id, Name, Code}:{Id: any; Name: any; Code: any;}) => ({ op:Name+' - '+Code, val:Id })),subque:[]},
    {changeAction:'submit',que:'param',type:'dropdown',default:'',options:[{op:'All',val:''},{op:'Approved',val:'A'},{op:'Pending',val:'P'}],subque:[]},
    {que:'Search',type:'input',subque:[]}
  ];
  UserCollumnHeaders:any = [
    [{value:'Sr. No.',bg:'white-drop'},{value:'User Id',bg:'white-drop'},{value:'User Name',bg:'white-drop'},
    {value:'Mobile',bg:'white-drop'},{value:'Amount',bg:'white-drop'},
    {value:'Description',bg:'white-drop'},{value:'Status',bg:'white-drop'},{value:'Wallet',bg:'white-drop'},{value:'Created Date',bg:'white-drop'},{value:'Updated Date',bg:'white-drop'}]
  ];
  UserDataCollumns=this.UserCollumnHeaders;
  currentQuery={"Search": '',"PageNo": 1,"PageSize": this.pageCount[2],"Param":"A","SiteCode": sessionStorage.getItem('selectedSite'),"WalletTypeId":sessionStorage.getItem('WalChosen')};
  private loaderSubscriber!: Subscription;
  private apiSubscriber: Subscription[]=[];
  apiLoader={crc_list:false};
  constructor(private apiservice: ApiService, private utilities: CommonFunctionService,private dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.loaderSubscriber = this.apiservice.loaderService.loading$.subscribe((loading:any={}) => {
      this.apiLoader.crc_list=('getScratchCardData' in loading)?true:false;
    });
    this.GetAllCallRequests();
  }
  
  initializeData()
  {
    this.AllDatainfo = [];
    this.AllData = [];
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
    this.apiSubscriber[0] = this.apiservice.getRequest(config['getScratchCardData']+this.utilities.setForGetNew(this.currentQuery), 'getScratchCardData').subscribe((data: any) => {
      this.AllDatainfo=data;
      if(this.AllDatainfo[0]){
        this.UserDataCollumns=this.UserCollumnHeaders;
        this.pagesTotal=Math.ceil(this.AllDatainfo[0].TotalCount/this.currentQuery.PageSize);
        this.AllDatainfo.forEach((element:any,index:any) => {
          this.AllData.push([
            {value:((this.currentQuery.PageNo-1)*this.currentQuery.PageSize)+(index+1),bg:'white-cell'},
            {value:element.UserId,bg:'white-cell'},
            {value:element.UserName,bg:'white-cell'},
            {value:element.Mobile,bg:'white-cell'},
            {value:element.CurrencyType+' '+this.utilities.roundOffNum(element.Amount),bg:'white-cell'},
            {value:element.Description,bg:'white-cell'},
            {value:element.Status=='A'?'Approved':'Pending',bg:'white-cell'},
            {value:element.Code,bg:'white-cell'},
            {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss A, DD-MMM-yyyy")+" "+element.CreatedDateTZ:'',bg:'white-cell'},
            {value:element.UpdatedDate?moment(element.UpdatedDate).format("h:mm:ss A, DD-MMM-yyyy")+" "+element.CreatedDateTZ:'',bg:'white-cell'},
          ])
        });
        this.rowCount={f:this.AllData[0][0].value,l:this.AllData[this.AllData.length-1][0].value,t:this.AllDatainfo[0].TotalCount};
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
  
  onSavePopup(){
    this.GetAllCallRequests();
    this.dialog.closeAll();
  }
  
  getSearchQuery(formVal:any)
  {
    this.currentQuery.Param=formVal.param.value;
    this.currentQuery.Search=formVal.Search.value?formVal.Search.value:'';
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
  }
}