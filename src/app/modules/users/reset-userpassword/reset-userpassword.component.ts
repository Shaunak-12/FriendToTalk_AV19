

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
  selector: 'app-reset-userpassword',
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
  templateUrl: './reset-userpassword.component.html',
  styleUrl: './reset-userpassword.component.scss'
})
export class ResetUserpasswordComponent implements OnInit {
	@Input() submitBtn!:boolean;
	@Input() userData:any;
	@Output() onCancel = new EventEmitter<any>();
	
	submitDisabled=false;
	
	constructor(private formBuilder: FormBuilder, private apiservice: ApiService, private utilities : CommonFunctionService) { }
	
	ngOnInit(){
  }
	
	onBack(){
		this.onCancel.emit();
	}
	
	onSubmit(){
		this.submitDisabled=true;
		this.apiservice.sendRequest(config['playerResetPassword'],{"UserId":this.userData.UserId}).subscribe((data: any) => {
			this.submitDisabled=false;
			if (data.ErrorCode === "1") {
				this.utilities.toastMsg('success',"Success", data.ErrorMessage);
				setTimeout(()=>{
					this.onCancel.emit();
				}, 1000);
			}
			else {
				this.utilities.toastMsg('warning',"Failed",data.Result + " : " + data.ErrorMessage);
			}
		}, (error) => {
			console.log(error);
		});
	}
}