module engine {

    export class Proto implements IProto {

        static _className_:string;

        protected _id_:string;
        protected _oid_:string;
        protected _proto_:any;

        constructor() {
            this._id_ = Engine.getSoleId();
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

        public get className():string {
            if (Proto._className_ == null) {
                Proto._className_ = egret.getQualifiedClassName(this);
            }
            return Proto._className_;
        }

        public dispose():void {
            this._id_ = null;
            this._oid_ = null;
            this._proto_ = null;
        }

        public clone():any {
            return this;
        }

        public toString():string {
            return "[" + this.className + Engine.SIGN + this.id + "]";
        }

    }
}