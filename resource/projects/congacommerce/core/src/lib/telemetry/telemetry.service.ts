import { Injectable } from "@angular/core";

declare const panoptos: any;
@Injectable({
    'providedIn':'root'
})

export class TelemetryService {
    rootSpan = null;

    startRootSpan(spanName) {
        this.rootSpan = panoptos.startSpan(spanName, { root: true, active: true });
        return this.rootSpan;
    };

    endRootSpan() {
        this.rootSpan.end();
    };

    getRootSpan() {
        return this.rootSpan;
    };
}