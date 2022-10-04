import { Observable } from 'rxjs';
import { LocalCurrencyPipe } from '../pipes/convert.pipe';

export class Price {

    get netPrice$(): Observable<string>{
        return this.localCurrencyPipe.transform(this.netPrice);
    }
    get basePrice$(): Observable<string> {
        return this.localCurrencyPipe.transform(this.basePrice);
    }
    get discountPrice$(): Observable<string> {
        return this.localCurrencyPipe.transform(this.discountPrice);
    }
    get listPrice$(): Observable<string>{
        return this.localCurrencyPipe.transform(this.listPrice);
    }
    get listExtendedPrice$(): Observable<string>{
        return this.localCurrencyPipe.transform(this.listExtendedPrice);
    }
    get baseExtendedPrice$(): Observable<string> {
        return this.localCurrencyPipe.transform(this.baseExtendedPrice);
    }
    get discountPrice(): number{
        return this.listPrice - this.basePrice;
    }

    constructor(
        public localCurrencyPipe: LocalCurrencyPipe
        , public netPrice: number = 0
        , public basePrice: number = 0
        , public listPrice: number = 0
        , public listExtendedPrice: number = 0
        , public baseExtendedPrice: number = 0) {  }

    public addPrice(p: Price): Price{
        if(p){
            this.netPrice += p.netPrice;
            this.basePrice += p.basePrice;
            this.listPrice += p.listPrice;
            this.listExtendedPrice += p.listExtendedPrice;
            this.baseExtendedPrice += p.baseExtendedPrice;
        }
        return this;
    }
}