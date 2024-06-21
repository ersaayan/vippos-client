import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, StyleClassModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  constructor(public router: Router) { }

  accessToken: string = localStorage.getItem('accessToken') || '';

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode.jwtDecode(token);
    } catch(Error) {
      return null;
    }
  }

  username = this.getDecodedAccessToken(this.accessToken).username;

}
