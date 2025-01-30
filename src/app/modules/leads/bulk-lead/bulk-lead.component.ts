import { Component, ElementRef, OnInit, TemplateRef, ViewChild ,OnDestroy} from '@angular/core';
import { ApiService } from '@services/api.service';
import { CommonFunctionService } from '@services/common-function.service';
import { HttpClient } from '@angular/common/http';
import { config } from '@services/config';
import moment from 'moment';
import { Subscription } from 'rxjs';
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
import { TitleHeaderComponent } from '@shared/title-header/title-header.component';

@Component({
  selector: 'app-bulk-lead',
  imports: [TitleHeaderComponent,
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
  templateUrl: './bulk-lead.component.html',
  styleUrl: './bulk-lead.component.scss'
})
export class BulkLeadComponent implements OnInit {
  uploadLoader = false;
  private fileUrl = '../assets/bulklead/leadsample.xlsx';
  constructor(private apiservice: ApiService, private commonFunctionService: CommonFunctionService,private http: HttpClient) { }

  ngOnInit(): void {
  }

  clearFileInput(){
    (document.getElementById("ExcelUpload") as HTMLInputElement).value = "";
  }

  UploadFile() {
    var formData = new FormData();
    const input = document.getElementById("ExcelUpload") as HTMLInputElement;
    if (!input.files?.length) {
      this.commonFunctionService.toastMsg("warning", "Failed", "Plaese select file");
      return;
    }
    const file = input.files[0];
    var ext = file.name.split('.').pop();
    if (ext != "xlsx" && ext != "xls") {
      this.commonFunctionService.toastMsg("error", "Failed", "Please Upload Only Excel File");
      return;
    }
    formData.append("ExcelUpload", file);
    this.uploadLoader = true;
    this.apiservice.sendRequest(config['bulkLeadUpload'], formData).subscribe((response: any) => {
      this.clearFileInput();    
      this.uploadLoader = false;
      if (response != null) {
        if (response.ErrorCode === "1") {
          this.commonFunctionService.toastMsg("success", "Success", response.ErrorMessage);
        } else {
          this.commonFunctionService.toastMsg("error", "Failed", response.ErrorMessage);
        }
      }
    }, (error) => {
      this.clearFileInput();
      this.uploadLoader = false;
    });
  }
  downloadFile() {
    this.http.get(this.fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const filename = `SampleData_${timestamp}.xlsx`;

      // Create a link to download the file
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = filename;

      // Append the link to the body and click it programmatically
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  }
}
