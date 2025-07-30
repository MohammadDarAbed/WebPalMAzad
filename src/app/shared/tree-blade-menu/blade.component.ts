import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBlade } from './models/blade.model';
import { BladeService } from './Services/blade.service';

@Component({
    selector: 'app-blade',
    templateUrl: './blade.component.html',
    styleUrls: ['./blade.component.scss']
})
export class BladeComponent {
    @Input() blade!: IBlade;
    @Output() close = new EventEmitter<void>();

    constructor(private bladeService: BladeService) { }

    openChildBlade() {
        this.bladeService.openBlade({
            key: `${this.blade.key}-child`,
            title: `Child of ${this.blade.title}`,
            contentUrl: `/blades/${this.blade.key}/child`,
            parentKey: this.blade.key
        });
    }
}
