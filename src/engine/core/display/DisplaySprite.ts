module engine {

    export class DisplaySprite extends egret.Sprite implements IDisplay {

        protected _id_:string;
        protected _oid_:string;
        protected _type_:string;
        protected _proto_:any;
        protected _enabled_:boolean;
        protected _className_:string;
        protected _isDisposed_:boolean;

        constructor() {
            super();
            this._id_ = Engine.getSoleId();
            DisplayObjectPort.addTarget(this);
        }

        public get id():string {
            return this._id_;
        }
        public set id(value:string) {
            this._id_ = value;
        }

        public get oid():string {
            return this._oid_;
        }
        public set oid(value:string) {
            this._oid_ = value;
        }

        public get proto():any {
            return this._proto_;
        }
        public set proto(value:any) {
            this._proto_ = value;
        }

        public get type():string {
            return this._type_;
        }
        public set type(value:string) {
            this._type_ = value;
        }

        public get enabled():boolean {
            return this._enabled_;
        }
        public set enabled(value:boolean) {
            this._enabled_ = value;
        }

        public get className():string {
            if (this._className_ == null) {
                this._className_ = egret.getQualifiedClassName(this);
            }
            return this._className_;
        }
        
        public _setX(value:number) {
            super._setX(value >> 0);
        }
        
        public _setY(value:number) {
            super._setY(value >> 0);
        }

        public get isDisposed():boolean {
            return this._isDisposed_;
        }

        public dispose():void {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            DisplayObjectPort.removeTarget(this.id);
            this._id_ = null;
            this._oid_ = null;
            this._type_ = null;
            this._proto_ = null;
            this._isDisposed_ = true;
        }

        public toString():string {
            return "[" + this.className + Engine.SIGN + this.id + "]";
        }

    }
}