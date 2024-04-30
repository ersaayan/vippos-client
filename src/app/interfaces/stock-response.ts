export interface StockResponse {
  id: string,
  CaseBrand: string,
  CaseModelVariations:string[],
  CaseModelTitle: string,
  ProductIds: string[],
  Description: string,
  Barcode: string,
  createdAt: Date,
  updatedAt: Date
}
