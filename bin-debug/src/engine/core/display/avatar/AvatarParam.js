var AvatarParam = (function () {
    function AvatarParam() {
        this.replay = -1;
        this.speed = 0;
        this.singleDir = false;
        this.txs = new Array();
        this.tys = new Array();
        this.widths = new Array();
        this.heights = new Array();
        this.bitmapFlips = new Array();
    }
    var __egretProto__ = AvatarParam.prototype;
    __egretProto__.setup = function (avatarId, config) {
        this.avatarType = avatarId.split("_")[0];
        this.action = config.id;
        this.frames = config.frames;
        this.speed = config.speed;
        this.offset_x = config.offset_x;
        this.offset_y = config.offset_y;
        this.replay = config.replay;
        if (this.replay == 0) {
            this.replay = -1;
        }
        this.oid = avatarId;
        this.id = avatarId + "@" + this.action;
        var dirList = config.action;
        var dirLen = dirList.length;
        var dirIdx = 0;
        var frameData;
        if (dirLen == 1) {
            this.singleDir = true;
            frameData = dirList[0];
            this.initFrameData(0, frameData.action);
            while (dirIdx < 8) {
                this.txs[dirIdx] = this.txs[0];
                this.tys[dirIdx] = this.txs[0];
                this.widths[dirIdx] = this.txs[0];
                this.heights[dirIdx] = this.txs[0];
                this.bitmapFlips[dirIdx] = false;
                dirIdx++;
            }
        }
        else {
            while (dirIdx < 8) {
                if (dirIdx < dirLen) {
                    frameData = dirList[dirIdx];
                    this.initFrameData(dirIdx, frameData.action);
                    this.bitmapFlips[dirIdx] = false;
                }
                else {
                    this.txs[dirIdx] = [];
                    var flipDirIdx = 8 - dirIdx;
                    var flipFrameIdx = 0;
                    while (flipFrameIdx < this.widths[flipDirIdx].length) {
                        var flipFrameX = this.widths[flipDirIdx][flipFrameIdx] - this.txs[flipDirIdx][flipFrameIdx];
                        this.txs[dirIdx].push(flipFrameX);
                        flipFrameIdx++;
                    }
                    this.tys[dirIdx] = this.tys[flipDirIdx];
                    this.widths[dirIdx] = this.tys[flipDirIdx];
                    this.heights[dirIdx] = this.heights[flipDirIdx];
                    this.bitmapFlips[dirIdx] = true;
                }
                dirIdx++;
            }
        }
    };
    __egretProto__.getTexture = function (dir, frame) {
        var key = this.oid + "_" + this.action + "_" + dir + "_" + frame;
        if (this.singleDir) {
            key = this.oid + "_" + this.action + "_" + 0 + "_" + frame;
        }
        var manager = AvatarManager.getInstance();
        var sheet = manager.sheetHash[this.oid];
        if (sheet) {
            return sheet.getTexture(key);
        }
        return null;
    };
    __egretProto__.initFrameData = function (dirIdx, frameDatas) {
        this.txs[dirIdx] = [];
        this.tys[dirIdx] = [];
        this.widths[dirIdx] = [];
        this.heights[dirIdx] = [];
        var frameLen = frameDatas.length;
        if (frameLen > this.frames) {
            this.frames = frameLen;
        }
        var frameIdx = 0;
        while (frameIdx < frameLen) {
            this.txs[dirIdx].push(frameDatas[frameIdx].tx);
            this.tys[dirIdx].push(frameDatas[frameIdx].ty);
            this.widths[dirIdx].push(frameDatas[frameIdx].width);
            this.heights[dirIdx].push(frameDatas[frameIdx].height);
            frameIdx++;
        }
    };
    return AvatarParam;
})();
AvatarParam.prototype.__class__ = "AvatarParam";
//# sourceMappingURL=AvatarParam.js.map