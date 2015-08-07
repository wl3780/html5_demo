module engine {
	export class TileMapData extends egret.HashObject {

		public map_id:number = 0;
		public pixel_x:number = 0;
		public pixel_y:number = 0;
		public pixel_width:number = 0;
		public pixel_height:number = 0;
		public width:number = 0;
		public height:number = 0;
		public items:Array<ItemData>;

		public constructor() {
			super();
		}

		public uncode(bytes:egret.ByteArray) {
			if(bytes == null) {
				return ;
			}
			bytes.position = 0;

			this.map_id = bytes.readShort();
			this.pixel_x = bytes.readShort();
			this.pixel_y = bytes.readShort();
			this.pixel_width = bytes.readShort();
			this.pixel_height = bytes.readShort();

			var tile_x:number = 0;
			var tile_y:number = 0;
			var tile:Tile = null;

			TileGroup.getInstance().clear();
			var len:number = bytes.readInt();
			var index:number = 0;
			while(index < len) {
				tile_x = bytes.readShort();
				tile_y = bytes.readShort();
				tile = this.prasePro(tile_x, tile_y, bytes.readShort());
				if(tile_x >= 0 && tile_y >= 0) {
					TileGroup.getInstance().put(tile.key, tile);
				}
				index++;
			}

			var p_id:string = null;
			var px:number = 0;
			var py:number = 0;
			var dir:number = 0;
			var data:ItemData = null;

			this.items = new Array<ItemData>();
			len = bytes.readShort();
			index = 0;
			while(index < len) {
				p_id = bytes.readUTF();
				px = bytes.readInt();
				py = bytes.readInt();
				dir = bytes.readByte();
				data = this.praseLayerpro(p_id, px, py, dir);
				this.items.push(data);
				index++;
			}
		}

		public prasePro(x:number, y:number, pro:number):Tile {
			var tile:Tile =Tile.createTile();
			var str:string = pro.toString();
			tile.type = parseInt(str.slice(1,2));
			tile.initValue = tile.type;
			tile.isSafe = parseInt(str.slice(2,3)) == 1;
			tile.isSell = parseInt(str.slice(3,4)) == 1;
			tile.isAlpha = parseInt(str.slice(4,5)) == 1;
			tile.setXY(x,y);

			if(tile.type > 0) {
				tile.color = 0xFF00;
			} else {
				tile.color = 0xFF0000;
			}
			return tile;
		}

		public praseLayerpro(id:string, x:number, y:number, dir:number):ItemData {
			var result:ItemData = new ItemData();
			result.x = x;
			result.y = y;
			result.item_id = id;
			result.dir = dir;
			return result;
		}

	}
}

