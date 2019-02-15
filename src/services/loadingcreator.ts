import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class LoadingCreator{
    private loadingSymbol:any = '<img src="assets/images/loteasy-logo-transperent.JPG" />';

    constructor(private sanitizer:DomSanitizer){}
    
    getLoadingSymbol(){
        return this.sanitizer.bypassSecurityTrustHtml(this.loadingSymbol);
    }

}
