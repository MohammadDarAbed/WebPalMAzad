export interface ITreeMenuItemGroup {
    key: string;
    name: string;
    menuItems: Array<ITreeMenuItem>;
    permissions?: string[];
}

export interface ITreeMenuItem {
    key: string;
    name: string;
    url: string;
    permissions?: string[];
}

export class TreeMenuItemGroup implements ITreeMenuItemGroup {
    constructor(
        public key: string,
        public name: string,
        public menuItems: Array<ITreeMenuItem>,
        public permissions: string[] = []
    ) { }
}

export class TreeMenuItem implements ITreeMenuItem {
    constructor(
        public key: string,
        public name: string,
        public url: string,
        public permissions: string[] = []
    ) { }
}
