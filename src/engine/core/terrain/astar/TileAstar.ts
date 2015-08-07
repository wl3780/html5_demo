module engine {
	export class TileAstar extends egret.HashObject {

		public static COST_STRAIGHT:number = 10;
		public static COST_DIAGONAL:number = 14;
		public static DIR_TC:string = "tc";
		public static DIR_CL:string = "cl";
		public static DIR_CR:string = "cr";
		public static DIR_BC:string = "bc";

		public static newStartPt:egret.Point;
		public static keyIndex:egret.Point;

		public g:egret.Graphics;
		public mode:number = 1;
		private nonce:TileAstarData;
		private isFinish:boolean = false;
		private G:number = 0;
		private source:flash.Dictionary;
		private startPoint:egret.Point;
		private _endPoint:egret.Point;
		private colsePath:flash.Dictionary;
		private openPath:flash.Dictionary;
		private colseArray:Array<any>;
		private openArray:Array<any>;
		private pathArray:Array<any>;
		private canTL:boolean = false;
		private canTR:boolean = false;
		private canBL:boolean = false;
		private canBR:boolean = false;
		private canTC:boolean = false;
		private canCL:boolean = false;
		private canCR:boolean = false;
		private canBC:boolean = false;
		private closeLength:number = 0;

		public static loopRect(index_x:number, index_y:number, loopNum:number, dic:Map, type:number, indexPt:egret.Point):egret.Point {
			var loop:number = 0;
			var loop_height:number = 0;
			var px:number = 0;
			var py:number = 0;
			var dir:number = 0;
			var num:number = 0;
			var k:number = 0;
			var isBreak:boolean;
			var i:number = 0;
			var key:string = null;
			var tile:Tile = null;
			var dirx:number = 0;
			var ok:boolean;
			var currDir:number = 0;
			var startDepth:number = 0;
			index_x = (index_x - 2);
			index_y = (index_y - 2);
			loopNum = (startDepth + loopNum);
			var pow:number = 2;
			var n:number = startDepth;
			var loop_low:number = ((pow * startDepth) + 1);
			var array:Array<any> = [];
			while(n < loopNum) {
				px = (index_x - (n - 1));
				py = (index_y - (n - 1));
				dir = 1;
				num = 0;
				k = 0;
				loop_height = (loop_low + pow);
				loop = (Math.pow(loop_height,2) - Math.pow(loop_low,2));
				isBreak = false;
				i = 0;
				while(i < loop)
				{
					if((k % (loop_height - 1)) == 0)
					{
						num++;
						if((num % 3) == 0)
						{
							dir = -(dir);
						}
					}
					(((num % 2)) == 0)?px = (px + dir):py = (py + dir);
					key = ((px + "|") + py);
					tile = dic.getItem(key);
					if(((((tile) && (!((tile.type == 0))))) && (!((tile.type == type)))))
					{
						dirx = com.coder.utils.geom.LinearUtils.getCharDir(index_x,index_y,px,py);
						ok = false;
						if(((!(com.coder.core.displays.world.Scene.scene.mainChar.isLoopMove)) && (!((com.coder.core.displays.world.Scene.scene.mapData.map_id == 10291)))))
						{
							ok = true;
						}
						currDir = com.coder.utils.geom.LinearUtils.getCharDir(com.coder.core.displays.world.Scene.scene.mainChar.x_com_coder_core_displays_world_char_MainChar,com.coder.core.displays.world.Scene.scene.mainChar.y_com_coder_core_displays_world_char_Char,com.coder.core.displays.world.Scene.scene["mouseX"],com.coder.core.displays.world.Scene.scene["mouseY"]);
						if(!com.coder.core.terrain.astar.TileAstar.newStartPt)
						{
							array.push({tile:tile,dis:egret.Point["distance" + ""](tile.pt,indexPt)});
						}
						else
						{
							if(tile.pt.toString() != com.coder.core.terrain.astar.TileAstar.newStartPt.toString())
							{
								if(((com.coder.core.terrain.astar.TileAstar.findFaceTile(currDir,dirx)) || (ok)))
								{
									array.push({tile:tile,dir:dirx,dis:egret.Point["distance" + ""](tile.pt,indexPt)});
									isBreak = true;
								}
							}
						}
					}
					k++;
					i++;
				}
				if(isBreak)
				{
					if(array.length)
					{
						flash.sortOn(array,["dis","dir"],[16,16]);
						return array[0].tile.pt;
					}
					return null;
				}
				n++;
				loop_low = (loop_low + pow);
			}
			return null;
		}

		public static findFaceTile(faceDir:number, averDir:number):boolean {
			var array:Array<number> = [(faceDir - 1), faceDir, (faceDir + 1)];
			var v:number = 0;
			var i:number = 0;
			while(i < array.length) {
				v = array[i];
				if(v < 0) {
					array[i] = (8 - v);
				}
				i++;
			}
			if(array.indexOf(averDir) == -1) {
				return false;
			}
			return true;
		}

		public static cleanPath(array:Array<any>):Array<any>
		{
			var i:number = 0;
			var prev_p:egret.Point = null;
			var curr_p:egret.Point = null;
			var next_p:egret.Point = null;
			var k1:number = 0;
			var k2:number = 0;
			if(array.length > 2)
			{
				i = 1;
				while(i < (array.length - 1))
				{
					prev_p = array[(i - 1)];
					curr_p = array[i];
					next_p = array[(i + 1)];
					k1 = ((prev_p.y - curr_p.y) / (prev_p.x - curr_p.x));
					k2 = ((curr_p.y - next_p.y) / (curr_p.x - next_p.x));
					if(k1 == k2)
					{
						array.splice(i,1);
						i--;
					}
					i++;
				}
			}
			return array;
		}

		public getPath(source:Map, start_x:number, start_y:number, end_x:number, end_y:number, isFineNear:boolean = true, breakSetp:number = 10000):Array<any> {
			var square1:Tile = null;
			var square2:Tile = null;
			var p_start:egret.Point = new egret.Point(start_x, start_y);
			var p_end:egret.Point = new egret.Point(end_x, end_y);
			var key_start:string = start_x + "|" + start_y;
			var key_end:string = end_x + "|" + end_y;
			if(source.has(key_start)) {
				square1 = source.get(key_start);
				square2 = source.get(key_end);
			}
			var t:number = egret.getTimer();
			this.reSet();
			this.startPoint = this.loopCheck(source, p_start, 8);
			TileAstar.newStartPt = p_start;
			this.endPoint = this.loopCheck(source, p_end, 8);

			if(this.endPoint == null || p_start == null) {
				return [];
			}

			this.source = source;
			this.nonce = new com.coder.core.terrain.astar.TileAstarData(0,0,this.startPoint);
			this.nonce.parent = this.nonce;
			this.colsePath.setItem(this.nonce.key,this.nonce);
			while(this.isFinish)
			{
				this.getScale9Grid(source,this.nonce,this.endPoint.clone(),breakSetp);
			}
			var array:Array<any> = this.cleanArray();
			return array;
		}

		public stop()
		{
			this.isFinish = false;
		}

		private loopCheck(source:Map, indexPt:egret.Point, level:number):egret.Point {
			var type:number = (this.mode == 1) ? 2 : 1;
			var key_pt:string = indexPt.x + "|" + indexPt.y;
			if((source.has(key_pt) == false) || (source.get(key_pt).type == 0) || (source.get(key_pt).type == type)) {
				TileAstar.keyIndex = indexPt;
				var point:egret.Point = TileAstar.loopRect(indexPt.x, indexPt.y, level, source, type, indexPt);
				if(point == null) {
					this.isFinish = false;
				}
				return point;
			}
			return indexPt;
		}

		private getDis(point:egret.Point, endPoint:egret.Point):number {
			var dix:number = endPoint.x - point.x;
			if (dix < 0) {
				dix = -dix;
			}
			var diy:number = endPoint.y - point.y;
			if (diy < 0) {
				diy = -diy;
			}
			return dix + diy;
		}

		private pass(square:com.coder.core.terrain.tile.Tile):boolean
		{
			return square.type > 0?true:false;
		}

		private stratght(tar:com.coder.core.terrain.tile.Tile,endPt:egret.Point,type:string)
		{
			var key:string = null;
			var pt:egret.Point = null;
			var x:number = 0;
			var y:number = 0;
			var dix:number = 0;
			var diy:number = 0;
			var costH:number = 0;
			var costG:number = 0;
			var costF:number = 0;
			var data:com.coder.core.terrain.astar.TileAstarData = null;
			var openNode:com.coder.core.terrain.astar.TileAstarData = null;
			var closeNode:com.coder.core.terrain.astar.TileAstarData = null;
			if(tar != null)
			{
				if(this.pass(tar))
				{
					key = tar.key;
					pt = tar.pt;
					x = tar.x;
					y = tar.y;
					dix = Math.abs((endPt.x - x));
					diy = Math.abs((endPt.y - y));
					costH = ((dix + diy) * 10);
					costG = (10 + this.G);
					costF = (costG + costH);
					data = new com.coder.core.terrain.astar.TileAstarData(costG,costF,pt);
					openNode = this.openPath.getItem(key);
					closeNode = this.colsePath.getItem(key);
					if((((openNode == null)) && ((closeNode == null))))
					{
						this.openPath.setItem(key,data);
						this.openArray.push(data);
					}
					else
					{
						if(openNode != null)
							{}
					}
				}
				else
				{
					if(type == "tc")
					{
						this.canTC = false;
					}
					else
					{
						if(type == "cl")
						{
							this.canCL = false;
						}
						else
						{
							if(type == "cr")
							{
								this.canCR = false;
							}
							else
							{
								if(type == "bc")
								{
									this.canBC = false;
								}
							}
						}
					}
				}
			}
			else
			{
				if(type == "tc")
				{
					this.canTC = false;
				}
				else
				{
					if(type == "cl")
					{
						this.canCL = false;
					}
					else
					{
						if(type == "cr")
						{
							this.canCR = false;
						}
						else
						{
							if(type == "bc")
							{
								this.canBC = false;
							}
						}
					}
				}
			}
		}

		private diagonal(tar:com.coder.core.terrain.tile.Tile,endPt:egret.Point,can:boolean)
		{
			var key:string = null;
			var pt:egret.Point = null;
			var dix:number = 0;
			var diy:number = 0;
			var costH:number = 0;
			var costG:number = 0;
			var data:com.coder.core.terrain.astar.TileAstarData = null;
			var openNode:com.coder.core.terrain.astar.TileAstarData = null;
			var closeNode:com.coder.core.terrain.astar.TileAstarData = null;
			if(((can) && (!((tar == null)))))
			{
				if(this.pass(tar))
				{
					key = tar.key;
					pt = tar.pt;
					dix = Math.abs((endPt.x - tar.x));
					diy = Math.abs((this.endPoint.y - tar.y));
					costH = ((dix + diy) * 10);
					costG = (14 + this.G);
					data = new com.coder.core.terrain.astar.TileAstarData(costG,(costG + costH),pt);
					openNode = this.openPath.getItem(key);
					closeNode = this.colsePath.getItem(key);
					if((((openNode == null)) && ((closeNode == null))))
					{
						this.openPath.setItem(key,data);
						this.openArray.push(data);
					}
					else
					{
						if(openNode != null)
							{}
					}
				}
			}
		}

		private getScale9Grid(source:flash.Dictionary,data:com.coder.core.terrain.astar.TileAstarData,endPoint:egret.Point,breakSetp:number)
		{
			var tad:com.coder.core.terrain.astar.TileAstarData = null;
			var i:number = 0;
			var td:com.coder.core.terrain.astar.TileAstarData = null;
			this.canBL = true;
			this.canBR = true;
			this.canTL = true;
			this.canTR = true;
			this.canTC = true;
			this.canCR = true;
			this.canCL = true;
			this.canBC = true;
			var pt:egret.Point = data.pt;
			var x:number = pt.x;
			var y:number = pt.y;
			var x1:number = (x + 1);
			var y1:number = (y + 1);
			var x2:number = (x - 1);
			var y2:number = (y - 1);
			var tl:com.coder.core.terrain.tile.Tile = source.getItem(((x2 + "|") + y2));
			var tr:com.coder.core.terrain.tile.Tile = source.getItem(((x1 + "|") + y2));
			var bl:com.coder.core.terrain.tile.Tile = source.getItem(((x2 + "|") + y1));
			var br:com.coder.core.terrain.tile.Tile = source.getItem(((x1 + "|") + y1));
			var tc:com.coder.core.terrain.tile.Tile = source.getItem(((x + "|") + y2));
			var cl:com.coder.core.terrain.tile.Tile = source.getItem(((x2 + "|") + y));
			var cr:com.coder.core.terrain.tile.Tile = source.getItem(((x1 + "|") + y));
			var bc:com.coder.core.terrain.tile.Tile = source.getItem(((x + "|") + y1));
			if(tc)
			{
				this.stratght(tc,endPoint,"tc");
			}
			if(cl)
			{
				this.stratght(cl,endPoint,"cl");
			}
			if(cr)
			{
				this.stratght(cr,endPoint,"cr");
			}
			if(bc)
			{
				this.stratght(bc,endPoint,"bc");
			}
			if(tl)
			{
				this.diagonal(tl,endPoint,this.canTL);
			}
			if(tr)
			{
				this.diagonal(tr,endPoint,this.canTR);
			}
			if(bl)
			{
				this.diagonal(bl,endPoint,this.canBL);
			}
			if(br)
			{
				this.diagonal(br,endPoint,this.canBR);
			}
			var len:number = this.openArray.length;
			if((((len == 0)) || ((((((((((((((((tc == null)) && ((cl == null)))) && ((cr == null)))) && ((bc == null)))) && ((tl == null)))) && ((tr == null)))) && ((bl == null)))) && ((br == null))))))
			{
				this.isFinish = false;
				return ;
			}
			var index:number = 0;
			i = 0;
			while(i < len)
			{
				td = this.openArray[i];
				if(i == 0)
				{
					tad = td;
				}
				else
				{
					if(td.F < tad.F)
					{
						tad = td;
						index = i;
					}
				}
				i++;
			}
			this.nonce = tad;
			this.openArray.splice(index,1);
			var key:string = this.nonce.key;
			if(this.colsePath.getItem(key) == null)
			{
				this.colsePath.setItem(key,this.nonce);
				this.closeLength = (this.closeLength + 1);
				if(this.closeLength > breakSetp)
				{
					this.isFinish = false;
				}
			}
			var key_end:string = ((endPoint.x + "|") + endPoint.y);
			if(this.nonce.key == key_end)
			{
				this.isFinish = false;
			}
			this.G = this.nonce.G;
		}

		public pathCutter(array:Array<any>,size:number = 2):Array<any>
		{
			var tmp:Array<any> = null;
			var i:number = 0;
			var j:number = 0;
			var arr:Array<any> = [];
			i = 0;
			while(i < array.length)
			{
				if((i % size) == 0)
				{
					tmp = [];
					if(arr.length > 0)
					{
						tmp.push(array[(i - 1)]);
					}
					arr.push(tmp);
				}
				tmp.push(array[i]);
				i++;
			}
			j = 0;
			while(j < arr.length)
			{
				arr[j] = com.coder.core.terrain.astar.TileAstar.cleanPath(arr[j]);
				j++;
			}
			return arr;
		}

		private cleanArray():Array<any>
		{
			var min:number = 0;
			var pt:egret.Point = null;
			var dix:number = 0;
			var diy:number = 0;
			var dis:number = 0;
			var run:boolean;
			var breakStep:number = 0;
			this.pathArray = [];
			var key:string = ((this.endPoint.x + "|") + this.endPoint.y);
			if(this.colsePath.getItem(key) == null)
			{
				min = -1;
				for(var o_key_a in this.colsePath.map)
				{
					var o:com.coder.core.terrain.astar.TileAstarData = this.colsePath.map[o_key_a][1];
					if(o.pt)
					{
						pt = o.pt;
						dix = (this.endPoint.x - pt.x);
						((dix) < 0)?dix = -(dix):dix;
						diy = (this.endPoint.y - pt.y);
						((diy) < 0)?diy = -(diy):diy;
						dis = (dix + diy);
						if(min == -1)
						{
							min = dis;
							key = ((pt.x + "|") + pt.y);
						}
						else
						{
							if(dis < min)
							{
								min = dis;
								key = ((pt.x + "|") + pt.y);
							}
						}
					}
				}
				if(this.colsePath.getItem(key) == null)
				{
					this.pathArray;
				}
			}
			var co:com.coder.core.terrain.astar.TileAstarData = this.colsePath.getItem(key);
			if(co != null)
			{
				this.pathArray.unshift(com.coder.core.terrain.tile.TileUtils.tileToPixels(co.pt));
				this.pathArray.unshift(com.coder.core.terrain.tile.TileUtils.tileToPixels(co.parent.pt));
				run = true;
				breakStep = 0;
				while(run)
				{
					key = this.colsePath.getItem(key).parent.key;
					if((((key == ((this.startPoint.x + "|") + this.startPoint.y))) || ((breakStep > 10000))))
					{
						run = false;
						break;
					}
					this.pathArray.unshift(com.coder.core.terrain.tile.TileUtils.tileToPixels(this.colsePath.getItem(key).parent.pt));
					breakStep++;
				}
			}
			return this.pathArray;
		}

		private reSet()
		{
			this.pathArray = [];
			this.source = new flash.Dictionary();
			this.colsePath = new flash.Dictionary();
			this.colseArray = [];
			this.openPath = new flash.Dictionary();
			this.openArray = [];
			this.G = 0;
			this.nonce = null;
			this.canTL = true;
			this.canTR = true;
			this.canBL = true;
			this.canBR = true;
			this.isFinish = true;
			this.closeLength = 0;
		}

		public get endPoint():egret.Point
		{
			return this._endPoint;
		}

		public set endPoint(value:egret.Point)
		{
			this._endPoint = value;
		}

	}
}
