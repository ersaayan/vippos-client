import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CaseModelVariationsService } from '../../services/case-model-variations.service';
import { CaseModelVariationsResponse } from '../../interfaces/case-model-variations-response';

@Component({
  selector: 'app-model-variation',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    ButtonModule,
    CommonModule,
    InputTextModule,
    RippleModule,
    MultiSelectModule,
    DropdownModule,
    SliderModule,
    RatingModule,
    ProgressBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './model-variation.component.html',
  styleUrl: './model-variation.component.css',
  providers: [CaseModelVariationsService, MessageService],
})
export class ModelVariationComponent implements OnInit {
  caseModelForm!: FormGroup;

  caseModelVariations: CaseModelVariationsResponse[] = [];

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private caseModelVariationsService: CaseModelVariationsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.caseModelForm = this.fb.group({
      modelVariation: ['', Validators.required],
      modelVariationEng: ['', Validators.required],
      myorGroupCode: ['', Validators.required],
    });

    this.caseModelVariationsService.getCaseModelVariations().subscribe(
      (caseModelVariations) => {
        this.caseModelVariations = caseModelVariations;
      },
      (error) => {
        console.error('Error fetching case model variations: ', error);
      }
    );
  }

  get modelVariation() {
    return this.caseModelForm.get('modelVariation');
  }

  get modelVariationEng() {
    return this.caseModelForm.get('modelVariationEng');
  }

  get myorGroupCode() {
    return this.caseModelForm.get('myorGroupCode');
  }

  onSubmit() {
    const modelVariation = this.caseModelForm.get('modelVariation')!.value;
    const modelVariationEng =
      this.caseModelForm.get('modelVariationEng')!.value;
    const myorGroupCode = this.caseModelForm.get('myorGroupCode')!.value;
    const data = {
      modelVariation: modelVariation,
      modelVariationEng: modelVariationEng,
      myorGroupCode: myorGroupCode,
    };
    this.caseModelVariationsService.generateVariation(data).subscribe(
      (response) => {
        this.caseModelVariationsService.getCaseModelVariations().subscribe(
          (caseModelVariations) => {
            this.caseModelVariations = caseModelVariations;
          },
          (error) => {
            console.error('Error fetching case model variations: ', error);
          }
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Case model variation generated successfully',
        });
      },
      (error) => {
        console.error('Error generating case model variation: ', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error generating case model variation',
        });
      }
    );
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
}
