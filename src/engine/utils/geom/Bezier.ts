module com {
	export module coder {
		export module utils {
			export module geom {
				export class Bezier extends egret.HashObject {


					public constructor()
					{
						super();
					}

					public static drawBezier3(p1:egret.Point,p2:egret.Point,c1:egret.Point,c2:egret.Point,num:number = 10):Array<any>
					{
						var t:number = 0;
						var rt:number = 0;
						var pos_x:number = 0;
						var pos_y:number = 0;
						var delta:number = 1 / num;
						var result:Array<any> = [];
						while(t <= 1)
						{
							rt = 1 - t;
							pos_x = Math.pow(rt,3) * p1.x + 3 * c1.x * t * Math.pow(rt,2) + 3 * c2.x * Math.pow(t,2) * rt + p2.x * Math.pow(t,3);
							pos_y = Math.pow(rt,3) * p1.y + 3 * c1.y * t * Math.pow(rt,2) + 3 * c2.y * Math.pow(t,2) * rt + p2.y * Math.pow(t,3);
							result.push(new egret.Point(pos_x,pos_y));
							t = t + delta;
						}
						return result;
					}

					public static drawBezier(p1:egret.Point,p2:egret.Point,c:egret.Point,num:number = 40):Array<any>
					{
						var pos_x:number = 0;
						var pos_y:number = 0;
						var delta:number = 1 / num;
						var t:number = 0;
						var path:Array<any> = [];
						while(t <= 1)
						{
							pos_x = Math.pow((1 - t),2) * p1.x + 2 * t * (1 - t) * c.x + Math.pow(t,2) * p2.x;
							pos_y = Math.pow((1 - t),2) * p1.y + 2 * t * (1 - t) * c.y + Math.pow(t,2) * p2.y;
							path.push(new egret.Point(pos_x,pos_y));
							t = (t + delta);
						}
						return path;
					}

				}
			}
		}
	}
}

