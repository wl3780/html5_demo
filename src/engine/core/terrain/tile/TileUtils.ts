module engine {
	export class TileUtils {

		public static pixelsToTile(x:number, y:number, resultValue:egret.Point = null):egret.Point {
			var x2:number = x / TileConst.TILE_WIDTH >> 0;
			var y2:number = y / TileConst.TILE_HEIGHT >> 0;
			if(resultValue == null) {
				resultValue = Engine.getPoint();
			}
			resultValue.x = x2;
			resultValue.y = y2;
			return resultValue;
		}

		public static tileToPixels(tile:egret.Point, resultValue:egret.Point = null):egret.Point {
			var x:number = tile.x * TileConst.TILE_WIDTH + TileConst.WH;
			var y:number = tile.y * TileConst.TILE_HEIGHT + TileConst.HH;
			if(resultValue) {
				resultValue.x = x;
				resultValue.y = y;
				return resultValue;
			}
			var result:egret.Point = engine.Engine.getPoint();
			result.x = x;
			result.y = y;
			return result;
		}

	}
}

