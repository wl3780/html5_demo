module engine {
	export class TileUtils {

		public static pixelsToTile(x:number, y:number, resultValue:egret.Point = null):egret.Point
		{
			var x2:number = x / TileConst.TILE_WIDTH >> 0;
			var y2:number = y / TileConst.TILE_HEIGHT >> 0;
			if(resultValue == null) {
				resultValue = Engine.getPoint();
			}
			resultValue.x = x2;
			resultValue.y = y2;
			return resultValue;
		}

	}
}

