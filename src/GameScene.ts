class GameScene extends engine.Scene {

    public static scene:GameScene;

    public constructor() {
        super();
        GameScene.scene = this;
    }

    private sceneDraw() {
        var shape:egret.Shape = new egret.Shape();
        GameScene.scene.addChild(shape);
        var pen:egret.Graphics = shape.graphics;
        pen.lineStyle(0.5, 0x0);
        var mapData:engine.TileMapData = GameScene.scene.mapData;
        var cols:number = mapData.pixel_width / engine.TileConst.TILE_WIDTH;
        var rows:number = mapData.pixel_height / engine.TileConst.TILE_HEIGHT;
        for (var i:number=0; i<cols; i++) {
            pen.moveTo(i*engine.TileConst.TILE_WIDTH, 0);
            pen.lineTo(i*engine.TileConst.TILE_WIDTH, mapData.pixel_height);
            for (var j:number=0; j<rows; j++) {
                if (i == 0) {
                    pen.moveTo(0, j*engine.TileConst.TILE_HEIGHT);
                    pen.lineTo(mapData.pixel_width, j*engine.TileConst.TILE_HEIGHT);
                }
            
                var key:string = i + "|" + j;
                var sq:engine.Tile = engine.TileGroup.getInstance().take(key);
                if (sq) {
                    pen.beginFill(sq.color, 0.2);
                    pen.drawRect(i*engine.TileConst.TILE_WIDTH, j*engine.TileConst.TILE_HEIGHT, engine.TileConst.TILE_WIDTH, engine.TileConst.TILE_HEIGHT);
                    pen.endFill();
                }
            }
        }
    }

    private _isDraw:Boolean;
    protected _EngineMouseDownFunc_(evt:egret.TouchEvent):void {
        super._EngineMouseDownFunc_(evt);
        if (this.isReady == false) {
            return;
        }
        this.mouseDownPoint.setTo(evt.stageX-this.x, evt.stageY-this.y);
        MainCharWalkManager.getInstance().mainCharWalk(this.mouseDownPoint, null);
        if (!this._isDraw) {
            this._isDraw = true;
            //this.sceneDraw();
        }
    }
}