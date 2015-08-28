module engine {
    export class WealthLoader extends egret.URLLoader implements ILoader {

        public id:string;
        public oid:string;
        public proto:any;
        public name:string;
        public path:string;

        private _className:string;
        private _successFunc:Function;
        private _errorFunc:Function;
        private _progressFunc:Function;

        public constructor(request?:egret.URLRequest) {
            super(request);
            this.id = Engine.getSoleId();
            WealthStoragePort.addLoader(this);
        }

        public loadElemt(path:string, successFunc:(string)=>void = null, errorFunc:(string)=>void = null, progressFunc:(string,number,number)=>void = null):void {
            this.path = path;
            this._successFunc = successFunc;
            this._errorFunc = errorFunc;
            this._progressFunc = progressFunc;

            if (this._successFunc) {
                this.addEventListener(egret.Event.COMPLETE, this._successFunc_, this);
            }
            if (this._errorFunc) {
                this.addEventListener(egret.IOErrorEvent.IO_ERROR, this._errorFunc_, this);
            }
            if (this._progressFunc) {
                this.addEventListener(egret.ProgressEvent.PROGRESS, this._progressFunc_, this);
            }
            this.load(new egret.URLRequest(path));
        }

        public dispose() {
            WealthStoragePort.removeLoader(this.id);
            this.id = null;
            this.oid = null;
            this.proto = null;
            this._successFunc = null;
            this._progressFunc = null;
            this._errorFunc = null;
            this.removeEventListener(egret.Event.COMPLETE, this._successFunc_, this);
            this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this._errorFunc_, this);
            this.removeEventListener(egret.ProgressEvent.PROGRESS, this._progressFunc_, this);
        }

        public toString() {
            return "[" + this.className + Engine.SIGN + this.id + "]";
        }

        public get className():string {
            if (this._className == null) {
                this._className = egret.getQualifiedClassName(this);
            }
            return this._className;
        }

        private _successFunc_(evt:egret.Event):void {
            this._successFunc.apply(null, [this.path]);
            this._successFunc = null;
            this._progressFunc = null;
            this._errorFunc = null;
            this.removeEventListener(egret.Event.COMPLETE, this._successFunc_, this);
            this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this._errorFunc_, this);
            this.removeEventListener(egret.ProgressEvent.PROGRESS, this._progressFunc_, this);
        }

        private _errorFunc_(evt:egret.IOErrorEvent):void {
            this._errorFunc.apply(null, [this.path]);
            this._successFunc = null;
            this._progressFunc = null;
            this._errorFunc = null;
            this.removeEventListener(egret.Event.COMPLETE, this._successFunc_, this);
            this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this._errorFunc_, this);
            this.removeEventListener(egret.ProgressEvent.PROGRESS, this._progressFunc_, this);
        }

        private _progressFunc_(evt:egret.ProgressEvent):void {
            this._progressFunc.apply(null, [this.path, evt.bytesLoaded, evt.bytesTotal]);
        }

    }
}