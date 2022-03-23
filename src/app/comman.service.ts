import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, catchError, count } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CommanService {
  isSpinning: boolean = false;
  titleDetails: any;
  constructor(
    private http: HttpClient
  ) { }
  getData(url: string, options?: any) {
    this.isSpinning = true
    return this.http.get<any>
      (url, options ? options : "").pipe(
        map(data => {
          this.isSpinning = false;
          return data;
        }),
        catchError(err => {
          this.isSpinning = false;
          return err
        })
      )
  }
  postData(url: string, body: any, options?: any) {
    return this.http.post<any>(
      url, body
    ).pipe(
      map(data => {
        return data
      }),
      catchError(err =>{
        return err;
      })
    )
  }
  putData(url: string, body: any, options?: any) {
    return this.http.put<any>(
      url, body
    ).pipe(
      map(data => {
        return data
      }),
      catchError(err =>{
        return err;
      })
    )
  }
  deleteData(url: string, body?: any, options?: any) {
    return this.http.delete<any>(
      url
    ).pipe(
      map(data => {
        return data
      }),
      catchError(err =>{
        return err;
      })
    )
  }
}
