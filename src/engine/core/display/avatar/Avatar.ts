module engine {

    export class Avatar extends egret.DisplayObjectContainer {

        public id:string;
        public oid:string;

        protected bmd_mid:egret.Bitmap;
        protected bmd_wid:egret.Bitmap;
        protected bmd_wgid:egret.Bitmap;
        protected id_mid:string;
        protected id_wid:string;
        protected id_wgid:string;

        protected point:egret.Point;
        protected action:string = ActionConst.WALK;

        private _dir:number = 4;
        private _currentFrame:number = 0;
        private _lastTime:number = 0;

        public constructor() {
            super();
            this.point = new egret.Point();
            this.id = egret.getTimer().toString(16);
            AvatarRequestManager.getInstance().put(this);
        }

        public bodyRender():void {
            var hash_mid:any = AvatarRequestManager.getInstance().getAvatarParamHash(this.id_mid);
            var hash_wid:any = AvatarRequestManager.getInstance().getAvatarParamHash(this.id_wid);
            var hash_wgid:any = AvatarRequestManager.getInstance().getAvatarParamHash(this.id_wgid);
            var param:AvatarParam;
            if (hash_mid) {
                param = hash_mid[this.action];
            } else if (hash_wid) {
                param = hash_wid[this.action];
            } else if (hash_wgid) {
                param = hash_wgid[this.action];
            }
            if (param) {
                var passTime:number = egret.getTimer() - this._lastTime;
                if (passTime >= param.speed) {
                    this._lastTime = egret.getTimer();
                    if (this._currentFrame >= param.frames) {
                        this._currentFrame = 0;
                    }
                    this.onRender(AvatarTypes.BODY_TYPE, hash_mid ? hash_mid[this.action] : null);
                    this.onRender(AvatarTypes.WEAPON_TYPE, hash_wid ? hash_wid[this.action] : null);
                    this.onRender(AvatarTypes.WING_TYPE, hash_wgid ? hash_wgid[this.action] : null);
                    this._currentFrame++;
                }
            }
        }

        public onRender(avatarType:string, param:AvatarParam):void {
            if (param) {
                var tx:number = param.txs[this.dir][this._currentFrame];
                var ty:number = param.tys[this.dir][this._currentFrame];
                var texture:egret.Texture = param.getTexture(this.dir, this._currentFrame);
                switch (avatarType) {
                    case AvatarTypes.BODY_TYPE:
                        if (!this.bmd_mid) {
                            this.bmd_mid = new egret.Bitmap();
                            this.addChild(this.bmd_mid);
                        }
                        this.bmd_mid.texture = texture;
                        this.bmd_mid.x = -tx;
                        this.bmd_mid.y = -ty;
                        break;
                    case AvatarTypes.WEAPON_TYPE:
                        if (!this.bmd_wid) {
                            this.bmd_wid = new egret.Bitmap();
                            this.addChild(this.bmd_wid);
                        }
                        this.bmd_wid.texture = texture;
                        break;
                    case AvatarTypes.WING_TYPE:
                        if (!this.bmd_wgid) {
                            this.bmd_wgid = new egret.Bitmap();
                            this.addChild(this.bmd_wgid);
                        }
                        this.bmd_wgid.texture = texture;
                        break;
                }
            } else {
                switch (avatarType) {
                    case AvatarTypes.BODY_TYPE:
                        if (this.bmd_mid) {
                            this.bmd_mid.texture = null;
                        }
                        break;
                    case AvatarTypes.WEAPON_TYPE:
                        if (this.bmd_wid) {
                            this.bmd_wid.texture = null;
                        }
                        break;
                    case AvatarTypes.WING_TYPE:
                        if (this.bmd_wgid) {
                            this.bmd_wgid.texture = null;
                        }
                        break;
                }
            }
        }

        public loadAvatarPart(avatarType:string, avatarNum:string):void {
            var avatarId:string = avatarType + "_" + avatarNum;
            if (avatarNum) {
                switch (avatarType) {
                    case AvatarTypes.BODY_TYPE:
                        this.id_mid = avatarId;
                        break;
                    case AvatarTypes.WEAPON_TYPE:
                        this.id_wid = avatarId;
                        break;
                    case AvatarTypes.WING_TYPE:
                        this.id_wgid = avatarId;
                        break;
                }
                AvatarRequestManager.getInstance().loadAvatarFormat(avatarType, avatarNum);
            } else {
                switch (avatarType) {
                    case AvatarTypes.BODY_TYPE:
                        this.id_mid = null;
                        if (this.bmd_mid) {
                            this.bmd_mid.texture = null;
                        }
                        break;
                    case AvatarTypes.WEAPON_TYPE:
                        this.id_wid = null;
                        if (this.bmd_wid) {
                            this.bmd_wid.texture = null;
                        }
                        break;
                    case AvatarTypes.WING_TYPE:
                        this.id_wgid = null;
                        if (this.bmd_wgid) {
                            this.bmd_wgid.texture = null;
                        }
                        break;
                }
            }
        }

        public set x(value:number) {
            this._setX(value);
            this.point.x = this.x;
        }

        public set y(value:number) {
            this._setY(value);
            this.point.y = this.y;
        }

        public set dir(value:number) {
            this._dir = value;
        }

        public get dir():number {
            return this._dir;
        }
    }
}
