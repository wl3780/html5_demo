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
        private _thisObject:any;

        public constructor(request?:egret.URLRequest) {
            super(request);
            this.id = Engine.getSoleId();
            WealthStoragePort.addLoader(this);
        }

        public loadElemt(path:string, successFunc:Function, errorFunc:Function = null, progressFunc:Function = null, thisObject:any = null) {
            this.path = path;
            this._successFunc = successFunc;
            this._errorFunc = errorFunc;
            this._progressFunc = progressFunc;
            this._thisObject = thisObject;

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
            this._thisObject = null;
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

        private _successFunc_(evt:egret.Event) {
            this.removeEventListener(egret.Event.COMPLETE, this._successFunc_, this);
            this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this._errorFunc_, this);
            this.removeEventListener(egret.ProgressEvent.PROGRESS, this._progressFunc_, this);
            WealthStoragePort.depositWealth(this.path, this.id);

            this._successFunc.apply(this._thisObject, [this.path]);
            this._successFunc = null;
            this._progressFunc = null;
            this._errorFunc = null;
        }

        private _errorFunc_(evt:egret.IOErrorEvent) {
            this.removeEventListener(egret.Event.COMPLETE, this._successFunc_, this);
            this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this._errorFunc_, this);
            this.removeEventListener(egret.ProgressEvent.PROGRESS, this._progressFunc_, this);
            WealthStoragePort.depositWealth(this.path, this.id);

            this._errorFunc.apply(this._thisObject, [this.path]);
            this._successFunc = null;
            this._progressFunc = null;
            this._errorFunc = null;
        }

        private _progressFunc_(evt:egret.ProgressEvent) {
            this._progressFunc.apply(this._thisObject, [this.path, evt.bytesLoaded, evt.bytesTotal]);
        }

    }
}