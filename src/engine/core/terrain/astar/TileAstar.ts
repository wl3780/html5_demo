module engine {
	export class TileAstar extends egret.HashObject {

		/** 直线消耗值 */
		public static COST_STRAIGHT:number = 10;
		/** 对角线消耗值 */
		public static COST_DIAGONAL:number = 14;

		public mode:number = 1;

		private nonce:TileAstarData;
		private startPoint:egret.Point;
		private endPoint:egret.Point;
		private closePath:Map<string, TileAstarData> = new Map<string, TileAstarData>();
		private openPath:Map<string, TileAstarData> = new Map<string, TileAstarData>();
		private closeArray:Array<TileAstarData> = [];
		private openArray:Array<TileAstarData> = [];

		private end_key:string;
		private start_key:string;

		private isFinish:boolean = false;
		private G:number = 0;
		private closeLength:number = 0;

		private static loopRect(source:Map<string, Tile>, indexPt:egret.Point, loopNum:number, type:number):egret.Point {
			var mainDir:number = LinearUtils.getDirection(Scene.scene.mainChar.x, Scene.scene.mainChar.y, Scene.scene.mouseDownPoint.x, Scene.scene.mouseDownPoint.y);
			var list:Array<any> = [];

			var index_x:number = indexPt.x;
			var index_y:number = indexPt.y;
			var px:number = 0;
			var py:number = 0;
			var idx:number = 0;
			while (idx < loopNum) {
				var start_idx:number = -idx;
				var end_idx:number = idx;
				while (start_idx <= end_idx) {
					// 上行
					px = index_x + start_idx;
					py = index_y - idx;
					this.fillFaceTile(list, px, py, source, indexPt, type, mainDir);
					//　下行
					px = index_x + start_idx;
					py = index_y + idx;
					this.fillFaceTile(list, px, py, source, indexPt, type, mainDir);
					// 左列
					px = index_x - idx;
					py = index_y + start_idx;
					this.fillFaceTile(list, px, py, source, indexPt, type, mainDir);
					// 右列
					px = index_x + idx;
					py = index_y + start_idx;
					this.fillFaceTile(list, px, py, source, indexPt, type, mainDir);

					start_idx++;
				}

				if (list.length) {
					break;
				}
				idx++;
			}
			if (list.length) {
				list.sort((a, b) => {
					if (a.dis < b.dis) {
						return -1;
					} else if (a.dis == b.dis) {
						return a.dir - b.dir;
					}
					return 1;
				});
				return list[0].tile.pt;
			}
			return null;
		}

		private static fillFaceTile(list:Array<any>, px:number, py:number, source:Map<string, Tile>, indexPt:egret.Point, type:number, mainDir:number) {
			var key:string = px + "|" + py;
			var tile:Tile = source.get(key);
			if (tile && tile.type != 0 && tile.type != type) {
				var dirx:number = LinearUtils.getDirection(px, py, indexPt.x, indexPt.y);
				if (TileAstar.findFaceTile(mainDir, dirx)) {
					list.push({tile:tile,dir:dirx,dis:egret.Point.distance(tile.pt,indexPt)});
				}
			}
		}

		public static findFaceTile(faceDir:number, averDir:number):boolean {
			var array:Array<number> = [(faceDir - 1), faceDir, (faceDir + 1)];
			var v:number = 0;
			var i:number = 0;
			while(i < array.length) {
				v = array[i];
				if(v < 0) {
					array[i] = 8 + v;
				}
				i++;
			}
			if(array.indexOf(averDir) == -1) {
				return false;
			} else {
				return true;
			}
		}

		public static pathCutter(array:Array<egret.Point>, size:number = 2):Array<any> {
			var tmp:Array<egret.Point> = null;
			var arr:Array<Array<egret.Point>> = [];
			var i:number = 0;
			while(i < array.length) {
				if((i % size) == 0) {
					tmp = [];
					if(arr.length > 0) {
						tmp.push(array[(i - 1)]);
					}
					arr.push(tmp);
				}
				tmp.push(array[i]);
				i++;
			}
			var j:number = 0;
			while(j < arr.length) {
				arr[j] = TileAstar.cleanPath(arr[j]);
				j++;
			}
			return arr;
		}

		public static cleanPath(array:Array<egret.Point>):Array<egret.Point> {
			if(array.length > 2) {
				var prev_p:egret.Point = null;
				var curr_p:egret.Point = null;
				var next_p:egret.Point = null;
				var k1:number = 0;
				var k2:number = 0;
				var i:number = 1;
				while(i < (array.length - 1)) {
					prev_p = array[(i - 1)];
					curr_p = array[i];
					next_p = array[(i + 1)];
					k1 = ((prev_p.y - curr_p.y) / (prev_p.x - curr_p.x));
					k2 = ((curr_p.y - next_p.y) / (curr_p.x - next_p.x));
					if(k1 == k2) {
						array.splice(i, 1);
						i--;
					}
					i++;
				}
			}
			return array;
		}

		public getPath(source:Map<string, Tile>, start_x:number, start_y:number, end_x:number, end_y:number, isFineNear:boolean = true, breakStep:number = 10000):Array<any> {
			var t:number = egret.getTimer();
			this.reSet();

			var p_start:egret.Point = new egret.Point(start_x, start_y);
			var p_end:egret.Point = new egret.Point(end_x, end_y);
			this.startPoint = this.loopCheck(source, p_start, 8);
			this.endPoint = this.loopCheck(source, p_end, 8);

			if(this.endPoint == null || this.startPoint == null) {
				return [];
			}
			this.end_key = this.endPoint.x + "|" + this.endPoint.y;
			this.start_key = this.startPoint.x + "|" + this.startPoint.y;

			this.nonce = TileAstarData.create(0, 0, this.startPoint);
			this.nonce.parent = this.nonce;
			this.closePath.set(this.nonce.key, this.nonce);
			while(this.isFinish) {
				this.getScale9Grid(source, this.nonce, this.endPoint, breakStep);
			}
			var array:Array<egret.Point> = this.cleanArray();
            console.log("*****************寻路时间：", (egret.getTimer() - t), "路径长: ", array.length, "*******************", "\n\n");
			return array;
		}

		public stop() {
			this.isFinish = false;
		}

		private loopCheck(source:Map<string, Tile>, indexPt:egret.Point, level:number):egret.Point {
			var type:number = (this.mode == 1) ? 2 : 1;
			var key_pt:string = indexPt.x + "|" + indexPt.y;
			if((source.has(key_pt) == false) || (source.get(key_pt).type == 0) || (source.get(key_pt).type == type)) {
				var point:egret.Point = TileAstar.loopRect(source, indexPt, level, type);
				if(point == null) {
					this.isFinish = false;
				}
				return point;
			}
			return indexPt;
		}

		private static getDis(point:egret.Point, endPoint:egret.Point):number {
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

		private static pass(tile:Tile):boolean {
			return tile.type > 0;
		}
		/**
		 * 直线
		 */
		private stratght(tar:Tile, endPt:egret.Point) {
			if(tar != null) {
				if (TileAstar.pass(tar)) {
					var key:string = tar.key;
					var pt:egret.Point = tar.pt;
					var costH:number = TileAstar.getDis(pt, endPt) * TileAstar.COST_STRAIGHT;
					var costG:number = TileAstar.COST_STRAIGHT + this.G;
					var costF:number = costG + costH;
					var data:TileAstarData = TileAstarData.create(costG, costF, pt);
					data.parent = this.nonce;

					var openNode:TileAstarData = this.openPath.get(key);
					var closeNode:TileAstarData = this.closePath.get(key);
					if (openNode == null && closeNode == null) {
						this.openPath.set(key, data);
						this.openArray.push(data);
					} else if (openNode != null) {
						if (data.F < openNode.F) {
							this.openPath.set(key, data);
						}
					}
				}
			}
		}

		/**
		 * 对角线
		 */
		private diagonal(tar:Tile, endPt:egret.Point) {
			if(tar != null) {
				if(TileAstar.pass(tar)) {
					var key:string = tar.key;
					var pt:egret.Point = tar.pt;
					var costH:number = TileAstar.getDis(pt, endPt) * TileAstar.COST_STRAIGHT;
					var costG:number = TileAstar.COST_DIAGONAL + this.G;
					var costF:number = costH + costG;
					var data:TileAstarData = TileAstarData.create(costG, costF, pt);
					data.parent = this.nonce;

					var openNode:TileAstarData = this.openPath.get(key);
					var closeNode:TileAstarData = this.closePath.get(key);
					if(openNode == null && closeNode == null) {
						this.openPath.set(key, data);
						this.openArray.push(data);
					} else if(openNode != null) {
						if (data.F < openNode.F) {
							this.openPath.set(key, data);
						}
					}
				}
			}
		}

		private getScale9Grid(source:Map<string, Tile>, data:TileAstarData, endPoint:egret.Point, breakSetp:number) {
			var pt:egret.Point = data.pt;
			var x:number = pt.x;
			var y:number = pt.y;
			var x1:number = x + 1;
			var y1:number = y + 1;
			var x2:number = x - 1;
			var y2:number = y - 1;
			var tl:Tile = source.get(x2 + "|" + y2);	// 左上
			var tr:Tile = source.get(x1 + "|" + y2);	// 右上
			var bl:Tile = source.get(x2 + "|" + y1);	// 左下
			var br:Tile = source.get(x1 + "|" + y1);	// 右下
			var tc:Tile = source.get(x + "|" + y2);	// 上
			var cl:Tile = source.get(x2 + "|" + y);	// 左
			var cr:Tile = source.get(x1 + "|" + y);	// 右
			var bc:Tile = source.get(x + "|" + y1);	// 下
			if(tc) {
				this.stratght(tc, endPoint);
			}
			if(cl) {
				this.stratght(cl, endPoint);
			}
			if(cr) {
				this.stratght(cr, endPoint);
			}
			if(bc) {
				this.stratght(bc, endPoint);
			}
			if(tl) {
				this.diagonal(tl, endPoint);
			}
			if(tr) {
				this.diagonal(tr, endPoint);
			}
			if(bl) {
				this.diagonal(bl, endPoint);
			}
			if(br) {
				this.diagonal(br, endPoint);
			}
			var len:number = this.openArray.length;
			if(len == 0)  {
				this.isFinish = false;
				return ;
			}

			var tad:TileAstarData = null;
			var td:TileAstarData = null;
			var index:number = 0;
			var i:number = 0;
			while(i < len) {
				td = this.openArray[i];
				if(i == 0) {
					tad = td;
				} else {
					if(td.F < tad.F) {
						tad = td;
						index = i;
					}
				}
				i++;
			}
			this.nonce = tad;
			this.openArray.splice(index,1);
			var key:string = this.nonce.key;
			if(this.closePath.has(key) == false) {
				this.closePath.set(key, this.nonce);
				this.closeLength++;
				if(this.closeLength > breakSetp) {
					this.isFinish = false;
				}
			}
			if(this.nonce.key == this.end_key) {
				this.isFinish = false;
			}
			this.G = this.nonce.G;
		}

		private cleanArray():Array<egret.Point> {
			var pathArray:Array<egret.Point> = [];
			var key:string = this.end_key;
			if(this.closePath.has(key) == false) {	// 寻找距离终点最近的点
				var dis:number = 0;
				var min:number = -1;
				this.closePath.forEach(item => {
					dis = TileAstar.getDis(item.pt, this.endPoint);
					if (min == -1 || dis < min) {
						min = dis;
						key = item.key;
					}
				});
			}
			var co:TileAstarData = this.closePath.get(key);
			if(co != null) {
				pathArray.unshift(TileUtils.tileToPixels(co.pt));
				pathArray.unshift(TileUtils.tileToPixels(co.parent.pt));
				var breakStep:number = 0;
				while(true) {
					key = this.closePath.get(key).parent.key;
					if(key == this.start_key || breakStep > 10000) {
						break;
					}
					pathArray.unshift(TileUtils.tileToPixels(this.closePath.get(key).parent.pt));
					breakStep++;
				}
			}
			return pathArray;
		}

		private reSet() {
			this.closeArray.forEach(c => {
				c.dispose();
			});
			this.closeArray.length = 0;
			this.closePath.clear();

			this.openArray.forEach(o => {
				o.dispose();
			});
			this.openArray.length = 0;
			this.openPath.clear();
			this.G = 0;
			this.nonce = null;
			this.isFinish = true;
			this.closeLength = 0;
		}

	}
}
