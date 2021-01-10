import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private _http: HttpClient) { }

  public getNetworkStatus(): Observable<any>{
    const base = this._http.get('api/network-status')
    const request = base.pipe(
      map(data=>data)
    );

    return request
  }
  
  public getBunkeringStatus(): Observable<any>{
    const base = this._http.get('api/bunkering-status')
    const request = base.pipe(
      map(data=>data)
    );
    return request
  }
}
