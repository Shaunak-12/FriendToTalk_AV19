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

@Component({
  selector: 'app-multi-input-header',
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
                          // FeatherModule.pick(allIcons),
                          MatCheckboxModule,
                          MatExpansionModule,
                          MatProgressBarModule
  ],
  templateUrl: './multi-input-header.component.html',
  styleUrl: './multi-input-header.component.scss'
})
export class MultiInputHeaderComponent implements OnInit {
  @Input() subText:boolean=false;
  @Input() titleText:string ='';
  @Input() btnVal:string ='';
  @Input() classes:string ='';
  @Input() dynamicForm:any = [];
  @Input() showForm:any = false;
  @Output() onSubmitForm = new EventEmitter<any>();
  @Output() onSubmitObj = new EventEmitter<any>();
  generatedForm!:FormGroup;

  @Input() showWallets:boolean=true;
  userWals:any=[];
  SelectedSiteWal=new FormControl();
  constructor(private formBuilder:FormBuilder) { }
  ngOnInit(): void {
    this.generatedForm=this.formBuilder.group({});
    this.dynamicForm.forEach((element:any,index:number) => {
      this.generatedForm.addControl('C'+index, new FormControl(element.default?element.default.value:''));
      if(element.changeAction && element.changeAction=='submit'){
        this.generatedForm.get('C'+index)?.valueChanges.subscribe((value) => {
          this.submitFunction()
        })
      }
      if(element.changeAction && element.changeAction=='selObj'){
        this.generatedForm.get('C'+index)?.valueChanges.subscribe((value) => {
          this.generatedForm.get('C'+(index+1))?.setValue('');
          this.submitObjFunction();
        })
      }
    });
    this.userWals = JSON.parse(sessionStorage.getItem('WalList') || '{}');
    this.SelectedSiteWal.setValue(sessionStorage.getItem('WalChosen'));
    if(this.showWallets){
      this.SelectedSiteWal.valueChanges.subscribe((value) => {
        				sessionStorage.setItem('WalChosen',value);
        this.submitFunction();
      })
    }
  }
  submitFunction(){
    this.onSubmitForm.emit(this.generatedForm.getRawValue());
  }
  submitObjFunction(){
    this.onSubmitObj.emit(this.generatedForm.getRawValue());
  }
}