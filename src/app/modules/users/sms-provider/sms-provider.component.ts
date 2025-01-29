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
import { UpdateSmsComponent } from './update-sms/update-sms.component';
import { AddSmsComponent } from './add-sms/add-sms.component';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-sms-provider',
  imports: [ MultiInputHeaderComponent,AdvanceTableComponent,UpdateSmsComponent,AddSmsComponent,
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
                                  FeatherModule,
                                  MatCheckboxModule,
                                  MatExpansionModule,
                                  MatProgressBarModule
  ],
  templateUrl: './sms-provider.component.html',
  styleUrl: './sms-provider.component.scss'
})
export class SmsProviderComponent implements OnInit {
  @ViewChild('SmsproviderAdd') SmsproviderAdd!: TemplateRef<any>;
  @ViewChild('SmsproviderUpdate') SmsproviderUpdate!: TemplateRef<any>;
  smsInfoData:any=[];
  AllData:any=[];
  udataToView:any =[];
  TableCollumnHeaders:any = [
    [{value:'Sr. No.',bg:'white-drop'},{value:'URL',bg:'white-drop'},{value:'SMS Limit',bg:'white-drop'},{value:'Sent SMS Count',bg:'white-drop'},{value:'Description',bg:'white-drop'},{value:'Reset Date',bg:'white-drop'},{value:'Created By',bg:'white-drop'},{value:'Created Date',bg:'white-drop'},{value:'Updated By',bg:'white-drop'},{value:'Updated Date',bg:'white-drop'},{value:'Action',bg:'white-drop'}]
  ];
  TableDataCollumns=this.TableCollumnHeaders;
  CollumnLoading = false;
  private loaderSubscriber!: Subscription;
  constructor(private apiservice: ApiService, private utilities: CommonFunctionService,private dialog: MatDialog) { }
  

  ngOnInit(): void {
    this.loaderSubscriber = this.apiservice.loaderService.loading$.subscribe((loading:any={}) => {
      this.CollumnLoading=('smsProvider' in loading)?true:false;
  });
    this.GetAllData();
  }

  initializeData()
  {
    this.smsInfoData = [];
    this.AllData = [];
  }
  
  GetAllData() {
    this.initializeData();
    let param='?SiteCode='+sessionStorage.getItem('selectedSite');
    this.apiservice.getRequest(config['smsProvider']+param,'smsProvider').subscribe((data: any) => {
      this.smsInfoData=data;
      console.log(this.smsInfoData);
      if(this.smsInfoData[0]){
        this.TableDataCollumns=this.TableCollumnHeaders;
        this.smsInfoData.forEach((element:any,index:any) => {
          let ctz = element.CreatedDateTZ?" "+element.CreatedDateTZ:'';
          let utz = element.UpdatedDateTZ?" "+element.UpdatedDateTZ:'';
          this.AllData.push([
            {value:index+1,bg:'white-cell'},
            {value:element.ProviderUrl,bg:'white-cell'},
            {value:element.SMSLimit,bg:'white-cell '},
            {value:element.SentSMSCount,bg:'white-cell'},
            {value:element.Description,bg:'white-cell break-class'},
            {value:element.ResetDate?moment(element.ResetDate).format("h:mm:ss A, DD-MMM-yyyy"):'',bg:'white-cell'},
            {value:element.CreatedBy,bg:'white-cell'},
            {value:element.CreatedDate?moment(element.CreatedDate).format("h:mm:ss A, DD-MMM-yyyy")+ctz:'',bg:'white-cell'},
            {value:element.UpdatedBy,bg:'white-cell'},
            {value:element.UpdatedDate?moment(element.UpdatedDate).format("h:mm:ss A, DD-MMM-yyyy")+utz:'',bg:'white-cell'},
            {value:'Edit',bg:'white-cell',icon:'None'},
          ])
        });
      }
      else{
        this.TableDataCollumns=this.utilities.TableDataNone;
      }
    }, (error) => {
      this.CollumnLoading = false;
      console.log(error);
    });
  }
  onValueChange(formVal:any){
    if(formVal.col == 10){
      this.udataToView=this.smsInfoData[formVal.row];
      // this.udataToView['DOB'] = moment(this.udataToView['DOB']).format("yyyy-MM-DD");
      this.EditPlayerOpenPopup();
    }
  }
  EditPlayerOpenPopup(){

    let dialogRef = this.dialog.open(this.SmsproviderUpdate, {
      width: '800px',
      panelClass: 'screen-dialog',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.closePopup();
    })
  }
  TrxOpenPopup() {
    let dialogRef = this.dialog.open(this.SmsproviderAdd, {
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
}