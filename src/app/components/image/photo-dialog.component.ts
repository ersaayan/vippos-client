import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogComponent,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StockCartService } from '../../services/stock-cart.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  providers: [DialogService, MessageService, StockCartService],
  standalone: true,
  imports: [TableModule, ButtonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <form [formGroup]="caseImageForm" (ngSubmit)="onSubmit()">
        <div class="field">
          <label class="text">New Case Image</label>
          <input
            type="file"
            pInputText
            formControlName="newCaseImage"
            (change)="onFileSelected($event)"
            class="w-full"
            name="newCaseImage"
            accept="image/*"
          />
        </div>
        <p-button
          label="Generate"
          [raised]="true"
          styleClass="w-full"
          type="submit"
        ></p-button>
      </form>
    </div>
  `,
})
export class PhotoSubmitForm implements OnInit {
  caseImage!: string;

  caseImageForm!: FormGroup;

  fileName = 'Select File';
  fileInfos?: Observable<any>;
  currentFile?: File;
  constructor(
    private fb: FormBuilder,
    private stockService: StockCartService,
    private dialogService: DialogService,
    private ref: DynamicDialogRef,
    private messageService: MessageService,
    public config: DynamicDialogConfig
  ) {
    this.caseImage = this.config.data.caseImage;
  }

  ngOnInit() {
    this.caseImageForm = this.fb.group({
      newCaseImage: [''],
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
      this.caseImageForm.get('newCaseImage')!.setValue(file);
    }
  }

  get newCaseImage() {
    return this.caseImageForm.get('newCaseImage');
  }

  onSubmit() {
    const form = new FormData();
    const newCaseImage = this.caseImageForm.get('newCaseImage')!.value;
    form.append('caseImage', newCaseImage);
    form.append('oldPhotoPath', this.caseImage);
    this.stockService.updateStockCartPhotos(form).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image successfully changed',
        });
        this.closeDialog({ buttonType: 'success', summary: 'Success' });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error updating case image',
        });
        this.closeDialog({ buttonType: 'error', summary: 'Error' });
      }
    );
  }

  closeDialog(data: { buttonType: string; summary: string }) {
    this.ref.close(data);
  }
}
