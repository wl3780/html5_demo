module gui {
    export class UIComponent extends egret.Sprite implements IUIComponent {

        protected _id_:string;
        protected _oid_:string;
        protected _proto_:any;
        protected _className_:string;
        protected _enabled_:boolean = true;
        protected _styleName_:string;

        constructor() {
            super();
            this.touchEnabled = true;
            this._id_ = engine.Engine.getSoleId();
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._guiTouchBegin_, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this._guiTouchEnd_, this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._guiTouchEnd_, this);
        }

        public display() {
            this.addEventListener(egret.Event.ENTER_FRAME, this.onNextFrameRender, this);
        }

        public onRender() {

        }

        public toString():string {
            return "[" + this.className + engine.Engine.SIGN + this.id + "]";
        }

        public dispose() {
            this._id_ = null;
            this._oid_ = null;
            this._proto_ = null;
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._guiTouchBegin_, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this._guiTouchEnd_, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._guiTouchEnd_, this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onNextFrameRender, this);
        }

        protected _guiTouchBegin_(evt:egret.TouchEvent) {
            engine.Engine.sceneClickEnabled = false;
        }

        protected _guiTouchEnd_(evt:egret.TouchEvent) {

        }

        protected onNextFrameRender(evt:egret.Event) {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onNextFrameRender, this);
            this.onRender();
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

        public get enabled():boolean {
            return this._enabled_;
        }
        public set enabled(value:boolean) {
            this._enabled_ = value;
            this.touchEnabled = this.touchChildren = value;
        }

        public set styleName(value:string) {
            if (this._styleName_ != value) {
                this._styleName_ = value;
                this.display();
            }
        }

        public _setWidth(value:number) {
            if (this.width != value) {
                super._setWidth(value);
                this.display();
            }
        }

        public _setHeight(value:number) {
            if (this.height != value) {
                super._setHeight(value);
                this.display();
            }
        }

        public get className():string {
            if (this._className_ == null) {
                this._className_ = egret.getQualifiedClassName(this);
            }
            return this._className_;
        }

    }
}
