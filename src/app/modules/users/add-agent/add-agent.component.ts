import { AdvanceTablePaginatorComponent } from '@shared/advance-table-paginator/advance-table-paginator.component';
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
import { AdvanceTitleHeadNewComponent } from '@shared/advance-title-head-new/advance-title-head-new.component';
import { StatusChangeComponent } from './status-change/status-change.component';

import { CommonFunctionService } from '@services/common-function.service';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';


import { CommonModule } from '@angular/common';
import { Component, OnInit,TemplateRef, ViewChild, Input, Output, EventEmitter,OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {FormControl,FormsModule,FormBuilder, FormGroup, FormArray, AbstractControl} from '@angular/forms';
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
  selector: 'app-add-agent',
  imports: [AdvanceTitleHeadNewComponent, AdvanceTableComponent, AdvanceTablePaginatorComponent, StatusChangeComponent,
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
  templateUrl: './add-agent.component.html',
  styleUrl: './add-agent.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  
})
export class AddAgentComponent implements OnInit {
  @ViewChild('AddAdminDialogOpen') AddAdminDialogOpen!: TemplateRef<any>;
  AllAdmininfo:any=[];
  AdmininfoData:any=[];
  maxDate = new Date();
  rowCount={f:0,l:0,t:0};
  pageCount=[10,50,100,500,1000];
  pagesTotal=1;
  udataToView={};
  AcceptRejectVar="A";
  paginatorBlock:any=[];
  adminData :any= []
  dynamicControls = [
    { changeAction: 'submit', que: 'Type', type: 'dropdown', default: '', options: [{val:"All",op:'All'},{val:"A",op:'Approve'},{val:"R",op:'Reject'},{val:"P",op:'Pending'}], subque: [] },
    { que: 'Search', type: 'input', subque: [] }
  ];
  AdminCollumnHeaders:any = [
    [{value:'Sr. No.',bg:'white-drop'},{value:'Name',bg:'white-drop'},{value:'Gender',bg:'white-drop'},
    {value:'Mobile',bg:'white-drop'},{value:'Email',bg:'white-drop'},{value:'Role',bg:'white-drop'},
    {value:'Call/Chat Charges',bg:'white-drop'},{value:'Experience',bg:'white-drop'},{value:'Language',bg:'white-drop'},
    {value:'Status',bg:'white-drop'},{value:'Profile',bg:'white-drop'},{value:'Action',bg:'white-drop'}]
  ];
  AdminDataCollumns: any=[];
  currentQuery={ "Search": "", "PageNo": 1, "PageSize": this.pageCount[0],"SiteCode":sessionStorage.getItem('selectedSite'),"VerificationStatus":"All"};
  RolesList=[];
  addadminloader={getAdminRoles:false,getAllAdmins:false};
  dIndex={status:{row:0,col:0,use:false},depositAccess:{row:0,col:0,use:false},IMPSAccess:{row:0,col:0,use:false},roleChange:{row:0,col:0,use:false}};
  private loaderSubscriber!: Subscription;
  private apiSubscriber: Subscription[]=[];
  constructor(private apiservice: ApiService, private utilities: CommonFunctionService, private dialog: MatDialog) { }
  ngOnInit(): void
  {
    this.loaderSubscriber = this.apiservice.loaderService.loading$.subscribe((loading:any={}) => {
      this.addadminloader.getAllAdmins=('getAllAgent' in loading)?true:false;
    });
    this.GetAllAdmins();
  }

  initializeData(){
    this.AllAdmininfo=[];
    this.AdmininfoData=[];
    this.dIndex={status:{row:0,col:0,use:false},depositAccess:{row:0,col:0,use:false},IMPSAccess:{row:0,col:0,use:false},roleChange:{row:0,col:0,use:false}};
  }
  GetAllAdmins()
  {
    this.initializeData();
    this.apiservice.sendRequest(config['getAllAgent'], this.currentQuery, 'getAllAgent').subscribe((data: any) => {
      this.AllAdmininfo=data;

      console.log("this.AllAdmininfo:-", this.AllAdmininfo)
      if(this.AllAdmininfo[0]){

        this.AdminDataCollumns=this.AdminCollumnHeaders;
        this.pagesTotal=Math.ceil(this.AllAdmininfo[0].TotalCount/this.currentQuery.PageSize);
        this.AllAdmininfo.forEach((element:any,index:any) => {
          this.AdmininfoData.push([
            {value:((this.currentQuery.PageNo-1)*this.currentQuery.PageSize)+(index+1),bg:'white-cell'},
            {value:element.FName?(element.FName+' '+(element.LName?element.LName:'')):'',bg:'white-cell'},
            {value:element.Gender,bg:'white-cell'},
            {value:element.Mobile,bg:'white-cell'},
            {value:element.Email,bg:'white-cell'},
            {value:element.Topics,bg:'white-cell'},
            {bg:'white-cell',icon:"Multi",
              value:[
              {value:"Call Charges: "+element.CallCharges,bg:'white-cell'},
              {brLine:true},
              {value:"Chat Charges: "+element.ChatCharges,bg:'white-cell'},

            ]},
            {value:element.Experience,bg:'white-cell'},
            {value:element.Language,bg:'white-cell'},
            {value:element.Status,bg:'white-cell'},
            {value:element.ProfilePicName,bg:'white-cell'},
            {bg:'white-cell',icon:'Multi',value:[
              ...(element.VerificationStatus == 'P'?[{value:'Approve',bg:'white-cell',icon:'None'}]:[]),
              ...(element.VerificationStatus == 'P'?[{value:'Reject',bg:'white-cell',icon:'None'}]:[])
          ]},
          ])
        });
        this.rowCount={f:this.AdmininfoData[0][0].value,l:this.AdmininfoData[this.AdmininfoData.length-1][0].value,t:this.AllAdmininfo[0].TotalCount};
        this.setPaginator();
      }
      else{
        this.rowCount={f:0,l:0,t:0};
        this.AdminDataCollumns=this.utilities.TableDataNone;
      }
    }, (error) => {
      console.log(error);
    });
  }
  getSearchQuery(formVal:any)
  {
    this.currentQuery.PageNo =  1;
    this.currentQuery.VerificationStatus=formVal.Type.value?formVal.Type.value:"";
    this.currentQuery.Search=formVal.Search.value?formVal.Search.value:"";

    this.GetAllAdmins();
  }
  onValueChange(formVal:any)
  {
     this.adminData = this.AllAdmininfo[formVal.row];
    if(formVal.type=='Approve'){
      this.adminData.customStatus = "A"
      this.AddAdminOpenPopup();
    }else if(formVal.type=='Reject'){
      this.adminData.customStatus = "R"
      this.AddAdminOpenPopup();

    }
  }

  AddAdminOpenPopup() {
    let dialogRef = this.dialog.open(this.AddAdminDialogOpen, {
      width: '800px',
      panelClass: 'screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {})
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
  onPaginatorChange(paginatorQuery:any){
    if(paginatorQuery.action=='pageSize'){
      this.currentQuery.PageNo = 1;
      this.currentQuery.PageSize = paginatorQuery.pageSize;
    }
    else if(paginatorQuery.action=='pageNo'){
      this.currentQuery.PageNo = paginatorQuery.pageNo;
    }
    this.GetAllAdmins();
  }
  closeAll(){
    this.dialog.closeAll();
    this.GetAllAdmins();
  }
}
