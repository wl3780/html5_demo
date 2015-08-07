var Avatar = (function (_super) {
    __extends(Avatar, _super);
    function Avatar() {
        _super.call(this);
        this.action = AvatarAction.WALK;
        this._dir = 4;
        this._currentFrame = 0;
        this._lastTime = 0;
        this.point = new egret.Point();
        this.id = egret.getTimer().toString(16);
        AvatarManager.getInstance().put(this);
    }
    var __egretProto__ = Avatar.prototype;
    __egretProto__.bodyRender = function () {
        var hash_mid = AvatarManager.getInstance().getAvatarParamHash(this.id_mid);
        var hash_wid = AvatarManager.getInstance().getAvatarParamHash(this.id_wid);
        var hash_wgid = AvatarManager.getInstance().getAvatarParamHash(this.id_wgid);
        var param;
        if (hash_mid) {
            param = hash_mid[this.action];
        }
        else if (hash_wid) {
            param = hash_wid[this.action];
        }
        else if (hash_wgid) {
            param = hash_wgid[this.action];
        }
        if (param) {
            var passTime = egret.getTimer() - this._lastTime;
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
    };
    __egretProto__.onRender = function (avatarType, param) {
        if (param) {
            var tx = param.txs[this.dir][this._currentFrame];
            var ty = param.tys[this.dir][this._currentFrame];
            var texture = param.getTexture(this.dir, this._currentFrame);
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
        }
        else {
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
    };
    __egretProto__.loadAvatarPart = function (avatarType, avatarNum) {
        var avatarId = avatarType + "_" + avatarNum;
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
            AvatarManager.getInstance().loadAvatar(avatarType, avatarNum);
        }
        else {
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
    };
    Object.defineProperty(__egretProto__, "x", {
        set: function (value) {
            this._setX(value);
            this.point.x = this.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(__egretProto__, "y", {
        set: function (value) {
            this._setY(value);
            this.point.y = this.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(__egretProto__, "dir", {
        get: function () {
            return this._dir;
        },
        set: function (value) {
            this._dir = value;
        },
        enumerable: true,
        configurable: true
    });
    return Avatar;
})(egret.DisplayObjectContainer);
Avatar.prototype.__class__ = "Avatar";
var AvatarAction = (function () {
    function AvatarAction() {
    }
    var __egretProto__ = AvatarAction.prototype;
    /**
     * 行走
     */
    AvatarAction.WALK = "walk";
    /**
     * 站立
     */
    AvatarAction.STAND = "stand";
    /**
     * 死亡
     */
    AvatarAction.DEATH = "death";
    /**
     * 群攻
     */
    AvatarAction.QUNGONG = "qungong";
    /**
     * 攻击
     */
    AvatarAction.ATTACK = "attack";
    /**
     * 飞行
     */
    AvatarAction.FLY = "fly";
    /**
     * 受击
     */
    AvatarAction.HIT = "hit";
    /**
     * 采集
     */
    AvatarAction.COLLECTION = "caiji";
    /**
     * 打坐
     */
    AvatarAction.MEDITATION = "dazuo";
    /**
     * 技能1
     */
    AvatarAction.SKILL1 = "skill1";
    /**
     * 技能2
     */
    AvatarAction.SKILL2 = "jump";
    /**
     * 技能3
     */
    AvatarAction.SKILL3 = "skill3";
    return AvatarAction;
})();
AvatarAction.prototype.__class__ = "AvatarAction";
var AvatarTypes = (function () {
    function AvatarTypes() {
    }
    var __egretProto__ = AvatarTypes.prototype;
    /**
     * eid
     */
    AvatarTypes.EFFECT_TYPE = "eid";
    /**
     * mid
     */
    AvatarTypes.BODY_TYPE = "mid";
    /**
     * wid
     */
    AvatarTypes.WEAPON_TYPE = "wid";
    /**
     * wgid
     */
    AvatarTypes.WING_TYPE = "wgid";
    /**
     * midm
     */
    AvatarTypes.MOUNT_TYPE = "midm";
    /**
     * fid
     */
    AvatarTypes.FLY_TYPE = "fid";
    return AvatarTypes;
})();
AvatarTypes.prototype.__class__ = "AvatarTypes";
