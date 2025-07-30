import { Component, Input } from "@angular/core";
import { Blade } from "../models/blade.model";
import { ITreeMenuItemGroup, ITreeMenuItem } from "../models/tree-menu.model";
import { BladeService } from "../Services/blade.service";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ProductListComponent } from "../../../features/products/pages/product-list/product-list.component";

@Component({
    selector: 'app-tree-menu',
    templateUrl: './tree-menu.component.html',
    styleUrls: ['./tree-menu.component.scss'],
    imports: [CommonModule]
})
export class TreeMenuComponent {
    @Input() menuGroups: ITreeMenuItemGroup[] = [];

    expandedGroups: Set<string> = new Set(); // Track open groups

    constructor(private bladeService: BladeService, private router: Router) { }

    toggleGroup(groupKey: string) {
        if (this.expandedGroups.has(groupKey)) {
            this.expandedGroups.delete(groupKey); // Collapse
        } else {
            this.expandedGroups.add(groupKey); // Expand
        }
    }

    isExpanded(groupKey: string): boolean {
        return this.expandedGroups.has(groupKey);
    }

    onMenuItemClick(item: ITreeMenuItem) {
        this.router.navigate(['home', item.url]);
    }

    // onMenuItemClick(item: ITreeMenuItem) { // Open a new blade but don't forget to add the blade in the home page 
    //     if (item.key === 'list') {
    //         this.bladeService.openBlade({
    //             key: 'product-list',
    //             title: 'Product List',
    //             component: ProductListComponent
    //         });
    //     }
    // }
}
