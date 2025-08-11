import { Component, OnInit } from '@angular/core';
import { BladeService } from '../Services/blade.service';
import { IBlade } from '../models/blade.model';
import { Observable } from 'rxjs';
import { Injector } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-blade-container',
    templateUrl: './blade-container.component.html',
    styleUrls: ['./blade-container.component.scss']
})
export class BladeContainerComponent implements OnInit {
    blades$: Observable<IBlade[]>;

    constructor(private bladeService: BladeService) {
        this.blades$ = this.bladeService.blades$;
    }

    createInjectorOnce(blade: IBlade): Injector {
        if (!(blade as any)._injector) {
            (blade as any)._injector = this.bladeService.createInjector(blade);
        }
        return (blade as any)._injector;
    }

    closeBlade(key: string) {
        this.bladeService.closeBlade(key);
    }

    ngOnInit() { }
}
