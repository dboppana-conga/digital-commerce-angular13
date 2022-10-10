import { Injectable } from "@angular/core";
import { ApiService, AObject } from "@congacommerce/core";
import { Observable } from "rxjs";
// import * as download from 'downloadjs';

/**
 * <strong>This service is a work in progress.</strong>
 * 
 * File services allows to fetch and download attachment for the order/quote.
 * <h3>Usage</h3>
 *
 ```typescript
import { FileService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private fileService: FileService)
}
// or
export class MyService extends AObjectService {
     private fileService: FileService = this.injector.get(FileService);
 }
```
 */
@Injectable({
    providedIn: 'root'
})
export class FileService{
    constructor(private apiService: ApiService){}

    /**
     * This method fetches all the files based on entity id
     * ### Example:
```typescript
import { FileService, File } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    fileList: Array<File>;
    fileList$: Observable<Array<File>>;

    constructor(private fileService: FileService){}

    getFiles(Id: string){
        this.fileService.getFiles(Id).subscribe(a => this.fileList = a);
        // or
        this.fileList$ = this.fileService.getFiles(Id);
    }
}
```
    
    /**
     * @param entityId Ids is an instance of string.
     * @returns Observable<Array<File>> returns an observable list of files based on given id.
    */
    getFiles(entityId: string): Observable<Array<File>>{        
        return this.apiService.get(`/files/${entityId}`, File);
    }
    
    /** 
     * This method used to download attachments.
     * @param file is an instance of <File>.
     * 
    **/
    downloadFile(file: File): void{
        // TO DO:
        // this.apiService.get(`/files/${file.Id}/download`)
        //     .subscribe(data => download('data:text/plain,base64,' + data, file.Title, 'text/plain'));
    }
}

/* An interface for the attachments associated with order/quote */
export class File extends AObject{
    /* Size of attachment */
    ContentSize: number= 0;
    /* Title of attachment */
    Title: string ='';
    /* Type of attachment */
    FileType: string ='';
    /* Attachment extension e.g. jpeg,pdf etc */
    FileExtension: string ='';
}