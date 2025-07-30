import { Type } from "@angular/core";

export interface IBlade {
    key: string;               // Unique blade key
    title: string;             // Blade title
    url?: string;              // Optional navigation URL (if routing-based)
    contentUrl?: string;       // Optional URL for external content (iframe style)
    parentKey?: string;        // Optional parent blade reference
    component?: Type<any>;     // ✅ Angular component to render dynamically
    data?: any;                // ✅ Optional data for the blade
}

export class Blade implements IBlade {
    constructor(
        public key: string,
        public title: string,
        public component: Type<any>,
        public contentUrl: string,
        public parentKey?: string
    ) { }
}
