import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [ButtonModule, TabViewModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {
  activeIndex: number = 0;
}
