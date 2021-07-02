import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SIZE_1_MB } from '@azure/storage-blob/typings/src/utils/constants';
import { Observable } from 'rxjs';
import { Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlobStorageRequest, IBlobStorageRequest } from '../azure-storage';

@Injectable({
  providedIn: 'root'
})
export class SasGeneratorService {
  constructor(private http: HttpClient) {}

  //private retorno:  BlobStorageRequest;
  

  getSasToken(): Observable<IBlobStorageRequest> {
    //return this.http.get<BlobStorageRequest>(
    //  `${environment.sasGeneratorUrl}/api/GenerateSasToken`
    //);
   
    
    //this.retorno = JSON.parse('{"storageUri":"https://stottleblobstorage.blob.core.windows.net/","storageAccessToken":"sv=2019-02-02&ss=b&srt=sco&spr=https&st=2021-04-30T02%3A02%3A35Z&se=2021-04-30T02%3A07%3A35Z&sp=rwdlacup&sig=%2FDy9gdqhCT4UAGysZjA0%2Ben1gCPnpAQaGd%2FcJGPBBn8%3D"}');
    //let s1 = '{"storageUri":"https://stottleblobstorage.blob.core.windows.net/","storageAccessToken":"sv=2019-02-02&ss=b&srt=sco&spr=https&st=2021-05-01T20%3A17%3A14Z&se=2021-05-01T20%3A22%3A14Z&sp=rwdlacup&sig=td%2FEZLgfS1WT308kMj1wCtz%2B71uS1wEgtJO1bhXFGws%3D"}';
    let s1 = '{"storageUri":"https://stoaccimages.blob.core.windows.net/","storageAccessToken":"?sv=2020-02-10&ss=b&srt=sco&sp=rwdlacx&se=2021-05-03T10:01:54Z&st=2021-05-03T02:01:54Z&spr=https&sig=hTq5RtPmgO6i6dB5kUJFJOQ5tlXFW21QMN6f5%2Fhi7R8%3D"}';
    
    //return Observable.of( BlobStorageRequest).map(s1 => JSON.stringify(s1));
    
    //return from (new BlobStorageRequest()).map(s1 => JSON.stringify(s1));
   
    //return new Observable<BlobStorageRequest>((subscriber: Subscriber<BlobStorageRequest>) => subscriber.next(new BlobStorageRequest())).map(s1 => JSON.stringify(s1));
    return new Observable<IBlobStorageRequest>((subscriber: Subscriber<IBlobStorageRequest>) => subscriber.next(new BlobStorageRequest())).pipe(map((s2:any) => JSON.parse(s1)));

  }
}
