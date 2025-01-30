import { Component, OnInit, Input, Output, EventEmitter,OnDestroy, TemplateRef, ViewChild  } from '@angular/core';
import { CommonFunctionService } from '@services/common-function.service';
import { ApiService } from '@services/api.service';
import { config } from '@services/config';
import { Subscription } from 'rxjs';
import { Target } from 'angular-feather/icons';
import { environment } from 'environments/environment';
import moment from 'moment';
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
import { MultiInputHeaderComponent } from '@shared/multi-input-header/multi-input-header.component';
import { NewdepopromoComponent } from './newdepopromo/newdepopromo.component';

@Component({
  selector: 'app-depositpromo',
  imports: [MultiInputHeaderComponent,AdvanceTableComponent,NewdepopromoComponent,
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
  templateUrl: './depositpromo.component.html',
  styleUrl: './depositpromo.component.scss'
})
export class DepositpromoComponent implements OnInit, OnDestroy {
  @ViewChild('addForm') addForm!: TemplateRef<any>;
  @ViewChild('UDataDialogOpen') UDataDialogOpen!: TemplateRef<any>;
  @ViewChild('ApproveDialogOpen') ApproveDialogOpen!: TemplateRef<any>;
  AllPGinfo:any=[];
  PGinfoData:any=[];
  userWals = JSON.parse(sessionStorage.getItem('WalList')||'{}');
  defWal=this.userWals.filter((wal: { Id: number; }) => wal.Id == parseInt(sessionStorage.getItem('WalChosen')||'{}'))[0];
  dynamicControls = [{changeAction:'submit',type:'select',default:{name:this.defWal.Name+'-'+this.defWal.Code,value:this.defWal.Id},options:this.userWals.filter(({Id}:{Id: any;})=>Id!==this.defWal.Id).map(({Id,Name,Code}:{Id: any; Name: any; Code: any;})=>({name:Name+'-'+Code,value:Id}))},
  {placeholder:'Search',type:'text',label:'Search'}];
  currentPG:any={};
  PGCollumnHeaders:any = [
    [{value:'Sr. No.',bg:'white-drop'},
    {value:'Is Active',bg:'white-drop'},
    {value:'Title',bg:'white-drop'},
    {value:'Promotion Code',bg:'white-drop'},
    {value:'Description',bg:'white-drop'},
    {value:'Cap Limit',bg:'white-drop'},
    {value:'Minimum Deposit Amount',bg:'white-drop'},
    {value:'Deposit Count',bg:'white-drop'},
    {value:'Exact Deposit Count',bg:'white-drop'},
    {value:'Deposit Amount',bg:'white-drop'},
    {value:'Deposit Percentage',bg:'white-drop'},
    {value:'Wagering',bg:'white-drop'},
    {value:'Category',bg:'white-drop'}
    ]
  ];
  PGDataCollumns=this.PGCollumnHeaders;
  PGCollumnLoading = false;
  private loaderSubscriber!: Subscription;
  currentQuery={"PromotionCode": "","SiteCode": sessionStorage.getItem('selectedSite'),"WalletTypeId":this.defWal.Id};
  constructor(private apiservice: ApiService, private utilities: CommonFunctionService,private dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.loaderSubscriber = this.apiservice.loaderService.loading$.subscribe((loading:any={}) => {
      this.PGCollumnLoading=('getDepoPromo' in loading)?true:false;
  });
    this.GetAllPG();
  }
  
  initializeData()
  {
    this.AllPGinfo = [];
    this.PGinfoData = [];
  }
  getSearchQuery(formVal:any){
    this.currentQuery.WalletTypeId=formVal.C0;
    this.currentQuery.PromotionCode=formVal.C1;
    this.GetAllPG();
  }
  GetAllPG() {
    this.initializeData();
    let param = this.utilities.setForGetNew(this.currentQuery);
    this.apiservice.getRequest(config['getDepoPromo']+param,'getDepoPromo').subscribe((data: any) => {
      this.AllPGinfo=data;
      if(this.AllPGinfo[0]){
        this.PGDataCollumns=this.PGCollumnHeaders;
        this.AllPGinfo.forEach((element:any,index:any) => {
          let ctz = element.CreatedDateTZ?" "+element.CreatedDateTZ:'';
          this.PGinfoData.push([
            {value:index+1,bg:'white-cell'},
            {value:element.IsActive,bg:'white-cell',icon:'Toggle'},
            {value:element.Title,bg:'white-cell'},
            {value:element.PromotionCode,bg:'white-cell'},
            {value:element.Description,bg:'white-cell'},
            {value:element.CapLimit,bg:'white-cell'},
            {value:element.MinimumDepositAmount,bg:'white-cell'},
            {value:element.DepositCount,bg:'white-cell'},
            {value:element.ExactDepositCount,bg:'white-cell'},
            {value:element.DepositAmount,bg:'white-cell'},
            {value:element.DepositPercentage,bg:'white-cell'},
            {value:element.Wagering,bg:'white-cell'},
            {value:element.Category,bg:'white-cell'}
          ])
        });
      }
      else{
        this.PGDataCollumns=this.utilities.TableDataNone;
      }
    }, (error) => {
      this.PGCollumnLoading = false;
      console.log(error);
    });
  }

  onValueChange(InpVal:any){
    if(InpVal.type=='Toggle'){
      this.currentPG=this.AllPGinfo[InpVal.row];
      this.PGinfoData[InpVal.row][InpVal.col].icon='Loading';
      this.ChangePGStatus(InpVal)
    }
  }

  ChangePGStatus(InpVal:any){
    let param = config['changeDepoPromoStat'] + '?Id='+this.currentPG.Id;
    this.apiservice.getRequest(param,'changeDepoPromoStat').subscribe((data: any) => {
      if(data.ErrorCode=='1'){
        this.utilities.toastMsg("success", "Success", data.ErrorMessage);
        this.PGinfoData[InpVal.row][InpVal.col].value=InpVal.value?1:0;
        this.PGinfoData[InpVal.row][InpVal.col].icon='Toggle';
      }
      else{
        this.utilities.toastMsg("error", "Error", data.ErrorMessage);
        this.PGinfoData[InpVal.row][InpVal.col].icon='Toggle';
      }
    }, (error) => {
      this.utilities.toastMsg("error", "Can not process", '');
      console.log(error);
    });
  }
  openPopup() {
    let dialogRef = this.dialog.open(this.addForm, {
      width: '1280px',
      panelClass: 'screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.closePopup();
    })
  }

  closePopup(){
    this.dialog.closeAll();
  }

  ngOnDestroy(){
    if (this.loaderSubscriber) {
      this.loaderSubscriber.unsubscribe();
    }
  }
}