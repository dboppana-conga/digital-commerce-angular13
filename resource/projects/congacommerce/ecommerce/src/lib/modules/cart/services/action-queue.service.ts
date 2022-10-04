import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, mergeMap, share, skip, switchMap, tap } from "rxjs/operators";
import { concat, compact } from 'lodash';


/**
 * @ignore
 */
@Injectable({
    providedIn: 'root'
})
export class ActionQueue {

    // The Array of Behavior Subjects mapped to an observable
    subjectQueue: Array<BehaviorSubject<any>> = [];

    // Callback function to execute once queue is clear
    callback: (data) => void;

    // Maintains the response data that will be processed by the callback function
    responseData: any;

    /**
     * @param action The observable action to add to the queue
     * @param callback A callback function. Existing callback functions will be overwritten and not be executed
     * @returns The observable once it has been executed by the queue.
     */
    public queueAction(action: Observable<any>, callback?: (data) => void): Observable<any> {
        this.callback = callback;

        // Get the last item from the queue
        const lastSubject = this.subjectQueue[this.subjectQueue.length - 1];

        // Create a new subject and push it to the queue
        const subject = new BehaviorSubject<any>(null);
        this.subjectQueue.push(subject);

        if (lastSubject)
            return lastSubject.pipe(
                skip(1),
                mergeMap(() => action, 1),
                tap(() => subject.next(() => { })),
                tap(() => this.subjectQueue.shift()),
                tap(data => this.onComplete(data)),
                catchError((e) => this.onError(e)),
            );
        else
            return action.pipe(
                tap(() => subject.next(() => { })),
                tap(() => this.subjectQueue.shift()),
                tap(data => this.onComplete(data)),
                catchError((e) => this.onError(e))
            );
    }

    private onError(e): Observable<any> {
        this.responseData = null;
        this.subjectQueue = [];
        return of(e);
    }

    private onComplete(data): void {
        this.responseData = compact(concat(this.responseData, data));
        if (this.subjectQueue.length === 0) {
            this.callback(this.responseData);
            this.responseData = undefined;
        }
    }
}