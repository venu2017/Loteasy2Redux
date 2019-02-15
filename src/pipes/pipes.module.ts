import { NgModule } from '@angular/core';
import { OnlyNumber} from '../pipes/OnlyNumber';
import { ArraySortPipe } from '../pipes/OrderBy';
import { LimitToPipe} from '../pipes/limitTo';
import { GlobalSearch } from '../pipes/search';
import { SearchFilter } from '../pipes/searchFilter';
import { TruncatePipe } from '../pipes/stringLimit';
import { ObjNgFor } from '../pipes/objfor';

@NgModule({
    declarations: [
       LimitToPipe,
       OnlyNumber,
       ArraySortPipe,
       GlobalSearch,
       SearchFilter,
       TruncatePipe,
       ObjNgFor
    ],
    imports: [

    ],
    exports: [
        LimitToPipe,
        OnlyNumber,
        ArraySortPipe,
        GlobalSearch,
        SearchFilter,
        TruncatePipe,
        ObjNgFor
    ]
})
export class PipesModule { }