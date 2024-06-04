import { Component, OnDestroy, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { StockCartService } from '../../services/stock-cart.service';
import { ImageModule } from 'primeng/image';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Footer } from './footer';
import { PhotoSubmitForm } from './photo-dialog.component';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [
    CarouselModule,
    ButtonModule,
    ImageModule,
    DynamicDialogModule,
    ToastModule,
    FormsModule,
  ],
  templateUrl: './image.component.html',
  styleUrl: './image.component.css',
  providers: [DialogService],
})
export class ImageComponent implements OnInit, OnDestroy {
  ref: DynamicDialogRef | undefined;

  cases!: any;

  responsiveOptions: any[] | undefined;

  constructor(
    private stockService: StockCartService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.stockService.getAllPhotos().subscribe((data) => {
      this.cases = data;
    });

    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '1220px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '1080px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '800px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  show(caseImage: string) {
    this.ref = this.dialogService.open(PhotoSubmitForm, {
      header: 'Upload New Case Image',
      width: '50vw',
      data: {
        caseImage: caseImage,
      },
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      templates: {
        footer: Footer,
      },
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        const buttonType = data?.buttonType;
        if (buttonType === 'success') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Image successfully changed',
            life: 3000,
          });
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'No Image Selected',
            detail: `Pressed '${buttonType}' button`,
            life: 3000,
          });
        }
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'No Image Selected',
          detail: 'Pressed Close button',
          life: 3000,
        });
      }
      this.stockService.getAllPhotos().subscribe((data) => {
        this.cases = data;
      });
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
