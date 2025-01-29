

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
  selector: 'app-editplayer-details',
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
  templateUrl: './editplayer-details.component.html',
  styleUrl: './editplayer-details.component.scss'
})
export class EditplayerDetailsComponent implements OnInit {
  @Input() userData:any;
  @Input() submitBtn!:boolean;
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  
  submitDisabled=false;
  todayDate = new Date();
  
  resetBtn = true;
  playerForm!: FormGroup;
  adminPass = '';

constructor(private formBuilder: FormBuilder, private apiservice: ApiService, private utilities : CommonFunctionService) { }

  ngOnInit(){
    console.log(this.userData);
    this.initializeForm();
  }
  
  initializeForm(){
    this.playerForm = this.formBuilder.group({
      UserId:[this.userData.UserId],
      UserName:[this.userData.UserName, [Validators.required]],
      FName:[this.userData.FName, [Validators.required]],
      LName:[this.userData.LName, [Validators.required]],
      DOB:[this.userData.DOB, [Validators.required]]
      });
  }
  
  onBack(){
    this.onCancel.emit();
  }
  
  onSubmit(){
    if(this.playerForm.invalid){
      this.utilities.toastMsg('warning','Please enter Required Data!','');
    }
    else{
      this.submitDisabled=true;
      let FormValue = this.playerForm.getRawValue();
      FormValue.DOB = moment(FormValue.DOB).format("yyyy-MM-DD");
        this.apiservice.sendRequest(config['editPlayerDetails'],FormValue).subscribe((data: any) => {
          this.submitDisabled=false;
          if (data.ErrorCode === "1") {
            this.utilities.toastMsg('success',"Success", data.ErrorMessage);
            this.adminPass=data.ErrorMessage;
            this.playerForm.disable();
            this.onCancel.emit();
          }
          else {
            this.utilities.toastMsg('warning',"Failed",data.Result + " : " + data.ErrorMessage);
          }
          this.onSave.emit();
        }, (error) => {
          console.log(error);
          this.utilities.toastMsg('warning',"Failed","Please try later");
          this.onCancel.emit();
        });
      
    }
  }
}