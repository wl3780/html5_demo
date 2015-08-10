module engine {
    export class TileGroup {

        private static _instance:TileGroup;

        private _hash:Map<string, Tile> = new Map<string, Tile>();

        public static getInstance():TileGroup {
            if (TileGroup._instance == null) {
                TileGroup._instance = new TileGroup();
            }
            return TileGroup._instance;
        }

        public get hash():Map<string, Tile> {
            return this._hash;
        }

        public put(key:string, tile:Tile) {
            this._hash.set(key, tile);
        }

        public take(key:string):Tile {
            return this._hash.get(key);
        }

        public has(key:string):boolean {
            return this._hash.has(key);
        }

        public remove(key:string):boolean {
            return this._hash.delete(key);
        }

        public clear():void {
            this._hash.forEach(v => {
                v.dispose();
            });
            this._hash.clear();
        }
    }
}