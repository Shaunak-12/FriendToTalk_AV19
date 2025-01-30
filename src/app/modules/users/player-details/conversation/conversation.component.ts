
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
import { FeatherModule } from 'angular-feather';
@Component({
  selector: 'app-conversation',
  imports: [
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
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent implements OnInit {
  @Input() uWalId: any;
  @Input() userId: any;
  @Output() onCancel = new EventEmitter<any>();
  category :any= []
  subCategory :any= []
  addForm!: FormGroup;
  adminPass:any =''
  submitDisabled:boolean = false;
  private loaderSubscriber!: Subscription;
  private apiSubscriber: Subscription[]=[];
  constructor(private formBuilder: FormBuilder,private apiSer:ApiService,private utilities:CommonFunctionService) { }

  ngOnInit(): void {
    this.getAllCategory();
    this.intialForm() ;
    this.addForm.controls['CategoryId'].valueChanges.subscribe((value) => {
      this.GetAllSubcategory(value);
    });
    this.loaderSubscriber = this.apiSer.loaderService.loading$.subscribe((loading:any={}) => {
      this.submitDisabled=('saveConversation' in loading)?true:false;
    });
  }
  intialForm() {
    this.addForm = this.formBuilder.group({
      RequestType: ["", [Validators.required]],
      CategoryId: ["", [Validators.required]],
      SubCategoryName: ["", [Validators.required]],
      RequestStatus: ["", [Validators.required]],
      ChatDescription: ["", [Validators.required]]
      // SiteCode: [sessionStorage.getItem('selectedSite')],
    });
  }
  onSubmit(){
    let param = this.addForm.getRawValue();
    param.PlayerId = this.userId;
    param.WalletTypeId = this.uWalId;
    if(!this.addForm.controls['RequestType'].value){
      this.utilities.toastMsg('warning',"",'Please Select Request Type');
      return
    }
    if(!this.addForm.controls['CategoryId'].value){
      this.utilities.toastMsg('warning',"",'Please Select Category');
      return
    }
    // if(!this.addForm.controls['SubCategoryName'].value){
    //   this.utilities.toastMsg('warning',"",'Please Select SubCategory');
    //   return
    // }
    if(!this.addForm.controls['RequestStatus'].value){
      this.utilities.toastMsg('warning',"",'Please Select Request Status');
      return
    }
    if(!this.addForm.controls['ChatDescription'].value){
      this.utilities.toastMsg('warning',"",'Please enter Chat Description');
      return
    }
    this.apiSer.sendRequest(config['saveConversation'],param,'saveConversation').subscribe({
      next:(value:any)=>{
        if(value.ErrorCode == '1'){
          this.utilities.toastMsg('success',"Success",value.ErrorMessage);
          this.addForm.reset();
          this.onCancel.emit();
        }else{
          this.utilities.toastMsg('error',"Failed",value.ErrorMessage);
        }
        console.log(value);
      }
    })
  }
  getAllCategory(){
    this.category = [];
    this.apiSer.getRequest(config['getCategoryList'],'getCategoryList').subscribe({
      next:(data)=>{
        this.category = data;
      },
      error:(error)=>{
        console.error(error);
      }
    });
  }
  GetAllSubcategory(val:any){
    this.subCategory = [];
    let param = '?CategoryId='+val
    this.apiSer.getRequest(config['getSubCategoryList']+param,'getSubCategoryList').subscribe({
      next:(data: any)=>{
        if(data){
          this.addForm.controls['SubCategoryName'].setValue(data[0].SubCategoryName);
          this.subCategory = data;
          console.log("this.subCategory:- ",this.subCategory);
        }
      },
      error:(error)=>{
        console.error(error);
      }
    });  
  }
  onBack(){

  }
}
