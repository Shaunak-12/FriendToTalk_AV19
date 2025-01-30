
import { TitleHeaderComponent } from '@shared/title-header/title-header.component';
import { AdvanceTablePaginatorComponent } from '@shared/advance-table-paginator/advance-table-paginator.component';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { MultiInputHeaderComponent } from '@shared/multi-input-header/multi-input-header.component';
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
// import { element } from 'protractor';

import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { config } from '@services/config';
import { ApiService } from '@services/api.service';
import { CommonFunctionService } from '@services/common-function.service';
import { ActivatedRoute } from '@angular/router';


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

@Component({
  selector: 'app-add-reel',
  imports: [
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
  templateUrl: './add-reel.component.html',
  styleUrl: './add-reel.component.scss'
})
export class AddReelComponent implements OnInit , OnDestroy {
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  pageId: any
  // pageId = ((parseInt(this.route.snapshot.paramMap.get('id')||'')-parseInt(this.route.snapshot.paramMap.get('extrabit')))/3);
  pageName:any={Name:''};
  submitDisabled=false;
  reelForm!: FormGroup;
  fullURL = new FormControl('',Validators.required);
  
  PageList =[];
  
  constructor(private formBuilder: FormBuilder, private apiservice: ApiService, private utilities : CommonFunctionService,private route: ActivatedRoute) {
    this.pageId = ((parseInt(this.route.snapshot.paramMap.get('id')||'')-parseInt(this.route.snapshot.paramMap.get('extrabit')||''))/3);

   }
  
  ngOnInit(){
    this.getAllData();
    this.initializeForm();
    this.fullURL.valueChanges.subscribe((value)=>{
      this.reelForm.get('URL')?.setValue('');
      let reelCode = value!.match(/^https:\/\/www\.instagram\.com\/reel\/([^/?]+)\/?/);
      if (reelCode){
        this.reelForm.get('URL')?.setValue(reelCode[1]?reelCode[1]:'');
      }
    });
  }
  
  getAllData()
  {
    let param = config['getDCPageList']+'?SiteCode='+sessionStorage.getItem('selectedSite');
    this.apiservice.getRequest(param,'getDCPageList').subscribe((data: any) => {
      this.PageList = data;
      this.pageName = this.PageList.find(obj => obj['Id'] == this.pageId) || null;
      // console.log(this.pageName);
    }, (error) => {
      console.log(error);
    });
  }
  
  initializeForm(){
    this.reelForm = this.formBuilder.group({
      DCPageId: [this.pageId, [Validators.required]],
      URL: ["", [Validators.required]],
      Type: ["Admin", [Validators.required]]
    });
  }
  
  onBack(){
    this.onCancel.emit();
  }
  
  onSubmit(){
    if(this.reelForm.invalid){
      this.utilities.toastMsg('warning','Please enter Required Data!','');
    }
    else{
      this.submitDisabled=true;
      let FormValue = this.reelForm.getRawValue();
      if(!FormValue.id){
        delete FormValue.id;
        this.apiservice.sendRequest(config['saveDCPromotion'],FormValue).subscribe((data: any) => {
          // console.log(data);
          this.submitDisabled=false;
          if (data.ErrorCode === "1") {
            this.utilities.toastMsg('success',"Success", data.ErrorMessage);
            this.reelForm.disable();
            this.onSave.emit();
            this.onCancel.emit();
          }
          else {
            this.utilities.toastMsg('warning',"Failed",data.Result + " : " + data.ErrorMessage);
          }
        }, (error) => {
          console.log(error);
        });
      }
    }
  }
  
  ngOnDestroy(){
    
  }
}