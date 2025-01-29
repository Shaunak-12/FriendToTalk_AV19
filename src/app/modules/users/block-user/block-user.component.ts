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
  selector: 'app-block-user',
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
  templateUrl: './block-user.component.html',
  styleUrl: './block-user.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 

})
export class BlockUserComponent implements OnInit {
	@Input() submitBtn!:boolean;
	@Input() isCredit=false;
	@Input() userData:any;
	@Output() onSave = new EventEmitter<any>();
	@Output() onCancel = new EventEmitter<any>();
	
	submitDisabled=false;
	adminForm!: FormGroup;
	
	constructor(private formBuilder: FormBuilder, private apiservice: ApiService, private utilities : CommonFunctionService) { }
	
	ngOnInit(){
		this.initializeForm();
	}
	
	initializeForm(){
		this.adminForm = this.formBuilder.group({
			Description: [""],
			UserId: [this.userData.Id]
		});
	}
	
	onBack(){
		this.onCancel.emit();
	}
	
	onSubmit(){
		if(this.userData.StatusId==1 && this.adminForm.get('Description')?.getRawValue()==''){
			this.utilities.toastMsg('warning',"Please enter Remark",'');
			return;
		}
		this.submitDisabled=true;
		this.apiservice.sendRequest(config['changeUserStatus'],this.adminForm.getRawValue()).subscribe((data: any) => {
			this.submitDisabled=false;
			if (data.ErrorCode === "1") {
				this.utilities.toastMsg('success',"Success", data.ErrorMessage);
				setTimeout(()=>{
					this.onCancel.emit();
					this.onSave.emit();
				}, 1000);
			}
			else {
				this.utilities.toastMsg('warning',"Failed",data.Result + " : " + data.ErrorMessage);
				this.onSave.emit();
			}
		}, (error) => {
			console.log(error);
		});
	}
}