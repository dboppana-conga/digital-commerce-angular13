import { Injectable } from '@angular/core';
import {AObjectService } from '@congacommerce/core';
import { Note } from '../classes/note.model';
import { Observable, of } from 'rxjs';

/**
 * <strong>This service is a work in progress.</strong>
 * 
 * Notes allows to add/fetch comments.
 * <h3>Usage</h3>
 *
 ```typescript
import { NoteService, AObjectService} from '@congacommerce/ecommerce';

export class MyComponent implements OnInit{  
constructor( private noteService: NoteService)
}
// or
export class MyService extends AObjectService {
     private noteService: NoteService = this.injector.get(NoteService);
 }
```
 */
@Injectable({
  providedIn: 'root'
})
export class NoteService extends AObjectService {
  type = Note;

  /** 
   * This method fetches list of  notes using ParentId.
   * ### Example:
```typescript
import { NoteService, Note } from '@congacommerce/ecommerce';
import { Observable } from 'rxjs/Observable';

export class MyComponent implements OnInit{
    NoteList: Array<Note>;
    NoteList$: Observable<Array<Note>>;

    constructor(private noteService: NoteService){}

    getNoteList(Id: string){
        this.noteService.getNotes(Id).subscribe(a => this.NoteList = a);
        // or
        this.NoteList$ = this.noteService.getNotes(Id);
    }
}
```
   * @param parentId as string
   * @returns Observable of list of note object.
   *
    */
  getNotes(parentId: string): Observable<Array<Note>> {
    return of(null) as unknown as Observable<Array<Note>>; // this.apiService.get(`/note?condition[0]=ParentId,Equal,${parentId}&lookups=CreatedById&sort[field]=CreatedDate&sort[direction]=DESC`, this.type);
  }
}
