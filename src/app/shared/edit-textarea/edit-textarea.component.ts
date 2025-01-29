import { Component, OnInit,Input, Output, EventEmitter  } from '@angular/core';


import {FormControl,FormsModule,FormBuilder, FormGroup, FormArray, AbstractControl} from '@angular/forms';


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
import { AdvanceInputsNewComponent } from '../advance-inputs-new/advance-inputs-new.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-textarea',
  imports: [MatProgressSpinnerModule,CommonModule,
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
  templateUrl: './edit-textarea.component.html',
  styleUrl: './edit-textarea.component.scss'
})
export class EditTextareaComponent implements OnInit {

  @Input() inpVal:any;
  @Input() outSave:any;
  @Input() saveLoader:any;
  @Output() onOptionSave = new EventEmitter<any>();
  @Output() outSaveFn = new EventEmitter<any>();

  userVal = new FormControl();
  opVisible = false;
  valSelect = '';

  constructor() { }

  ngOnInit(): void {
    this.valSelect = this.inpVal;
    // console.log(this.valSelect);
    this.setControl();
    if(this.outSave){
      this.userVal.valueChanges.subscribe((val) => {
        this.outSaveFn.emit(val);
      })
    }
  }

  setControl(){
      this.userVal.setValue(this.valSelect);
  }

  switchSelect(): void {
    this.opVisible = !this.opVisible;
    if(!this.opVisible){
      this.setControl();
    }
  }

  saveSelect(){
    let formVal = this.userVal.getRawValue();
    if((typeof this.userVal=='string')&&!(typeof formVal=='string'))
    {
      formVal = formVal+'';
    }
    else if ((typeof this.userVal=='number')&&!(typeof formVal=='number'))
    {
      formVal = Number(formVal);
    }
    this.onOptionSave.emit(formVal);
  }

}
