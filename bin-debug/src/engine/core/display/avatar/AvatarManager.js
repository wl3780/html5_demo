var AvatarManager = (function () {
    function AvatarManager() {
        this.avatarHash = {};
        this.sheetHash = {};
        this.paramHash = {};
        egret.Ticker.getInstance().register(this.onEnterFrame, this);
    }
    var __egretProto__ = AvatarManager.prototype;
    AvatarManager.getInstance = function () {
        if (AvatarManager.instance == null) {
            AvatarManager.instance = new AvatarManager();
        }
        return AvatarManager.instance;
    };
    __egretProto__.addAvatarSheet = function (avatarId) {
        var resId = avatarId + "_json";
        var sheet = RES.getRes(resId);
        this.sheetHash[avatarId] = sheet;
    };
    __egretProto__.addAvatarParam = function (avatarId) {
        var resId = avatarId + "_sm";
        var config = RES.getRes(resId);
        var hash = this.analyzeData(config);
        this.paramHash[avatarId] = hash;
    };
    __egretProto__.getAvatarParamHash = function (avatarId) {
        if (avatarId) {
            return this.paramHash[avatarId];
        }
        return null;
    };
    __egretProto__.put = function (avatar) {
        if (this.avatarHash[avatar.id] == null) {
            this.avatarHash[avatar.id] = avatar;
        }
    };
    __egretProto__.remove = function (id) {
        if (this.avatarHash[id]) {
            delete this.avatarHash[id];
        }
    };
    __egretProto__.take = function (id) {
        return this.avatarHash[id];
    };
    __egretProto__.loadAvatar = function (avatarType, avatarNum) {
        var avatarId = avatarType + "_" + avatarNum;
        if (RES.isGroupLoaded(avatarId) == false) {
            RES.createGroup(avatarId, [avatarId + "_sm", avatarId + "_json", avatarId + "_png"]);
            RES.loadGroup(avatarId);
        }
    };
    __egretProto__.analyzeData = function (config) {
        var hash = {};
        var avatar = config.avatar;
        var avatarId = avatar.id;
        var actionList = avatar.action;
        var actionLen = actionList.length;
        var actionIdx = 0;
        while (actionIdx < actionLen) {
            var actionItem = actionList[actionIdx];
            var param = new AvatarParam();
            param.setup(avatarId, actionItem);
            hash[param.action] = param;
            actionIdx++;
        }
        return hash;
    };
    __egretProto__.onEnterFrame = function (frameTime) {
        for (var key in this.avatarHash) {
            this.avatarHash[key].bodyRender();
        }
    };
    return AvatarManager;
})();
AvatarManager.prototype.__class__ = "AvatarManager";
//# sourceMappingURL=AvatarManager.js.map