class MainCharWalkManager {

    private static _instance:MainCharWalkManager;

    public walkEndFunc:Function;

    private astar:engine.TileAstar;
    private walkPathFragments:Array<Array<egret.Point>>;

    public constructor() {
        this.astar = new engine.TileAstar();
        this.walkPathFragments = [];
    }

    public static getInstance():MainCharWalkManager {
        if (MainCharWalkManager._instance ==  null) {
            MainCharWalkManager._instance = new MainCharWalkManager();
        }
        return MainCharWalkManager._instance;
    }

    public mainCharMove(p_tar:egret.Point, callback:Function, breakStep:number=1500) {
        this.walkPathFragments.length = 0;
        this.walkEndFunc = callback;
        var mainChar:engine.MainChar = GameScene.scene.mainChar;
        var p_cur:egret.Point = engine.Engine.getPoint(mainChar.x, mainChar.y);
        var tp_start:egret.Point = engine.TileUtils.pixelsToTile(p_cur.x, p_cur.y);
        var tp_end:egret.Point = engine.TileUtils.pixelsToTile(p_tar.x, p_tar.y);

        var array:Array<egret.Point>;
        if (tp_start.equals(tp_end)) {
            array = [p_cur, p_tar];
        } else {
            array = this.getPath(p_cur, p_tar, breakStep);
        }
        this.doMove(array);
    }

    public getPath(p_start:egret.Point, p_end:egret.Point, breakStep:number=1500):Array<egret.Point> {
        var tp_start:egret.Point = engine.TileUtils.pixelsToTile(p_start.x, p_start.y);
        var tp_end:egret.Point = engine.TileUtils.pixelsToTile(p_end.x, p_end.y);
        if (tp_start.equals(tp_end)) {
            return [p_start, p_end];
        }
        var ret:Array<egret.Point>;
        if (this.checkPointType(p_start, p_end) && (tp_start.x == tp_end.x || tp_start.y == tp_end.y)) {
            ret = [p_start, p_end];
        } else {
            ret = this.astar.getPath(engine.TileGroup.getInstance().hash, tp_start.x, tp_start.y, tp_end.x, tp_end.y, true, breakStep);
            if (ret.length) {
                /*
                var p_tail:egret.Point = ret[ret.length-1];
                if (tp_end.equals(engine.TileUtils.pixelsToTile(p_tail.x, p_tail.y))) {
                    ret[ret.length-1] = p_end;
                }
                */
                var p_head:egret.Point = ret[0];
                if (tp_start.equals(engine.TileUtils.pixelsToTile(p_head.x, p_head.y))) {
                    ret[0] = p_start;
                }
            }
            engine.TileAstar.cleanPath(ret);
        }
        return ret;
    }

    private checkPointType(p_start:egret.Point, p_end:egret.Point, px:number=10):boolean {
        var dis:number = egret.Point.distance(p_start, p_end);
        var step:number = Math.ceil(dis / px);
        var idx:number = 0;
        while (idx < step) {
            var p_inter:egret.Point = egret.Point.interpolate(p_start, p_end, idx/step);
            var tp_inter:egret.Point = engine.TileUtils.pixelsToTile(p_inter.x, p_inter.y);
            var tile:engine.Tile = engine.TileGroup.getInstance().take(tp_inter.x + "|" + tp_inter.y);
            if (tile == null || tile.type == 0 || tile.type != this.astar.mode) {
                return false;
            }
            idx++;
        }
        return true;
    }

    private doMove(array:Array<egret.Point>) {
        //this.pathCutter(array);
        for (var i=1; i<array.length-1; i++) {
            var p1:egret.Point = engine.TileUtils.toPixelsCenter(array[i-1].x, array[i-1].y);
            var p2:egret.Point = engine.TileUtils.toPixelsCenter(array[i].x, array[i].y);
            var p3:egret.Point = engine.TileUtils.toPixelsCenter(array[i+1].x, array[i+1].y);
            var k1:number = (p2.y - p1.y) / (p2.x - p1.x);
            var k2:number = (p3.y - p2.y) / (p3.x - p2.x);
            if (k1 == k2) {
                array.splice(i, 1);
                i--;
            }
        }
        // 3个拐点进行分组
        if (array.length > 3) {
            this.walkPathFragments = engine.TileAstar.pathCutter(array, 3);
        } else {
            this.walkPathFragments = [array];
        }
        if (this.walkPathFragments.length) {
            this.walkNextPart();
        } else {
            this.totalWalkEnd();
        }
    }

    private pathCutter(array:Array<egret.Point>, size:number=140, _arg_3:number=350):void {
        var len:number = array.length;
        if (len < 2) {
            return;
        }
        var new_paths:Array<egret.Point> = [];
        var i:number = 0;
        var j:number = 0;
        while (i < len-1) {
            var p_start:egret.Point = array[i];
            var p_end:egret.Point = array[i+1];
            var dis:number = egret.Point.distance(p_start, p_end);
            var step:number = Math.ceil(dis / size);
            j = 0;
            while (j < step) {
                var p_now:egret.Point = egret.Point.interpolate(p_end, p_start, j/step);
                p_now.x = Math.round(p_now.x);
                p_now.y = Math.round(p_now.y);
                if (new_paths.length == 0 || p_now.equals(new_paths[new_paths.length-1]) == false) {
                    new_paths.push(p_now);
                }
                j++;
            }
            i++;
        }

        if (new_paths.length > 1) {
            len = new_paths.length;
            var sum:number = 0;
            var i_start:number = 0;
            var n_start:number = 1;
            while (n_start < len) {
                sum += egret.Point.distance(new_paths[n_start-1], new_paths[n_start]);
                if ((Math.ceil(sum) >= _arg_3) || (n_start == len-1)) {
                    var pts:Array<egret.Point> = new_paths.slice(i_start, (n_start+1));
                    this.walkPathFragments.push(pts);
                    sum = 0;
                    i_start = n_start;
                }
                n_start++;
            }
        }
    }

    private totalWalkEnd():void {
        GameScene.scene.mainChar.stopMove();
        if (this.walkEndFunc != null) {
            var tmpFunc:Function = this.walkEndFunc;
            this.walkEndFunc = null;
            tmpFunc();
        }
    }

    private walkNextPart():void {
        var list:Array<egret.Point> = this.walkPathFragments.shift();
        GameScene.scene.mainChar.moveEndFunc = this.charPartWalkEndFunc;
        GameScene.scene.mainChar.tarMoveTo(list);
        this.sendWalkData(list);
    }

    private charPartWalkEndFunc():void {
        var self = MainCharWalkManager._instance;
        if (self.walkPathFragments.length == 0) {
            self.totalWalkEnd();
        } else {
            self.walkNextPart();
        }
    }

    private sendWalkData(list:Array<egret.Point>):void {
    }

}