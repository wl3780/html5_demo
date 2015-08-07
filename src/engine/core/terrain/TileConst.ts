module engine {
	export class TileConst {

		public static BLOCK_TYPE:number = 0;
		public static ROAD_TYPE:number = 1;

		public static LEFT:number = -1;
		public static RIGHT:number = 1;

		public static TILE_SIZE:number = 35;
		public static TILE_HEIGHT:number = 30;
		public static TILE_WIDTH:number = TileConst.TILE_HEIGHT * 2;
		public static WH:number = TileConst.TILE_WIDTH * 0.5;
		public static HH:number = TileConst.TILE_HEIGHT * 0.5;
		public static Tile_XIE:number = 60;
	}
}
