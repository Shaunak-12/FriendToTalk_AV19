import { CommonFunctionService } from '@services/common-function.service';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';


import { CommonModule } from '@angular/common';
import { Component, OnInit,TemplateRef, ViewChild, Input, Output, EventEmitter,OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
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
import { MultiInputHeaderComponent } from '@shared/multi-input-header/multi-input-header.component';
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
import { AddFormComponent } from './add-form/add-form.component';

@Component({
  selector: 'app-group',
  imports: [MultiInputHeaderComponent,AdvanceTableComponent,AddFormComponent,
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
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent implements OnInit {
  @ViewChild('addForm') addForm!: TemplateRef<any>;
  AllGrpInfo:any=[];
  grpDataInfo:any=[];
  rowCount: any={f:0,l:0,t:0};
  pageCount=[10,50,100,500,1000];
  pagesTotal=1;
  udataToView: any ={};
  AcceptRejectVar="A";
  paginatorBlock:any=[];
  dynamicControls = [{placeholder:'Search',type:'text',label:'Search'}];
  UserCollumnHeaders:any = [
    [{value:'Sr. No.',bg:'white-drop'},{value:'Status',bg:'white-drop'},{value:'Id',bg:'white-drop'},{value:'Name',bg:'white-drop'},{value:'Created Date',bg:'white-drop'},{value:'Updated Date',bg:'white-drop'}]
  ];
  dIndex={status:{row:0,col:0,use:false}}
  UserDataCollumns=this.UserCollumnHeaders;
  currentQuery={"Search": "","SiteCode":sessionStorage.getItem('selectedSite'),"WalletTypeId":sessionStorage.getItem('WalChosen')};
  private loaderSubscriber!: Subscription;
  private apiSubscriber: Subscription[]=[];
  apiLoader={crc_list:false};
  constructor(private apiservice: ApiService, private utilities: CommonFunctionService,private dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.loaderSubscriber = this.apiservice.loaderService.loading$.subscribe((loading:any={}) => {
      this.apiLoader.crc_list=('getVGrpMst' in loading)?true:false;
      if (this.dIndex.status.use) {
        if (this.grpDataInfo && this.grpDataInfo[this.dIndex.status.row] && this.grpDataInfo[this.dIndex.status.row][this.dIndex.status.col]) {
          const errorInfo = this.grpDataInfo[this.dIndex.status.row][this.dIndex.status.col];
          errorInfo['loader'] = 'setGrpName' in loading ? true : false;
        }
      }
    });
    this.GetAll();
  }
  
  initializeData()
  {
    this.AllGrpInfo = [];
    this.grpDataInfo = [];
    this.udataToView = {};
    this.currentQuery.WalletTypeId=sessionStorage.getItem('WalChosen');
  }
  
  onPaginatorChange(paginatorQuery:any){
    if(paginatorQuery.action=='pageSize'){
      // this.currentQuery.PageNo = 1;
      // this.currentQuery.PageSize = paginatorQuery.pageSize;
    }
    else if(paginatorQuery.action=='pageNo'){
      // this.currentQuery.PageNo = paginatorQuery.pageNo;
    }
    this.GetAll();
  }
  
  GetAll() {
    this.initializeData();
    this.apiSubscriber[0] = this.apiservice.sendRequest(config['getVGrpMst'],this.currentQuery, 'getVGrpMst').subscribe((data: any) => {
      this.AllGrpInfo=data;
      if(this.AllGrpInfo[0]){
        this.UserDataCollumns=this.UserCollumnHeaders;
        // this.pagesTotal=Math.ceil(this.AllGrpInfo[0].TotalCount/this.currentQuery.PageSize);
        this.AllGrpInfo.forEach((element:any,index:any) => {
          let ctz = element.CreatedDateTZ?" "+element.CreatedDateTZ:'';
          this.grpDataInfo.push([
            {value:(index+1),bg:'white-cell'},
            {value:element.IsActive,bg:'white-cell',icon:'Toggle'},
            {value:element.Id,bg:'white-cell'},
            {value:element.Name ,bg:'white-cell',icon:'Textarea',loader:false},
            {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss A, DD-MMM-yyyy")+ctz:'',bg:'white-cell'},
            {value:element.UpdatedDate?moment(element.UpdatedDate).format("h:mm:ss A, DD-MMM-yyyy")+ctz:'',bg:'white-cell'},
          ])
        });
        this.rowCount={f:this.grpDataInfo[0][0].value,l:this.grpDataInfo[this.grpDataInfo.length-1][0].value,t:this.AllGrpInfo[0].TotalCount};
        // this.setPaginator();
      }
      else{
        this.rowCount={f:0,l:0,t:0};
        this.UserDataCollumns=this.utilities.TableDataNone;
      }
    }, (error) => {
      console.log(error);
    });
  }
  
  // setPaginator(){
  //   this.paginatorBlock = [];
  //   if (this.currentQuery.PageNo <= 4) {
  //     for (let i = 1; i <= 10 && i <= this.pagesTotal; i++) {
  //       this.paginatorBlock.push(i);
  //     }
  //   }
  //   else {
  //     for (let i = this.currentQuery.PageNo - 3; i <= this.currentQuery.PageNo + 6 && i <= this.pagesTotal; i++) {
  //       this.paginatorBlock.push(i);
  //     }
  //   }
  // }
  
  curG:any={};
  
  
  onValueChange(InpVal:any){
    if(InpVal.type=='Toggle'){
      this.curG=this.AllGrpInfo[InpVal.row];
      this.grpDataInfo[InpVal.row][InpVal.col].icon='Loading';
      this.ChangeGroupStatus(InpVal)
    }
    else if(InpVal.type=="Textarea"){
      this.dIndex.status.use = true;
      this.dIndex.status.row = InpVal.row;
      this.dIndex.status.col = InpVal.col;
      this.udataToView=this.AllGrpInfo[InpVal.row];
      let param = {
        "Id":this.udataToView['Id'],
        "Name":InpVal.value,
      }
      this.setGroupName(param);
    }
  }
  
  setGroupName(param:any){
    let gpar = this.utilities.setForGetNew(param)
    this.apiservice.getRequest(config['setGrpName']+gpar,'setGrpName').subscribe((data: any)=>{
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
    });
  }
  
  ChangeGroupStatus(InpVal:any){
    let param = config['setGrpStat'] + '?Id='+this.curG.Id;
    this.apiservice.getRequest(param,'setGrpStat').subscribe((data: any) => {
      if(data.ErrorCode=='1'){
        this.utilities.toastMsg("success", "Success", data.ErrorMessage);
        this.grpDataInfo[InpVal.row][InpVal.col].value=InpVal.value?1:0;
        this.grpDataInfo[InpVal.row][InpVal.col].icon='Toggle';
      }
      else{
        this.utilities.toastMsg("error", "Error", data.ErrorMessage);
        this.grpDataInfo[InpVal.row][InpVal.col].icon='Toggle';
      }
    }, (error) => {
      this.utilities.toastMsg("error", "Can not process", '');
      console.log(error);
    });
  }
  
  getSearchQuery(formVal:any)
  {
    this.currentQuery.Search=formVal.C0;
    // currentQuery.WalletTypeId
    this.GetAll();
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
