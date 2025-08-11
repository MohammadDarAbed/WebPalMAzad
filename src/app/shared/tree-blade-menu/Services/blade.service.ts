import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBlade } from '../models/blade.model';

@Injectable({ providedIn: 'root' })
export class BladeService {
    constructor(private injector: Injector) { }

    createInjector(blade: IBlade): Injector {
        return Injector.create({
            providers: [
                { provide: 'BLADE_DATA', useValue: blade.data }
            ],
            parent: this.injector
        });
    }

    private blades: IBlade[] = [];
    blades$ = new BehaviorSubject<IBlade[]>([]);

    allowMultipleBlades = false;

    openBlade(blade: IBlade) {
        if (!this.allowMultipleBlades) {
            this.blades = [blade]; // Only one blade at a time
        } else {
            this.blades.push(blade); // Stack blades side by side
        }
        this.blades$.next(this.blades);
    }

    closeBlade(bladeKey: string) {
        if (!this.allowMultipleBlades) {
            // Single blade mode: close everything
            this.clearBlades();
        } else {
            // Multi-blade mode: close only the selected blade
            this.blades = this.blades.filter(b => b.key !== bladeKey);
            this.blades$.next(this.blades);
        }
    }

    clearBlades() {
        this.blades = [];
        this.blades$.next(this.blades);
    }
}
