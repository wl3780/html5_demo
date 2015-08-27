module gui {
    export class Button extends UIComponent {

        private _bmp:egret.Bitmap;
        private _label:egret.TextField;
        private _isPress:boolean = false;

        constructor() {
            super();
            this._bmp = new egret.Bitmap();
            this.addChild(this._bmp);

            this.width = 80;
            this.height = 30;
            this.touchChildren = false;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchEventFunc, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEventFunc, this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchEventFunc, this);
        }

        public onRender() {
            super.onRender();
            if (this._styleName_ == null) {
                return;
            }
            var skin:string;
            if (this.enabled == false) {
                skin = this._styleName_ + "_disabled";
            } else if (this._isPress) {
                skin = this._styleName_ + "_down";
            } else {
                skin = this._styleName_ + "_up";
            }
            this._bmp.texture = RES.getRes(skin);
        }

        public dispose() {
            super.dispose();
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchEventFunc, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEventFunc, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchEventFunc, this);
        }

        public set label(value:string) {
            if (this._label == null) {
                this._label = new egret.TextField();
                this._label.textAlign = egret.HorizontalAlign.CENTER;
                this._label.width = this.width;
                this._label.height = this.height;
                this.addChild(this._label);
            }
            this._label.text = value;
        }

        public _setWidth(value:number) {
            super._setWidth(value);
            if (this._bmp) {
                this._bmp.width = value;
            }
            if (this._label) {
                this._label.width = value;
            }
        }

        public _setHeight(value:number) {
            super._setHeight(value);
            if (this._bmp) {
                this._bmp.height = value;
            }
            if (this._label) {
                this._label.height = value;
            }
        }

        private touchEventFunc(evt:egret.TouchEvent) {
            if (this.enabled == false) {
                return;
            }
            switch (evt.type) {
                case egret.TouchEvent.TOUCH_BEGIN:
                    this._isPress = true;
                    break;
                case egret.TouchEvent.TOUCH_END:
                case egret.TouchEvent.TOUCH_RELEASE_OUTSIDE:
                    this._isPress = false;
                    break;
            }
            this.display();
        }

    }
}