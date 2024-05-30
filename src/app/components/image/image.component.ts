import { Component, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { StockCartService } from '../../services/stock-cart.service';
import { ImageModule } from 'primeng/image';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CarouselModule, ButtonModule, ImageModule, DynamicDialogModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.css',
})
export class ImageComponent implements OnInit {
  cases!: any;

  responsiveOptions: any[] | undefined;

  constructor(private stockService: StockCartService) {}

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
}
