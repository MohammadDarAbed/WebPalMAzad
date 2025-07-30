import { Component, OnInit } from '@angular/core';
import { IBlade } from '../models/blade.model';
import { Observable } from 'rxjs';
import { BladeService } from '../Services/blade.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-blade-container',
    templateUrl: './blade-container.component.html',
    styleUrls: ['./blade-container.component.scss'],
    imports: [CommonModule, RouterOutlet]
})
export class BladeContainerComponent implements OnInit {
    blades$!: Observable<IBlade[]>;

    constructor(private bladeService: BladeService) { }

    ngOnInit() {
        this.blades$ = this.bladeService.blades$;
    }

    closeBlade(key: string) {
        this.bladeService.closeBlade(key);
    }
}
