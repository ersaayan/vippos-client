import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CaseModelVariationsResponse } from '../interfaces/case-model-variations-response';

@Injectable({
  providedIn: 'root',
})
export class CaseModelVariationsService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCaseModelVariations(): Observable<CaseModelVariationsResponse[]> {
    return this.http
      .get<CaseModelVariationsResponse[]>(
        `${this.apiUrl}/case-model-variations`
      )
      .pipe(
        map((response: any[]) => {
          return response.map((item) => ({
            id: item.id,
            modelVariation: item.modelVariation,
            modelVariationEng: item.modelVariationEng,
            myorGroupCode: item.myorGroupCode,
            createdDate: new Date(item.createdDate),
            updatedDate: new Date(item.updatedDate),
          }));
        })
      );
  }
}
