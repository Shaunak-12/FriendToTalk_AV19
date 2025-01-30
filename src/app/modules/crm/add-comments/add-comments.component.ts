import { ApiService } from '@services/api.service';
import { CommonFunctionService } from '@services/common-function.service';
import { config } from '@services/config';
import { Subscription } from 'rxjs';

import { Component,Input, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TitleHeaderComponent } from '@shared/title-header/title-header.component';
import { AdvanceTablePaginatorComponent } from '@shared/advance-table-paginator/advance-table-paginator.component';

import moment from 'moment';
import { MultiInputHeaderComponent } from '@shared/multi-input-header/multi-input-header.component';
import { AdvanceTableComponent } from '@shared/advance-table/advance-table.component';
// import { element } from 'protractor';

import { FormControl, FormsModule,Validators, FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
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
  selector: 'app-add-comments',
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
  templateUrl: './add-comments.component.html',
  styleUrl: './add-comments.component.scss'
})
export class AddCommentsComponent implements OnInit {
  @Input() issueDetails:any;
  addComment!:FormGroup;
  
  selectedFiles: File[] = [];
  userColorMapping: { [userId: number]: string }[] = [];
  userdetails =JSON.parse(localStorage.getItem('personalDetails')||'{}');
  comments:any = [];
  saveLoader:boolean = false;
  loading:boolean = false;
  private loaderSubscriber!: Subscription;
  private apiSubscriber: Subscription[] = [];
    constructor(private apiSer:ApiService,private utilities:CommonFunctionService,private fb:FormBuilder) { }
  
    ngOnInit(): void {
      this.loaderSubscriber = this.apiSer.loaderService.loading$.subscribe((loading: any = {}) => {
        this.saveLoader = ('addComment' in loading) ? true : false;
        this.loading = ('getComment' in loading) ? true : false;
       
      });
      this.addComment = this.fb.group({
        Description:["",],
        Files:["",]
      });
      this.getAllComment();
    }
    
    onFileSelected(event: any) {
      this.selectedFiles = event.target.files;
    }
  
    onSubmit(){
      let param = this.addComment.getRawValue();
      let formData = new FormData();
      formData.append('Description', param.Description);
      formData.append('CRM_Issue_Tracker_Id', this.issueDetails.id);
      formData.append('CRM_Issue_Tracker_Status_Code', this.issueDetails.statusCode);
      for (let file of this.selectedFiles) {
        formData.append('Files', file, file.name);
      }
      if(this.selectedFiles.length <1 && !this.addComment.controls['Description'].value){
        return;
      }
      this.apiSer.crmsendRequest(config['addComment'], formData, 'addComment').subscribe({
        next: (data: any) => {
          if (data.errorCode == '1') {
            this.utilities.toastMsg('success', "Success", data.errorMessage);
            this.addComment.reset();
            this.getAllComment();
          }else{
            this.utilities.toastMsg('warning', "warning", data.errorMessage);
  
          }
        },
        error: err => {
          console.error(err);
        }
      }); 
    }
  
    getAllComment(){
      let param: { CRM_Issue_Tracker_Id: any; issueId: any } = { CRM_Issue_Tracker_Id: this.issueDetails.id, issueId: this.issueDetails.issueId };
      this.apiSer.crmsendRequest(config['getComment'], param, 'getComment').subscribe({
        next: (data: any) => {
         this.comments = data;
         this.assignColorsToUsers();
        },
        error: err => {
          console.error(err);
        }
      }); 
    }
  
    generateColor(identifier: string): string {
      const hash = this.hashCode(String(identifier)); 
      const h = Math.abs(hash) % 360; 
      return `hsl(${h}, 70%, 50%)`; 
    }
  
    hashCode(str: string): number {
      let hash = 0;
      if (str.length == 0) return hash;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
      }
      return hash;
    }
  
    assignColorsToUsers() {
      this.userColorMapping = []; 
      for (const comment of this.comments) {
        const userId = comment.createdBy;
        if (!this.userColorMapping[userId]) {
          const color = this.generateColor(userId);
          this.userColorMapping[userId] = color;
        }
      }
    }
  
    isImage(fileName: string): boolean {
      const extension = fileName.split('.').pop()?.toLowerCase();
      return extension === 'png' || extension === 'jpeg' || extension === 'jpg';
    }
  
  downloadImage(imgName: string): void {
    const imageUrl = 'https://crmuploadfile.fairbet91.com/' + imgName;
    console.log(imageUrl);
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = imgName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
  }
  }
  