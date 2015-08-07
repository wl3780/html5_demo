class AvatarParam {

    public id:string;
    public oid:string;

    public action: string;
    public avatarType: string;
    public replay: number=-1;
    public frames: number;
    public speed: number = 0;
    public offset_x: number;
    public offset_y: number;
    public txs: Array<any>;
    public tys: Array<any>;
    public widths: Array<any>;
    public heights: Array<any>;
    public bitmapFlips:Array<boolean>;
    public singleDir:boolean = false;

    public constructor() {
        this.txs=new Array<any>();
        this.tys=new Array<any>();
        this.widths=new Array<any>();
        this.heights=new Array<any>();
        this.bitmapFlips = new Array<boolean>();
    }

    public setup(avatarId:string, config:any):void {
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

        var dirList:Array<any> = config.action;
        var dirLen:number = dirList.length;
        var dirIdx:number = 0;
        var frameData:any;
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
        } else {
            while (dirIdx < 8) {
                if (dirIdx < dirLen) {
                    frameData = dirList[dirIdx];
                    this.initFrameData(dirIdx, frameData.action);
                    this.bitmapFlips[dirIdx] = false;
                } else {
                    this.txs[dirIdx] = [];
                    var flipDirIdx:number = 8 - dirIdx;
                    var flipFrameIdx:number = 0;
                    while (flipFrameIdx < this.widths[flipDirIdx].length) {
                        var flipFrameX:number = this.widths[flipDirIdx][flipFrameIdx] - this.txs[flipDirIdx][flipFrameIdx];
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
    }

    public getTexture(dir:number, frame:number):egret.Texture
    {
        var key:string = this.oid + "_" + this.action + "_" + dir + "_" + frame;
        if (this.singleDir) {
            key = this.oid + "_" + this.action + "_" + 0 + "_" + frame;
        }
        var manager:AvatarManager = AvatarManager.getInstance();
        var sheet:egret.SpriteSheet = manager.sheetHash[this.oid];
        if (sheet) {
            return sheet.getTexture(key);
        }
        return null;
    }

    private initFrameData(dirIdx:number, frameDatas:Array<any>):void {
        this.txs[dirIdx] = [];
        this.tys[dirIdx] = [];
        this.widths[dirIdx] = [];
        this.heights[dirIdx] = [];

        var frameLen:number = frameDatas.length;
        if (frameLen > this.frames) {
            this.frames = frameLen;
        }
        var frameIdx:number = 0;
        while (frameIdx < frameLen) {
            this.txs[dirIdx].push(<number>frameDatas[frameIdx].tx);
            this.tys[dirIdx].push(<number>frameDatas[frameIdx].ty);
            this.widths[dirIdx].push(<number>frameDatas[frameIdx].width);
            this.heights[dirIdx].push(<number>frameDatas[frameIdx].height);
            frameIdx++;
        }
    }
}
