import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { MatDialogModule } from '@angular/material/dialog';
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
  selector: 'app-payment-gateway-master',
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
    FeatherModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  templateUrl: './payment-gateway-master.component.html',
  styleUrl: './payment-gateway-master.component.scss'
})
export class PaymentGatewayMasterComponent implements OnInit, OnDestroy {
  @ViewChild('UDataDialogOpen') UDataDialogOpen!: TemplateRef<any>;
  @ViewChild('ApproveDialogOpen') ApproveDialogOpen!: TemplateRef<any>;
  AllPGinfo: any = [];
  PGinfoData: any = [];

  currentPG: any = {};
  PGCollumnHeaders: any = [
    [{ value: 'Sr. No.', bg: 'white-drop' }, { value: 'Status', bg: 'white-drop' }, { value: 'PaymentUrl', bg: 'white-drop' }, { value: 'Tag', bg: 'white-drop' }, { value: 'Title', bg: 'white-drop' }, { value: 'SubTitle', bg: 'white-drop' },
    { value: 'ImageUrl', bg: 'white-drop' }, { value: 'Description', bg: 'white-drop' }, { value: 'Short Order', bg: 'white-drop' }, { value: 'Date', bg: 'white-drop' }]
  ];
  PGDataCollumns = this.PGCollumnHeaders;
  PGCollumnLoading = false;
  private loaderSubscriber!: Subscription;
  constructor(private apiservice: ApiService, private utilities: CommonFunctionService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loaderSubscriber = this.apiservice.loaderService.loading$.subscribe((loading: any = {}) => {
      this.PGCollumnLoading = ('getPGMaster' in loading) ? true : false;
    });
    this.GetAllPG();
  }

  initializeData() {
    this.AllPGinfo = [];
    this.PGinfoData = [];
  }
  getSearchQuery() {
    this.GetAllPG();
  }
  GetAllPG() {
    this.initializeData();
    let param = '?SiteCode=' + sessionStorage.getItem('selectedSite') + '&WalletTypeId=' + sessionStorage.getItem('WalChosen');
    this.apiservice.getRequest(config['getPGMaster'] + param, 'getPGMaster').subscribe((data: any) => {
      this.AllPGinfo = data;
      if (this.AllPGinfo[0]) {
        this.PGDataCollumns = this.PGCollumnHeaders;
        this.AllPGinfo.forEach((element: any, index: any) => {
          let ctz = element.CreatedDateTZ ? " " + element.CreatedDateTZ : '';
          this.PGinfoData.push([
            { value: index + 1, bg: 'white-cell' },
            { value: element.StatusId, bg: 'white-cell', icon: 'Toggle' },
            { value: element.PaymentUrl, bg: 'white-cell break-class' },
            { value: element.Tag, bg: 'white-cell' },
            { value: element.Title, bg: 'white-cell' },
            { value: element.SubTitle, bg: 'white-cell' },
            { value: element.ImageUrl, bg: 'white-cell break-class' },
            { value: element.Description, bg: 'white-cell' },
            { value: element.ShortOrder, bg: 'white-cell' },
            { value: element.CreatedDate ? moment(element.CreatedDate).format("h:mm:ss A, DD-MMM-yyyy") + ctz : '', bg: 'white-cell' },
          ])
        });
      }
      else {
        this.PGDataCollumns = this.utilities.TableDataNone;
      }
    }, (error) => {
      this.PGCollumnLoading = false;
      console.log(error);
    });
  }

  onValueChange(InpVal: any) {
    if (InpVal.col == 1 && InpVal.type == 'Toggle') {
      this.currentPG = this.AllPGinfo[InpVal.row];
      this.PGinfoData[InpVal.row][InpVal.col].icon = 'Loading';
      this.ChangePGStatus(InpVal)
    }
  }

  ChangePGStatus(InpVal: any) {
    let param = config['changePaymentGatewayStatus'] + '?Id=' + this.currentPG.Id;
    this.apiservice.getRequest(param, 'changePaymentGatewayStatus').subscribe((data: any) => {
      if (data.ErrorCode == '1') {
        this.utilities.toastMsg("success", "Success", data.ErrorMessage);
        this.PGinfoData[InpVal.row][InpVal.col].value = InpVal.value ? 1 : 0;
        this.PGinfoData[InpVal.row][InpVal.col].icon = 'Toggle';
      }
      else {
        this.utilities.toastMsg("error", "Error", data.ErrorMessage);
        this.PGinfoData[InpVal.row][InpVal.col].icon = 'Toggle';
      }
    }, (error) => {
      this.utilities.toastMsg("error", "Can not process", '');
      console.log(error);
    });
  }

  ngOnDestroy() {
    if (this.loaderSubscriber) {
      this.loaderSubscriber.unsubscribe();
    }
  }
}