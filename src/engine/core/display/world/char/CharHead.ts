module engine {
    export class CharHead extends DisplaySprite {

        public static intanceHash:Array<CharHead> = [];
        public static cacheBmdHash:Map<>;
        public static charHeadQueue:Array<any> = [];

        public static _blood_:BloodKit;
        public static _nei_:BloodKit;
        public static _nameText_:egret.TextField;
        public static _professionNameText_:egret.TextField;
        public static _unionNameText_:egret.TextField;
        public static _bloodText_:egret.TextField;
        public static _sprite_:egret.Sprite;

        public static _renderNum_:number;
        public static _renderIndex_:number;

        public char_id:string;
        public cacheMode:boolean = false;

        private bmd:egret.RenderTexture;
        private bmp:egret.Bitmap;

        private renderInterval:number = 0;
        private renderIndex:number = 0;
        private renderTime:number = 0;
        private tmpTime:number = 0;
        private _name_:string;
        private _nameColor_:number = 0;
        private _nameVisible_:boolean = false;
        private _bloodKitVisible_:boolean = false;
        private _currBlood_:number = 0;
        private _maxBlood_:number = 0;
        private _neiKitVisible_:boolean = false;
        private _currNei_:number = 0;
        private _maxNei_:number = 0;

        public constructor() {
            super();
            this.init();
        }

        public static setBloodBitmapData(value:egret.Texture) {
            CharHead._blood_.overBitmapData = value;
        }

        public static setNeiLiBitmapData(value:egret.Texture) {
            CharHead._nei_.overBitmapData = value;
        }

        public static setBGBitmapData(value:egret.Texture) {
            CharHead._nei_.bitmapData = value;
            CharHead._blood_.bitmapData = value;
        }

        public static createCharHead():CharHead {
            var result:CharHead = null;
            if (CharHead.charHeadQueue.length) {
                result = CharHead.charHeadQueue.pop();
            } else {
                result = new CharHead();
            }
            return result;
        }

        public setBloodValue(curr:number,max:number) {
            this._currBlood_ = curr;
            this._maxBlood_ = max;
            this.doit();
        }
        public set bloodKitVisible(value:boolean) {
            if (this._bloodKitVisible_ != value) {
                this._bloodKitVisible_ = value;
                this.doit();
            }
        }

        public setNeiValue(curr:number,max:number) {
            this._currNei_ = curr;
            this._maxNei_ = max;
            this.doit();
        }
        public set neiKitVisible(value:boolean) {
            if (this._neiKitVisible_ != value) {
                this._neiKitVisible_ = value;
                this.doit();
            }
        }

        public set nameVisible(value:boolean) {
            if (this._nameVisible_ != value) {
                this._nameVisible_ = value;
                this.doit();
            }
        }
        public set nameColor(value:number) {
            if (this._nameColor_ != value) {
                this._nameColor_ = value;
                this.doit();
            }
        }
        public set name(value:string) {
            if (this._name_ != value) {
                this._name_ = value;
                this.doit();
            }
        }

        private doit() {
            this.tmpTime = egret.getTimer();
            com.coder.core.controls.elisor.HeartbeatFactory.getInstance().addFrameOrder(flash.bind(this.onEnterFrameFunc,this));
        }

        protected onEnterFrameFunc()
        {
            CharHead._renderIndex_ = CharHead._renderIndex_ + 1;
            if(CharHead._renderIndex_ > 1)
            {
                CharHead._renderIndex_ = 0;
            }
            var char:Char = <Char>flash.As3As(avatar.AvatarUnitDisplay.takeUnitDisplay(this.oid),Char);
            if(!char || char.char_id != this.char_id)
            {
                com.coder.core.controls.elisor.HeartbeatFactory.getInstance().removeFrameOrder(flash.bind(this.onEnterFrameFunc,this));
                return ;
            }
            if(this.renderIndex == CharHead._renderIndex_ || egret.getTimer() - this.tmpTime > this.renderInterval || com.coder.utils.FPSUtils.fps > 30)
            {
                this.tmpTime = egret.getTimer();
                com.coder.core.controls.elisor.HeartbeatFactory.getInstance().removeFrameOrder(flash.bind(this.onEnterFrameFunc,this));
                if(char)
                {
                    this.onRender();
                }
            }
        }

        private init() {
            this.touchEnabled = this.touchChildren = false;
            //CharHead._nameText_.filters = EngineGlobal.textFilter;
            //CharHead._unionNameText_.filters = EngineGlobal.textFilter;
            //CharHead._professionNameText_.filters = EngineGlobal.textFilter;
            this.renderInterval = (Math.random() * 700 >> 0) + 100;
            this.renderIndex = (Math.random() * 2) >> 0;
        }

        public onRender() {
            if (this._isDisposed) {
                return;
            }

            var _txtY:number = 0;
            var _this:any = CharHead._sprite_;
            var _txtName:egret.TextField = CharHead._nameText_;
            var _txtBlood:egret.TextField = CharHead._bloodText_;
            var _blood:BloodKit = CharHead._blood_;
            var _nei:BloodKit = CharHead._nei_;
            if (this.bmd) {
                this.bmd.dispose();
            }
            if (_this.numChildren) {
                _this.removeChildren();
            }

            if (this._bloodKitVisible_) {
                _this.addChild(CharHead._bloodText_);
                _this.addChild(CharHead._blood_);
            }
            if (this._neiKitVisible_) {
                _this.addChild(CharHead._nei_);
            }
            if (this._name_ && this._nameVisible_) {
                _this.addChild(CharHead._nameText_);
            }

            if (this._name_ && this._nameVisible_) {
                _txtName.textColor = this._nameColor_;
                _txtName.text = this._name_;
                _txtName.width = _txtName.textWidth + 4;
                _txtName.x = -(_txtName.width / 2);
                _txtName.height = _txtName.textHeight + 4;
                _txtName.y = _txtY;

                _txtY += _txtName.textHeight + 4;
            }
            if (this._bloodKitVisible_) {
                _txtBlood.text = this._currBlood_ + "/" + this._maxBlood_;
                _txtBlood.width = _txtBlood.textWidth + 4;
                _txtBlood.x = -(_txtBlood.width / 2) + 1;
                _txtBlood.height = _txtBlood.textHeight + 4;
                _txtBlood.y = _txtY;

                _blood.width = 46;
                _blood.height = 5;
                _blood.setValue(this._currBlood_, this._maxBlood_);
                _blood.x = -(_blood.width / 2);
                _blood.y = _txtBlood.y + 16 + 2;

                _nei.width = 46;
                _nei.height = 5;
                _nei.setValue(this._currNei_, this._maxNei_);
                _nei.x = -(_nei.width / 2);
                _nei.y = _blood.y + 4;
            }

            if (_this.width && _this.height) {
                this.bmd = new egret.RenderTexture();
                this.bmd.drawToTexture(_this);
                this.bmp.texture = this.bmd;
            } else {
                this.bmp.texture = null;
            }

            this.updateEffectPos();
        }

        private updateEffectPos() {
        }

        public recover() {
            if (this.bmd) {
                this.bmd.dispose();
                this.bmd = null;
            }
            this.graphics.clear();

            this._bloodKitVisible_ = false;
            this._currBlood_ = 0;
            this._maxBlood_ = 0;
            this._name_ = "";
            this._nameVisible_ = false;
            this._nameColor_ = 0xFFFFFF;
            this._professionName_ = "";
            this._professionNameColor_ = 0xFFFFFF;
            this._professionNameVisible_ = false;
            this._nameVisible_ = false;
        }

        public dispose() {
            super.dispose();
        }

    }
}