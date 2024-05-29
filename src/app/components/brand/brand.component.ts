import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { CaseBrandService } from '../../services/case-brand.service';
import { CaseModelVariationsService } from '../../services/case-model-variations.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CaseBrand } from '../../interfaces/case-brand-response';
import { CaseModelVariationsResponse } from '../../interfaces/case-model-variations-response';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-brand-model',
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
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css',
  providers: [CaseBrandService, CaseModelVariationsService, MessageService],
})
export class BrandModelComponent implements OnInit {
  caseBrandForm!: FormGroup;

  caseBrands: CaseBrand[] = [];

  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private caseBrandService: CaseBrandService,
    private caseModelVariationsService: CaseModelVariationsService
  ) {}

  ngOnInit(): void {
    this.caseBrandForm = this.fb.group({
      brandName: ['', Validators.required],
      myorGroupCode: ['', Validators.required],
    });
    this.caseBrandService.getCaseBrands().subscribe(
      (caseBrands) => {
        this.caseBrands = caseBrands;
      },
      (error) => {
        console.error('Error fetching case brands: ', error);
      }
    );
  }

  get brandName() {
    return this.caseBrandForm.get('brandName');
  }

  get myorGroupCode() {
    return this.caseBrandForm.get('myorGroupCode');
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
}
