module engine {
	export class LinearUtils {

		public static _radian_:number = 180 / Math.PI;
		public static _angle_:number = Math.PI / 180;

		//public static lineAttck(startPoint:egret.Point, endPoint:egret.Point, interval:number = 80):Array<any> {
		//	if(!startPoint || !endPoint) {
		//		return [];
		//	}
		//	var result:Array<any> = [];
		//	var distance:number = egret.Point.distance(startPoint,endPoint);
		//	var count:number = distance / interval;
		//	var p:egret.Point = null;
		//	for(var index:number = 0;index < count; index++) {
		//		p = egret.Point.interpolate(startPoint, endPoint, 1 - (index / count));
		//		result.push(p);
		//	}
		//	return result;
		//}
        //
		//public static getReverseDir(dir:number):number {
		//	var dirs:Array<any> = [4,5,6,7,0,1,2,3];
		//	return dirs[dir];
		//}
        //
		//public static pointBetweenPoint(pt1:egret.Point,pt2:egret.Point,dis:number):egret.Point {
		//	if(!pt1 || !pt2) {
		//		return null;
		//	}
		//	var result:egret.Point = null;
		//	var distance:number = egret.Point.distance(pt1,pt2);
		//	if(dis >= distance)
		//	{
		//		result = LinearUtils.extensionPoint(pt2,pt1,dis - distance);
		//	}
		//	else
		//	{
		//		result = egret.Point.interpolate(pt1,pt2,dis / distance);
		//	}
		//	return result;
		//}
        //
		//public static extensionPoint(pt1:egret.Point,pt2:egret.Point,dis:number):egret.Point
		//{
		//	if(!pt1 || !pt2)
		//	{
		//		return null;
		//	}
		//	var distance:number = egret.Point.distance(pt1,pt2);
		//	var dx:number = pt2.x + (dis / distance) * (pt2.x - pt1.x);
		//	var dy:number = pt2.y + (dis / distance) * (pt2.y - pt1.y);
		//	return new egret.Point(dx,dy);
		//}
        //
		//public static lineSectorAttack(startPoint:egret.Point,endPoint:egret.Point,area:number,n:number = 3,minRadius:number = 200):Array<any>
		//{
		//	if(!startPoint || !endPoint)
		//	{
		//		return [];
		//	}
		//	var arr:Array<any> = LinearUtils.sectorAttack(startPoint,endPoint,area,n,minRadius);
		//	var result:Array<any> = [];
		//	for(var i:number = 0;i < arr.length; i++)
		//	{
		//		result[i] = LinearUtils.lineAttck(startPoint,arr[i]);
		//	}
		//	return result;
		//}
        //
		//public static sectorAttack(startPoint:egret.Point,endPoint:egret.Point,area:number,n:number = 3,minRadius:number = 200):Array<any>
		//{
		//	var sectorArea:number = area;
		//	if(sectorArea <= 0)
		//	{
		//		return [];
		//	}
		//	if(sectorArea > 360)
		//	{
		//		sectorArea = 360;
		//	}
		//	sectorArea = LinearUtils.angle2Radian(sectorArea);
		//	var startX:number = startPoint.x;
		//	var startY:number = startPoint.y;
		//	var distance:number = egret.Point.distance(startPoint,endPoint);
		//	var dx:number = endPoint.x - startPoint.x;
		//	var dy:number = endPoint.y - startPoint.y;
		//	var lineAngle:number = LinearUtils.radian2Angle(Math.atan2(dy,dx));
		//	lineAngle = lineAngle - area / 2;
		//	var oneRadian:number = sectorArea / n;
		//	var step:number = distance / Math.cos(oneRadian / 2);
		//	var lineRadian:number = LinearUtils.angle2Radian(lineAngle);
		//	if(minRadius != -1 && distance < minRadius)
		//	{
		//		distance = minRadius;
		//		endPoint.x = startX + Math.cos(lineRadian) * distance;
		//		endPoint.y = startY + Math.sin(lineRadian) * distance;
		//		dx = endPoint.x - startPoint.x;
		//		dy = endPoint.y - startPoint.y;
		//		lineAngle = LinearUtils.radian2Angle(Math.atan2(dy,dx));
		//		lineAngle = lineAngle - (area / 2);
		//		oneRadian = sectorArea / n;
		//		step = distance / Math.cos(oneRadian / 2);
		//		lineRadian = LinearUtils.angle2Radian(lineAngle);
		//	}
		//	var endX:number = startX + Math.cos(lineRadian) * distance;
		//	var endY:number = startY + Math.sin(lineRadian) * distance;
		//	var result:Array<any> = [];
		//	result.push(new egret.Point(endX,endY));
		//	var p:egret.Point = null;
		//	for(var i:number = 0;i < n; i++)
		//	{
		//		lineRadian = lineRadian + oneRadian;
		//		var sx:number = startX + Math.cos(lineRadian - oneRadian / 2) * step;
		//		var sy:number = startY + Math.sin(lineRadian - oneRadian / 2) * step;
		//		var tx:number = startX + Math.cos(lineRadian) * distance;
		//		var ty:number = startY + Math.sin(lineRadian) * distance;
		//		p = new egret.Point(tx,ty);
		//		result.push(p);
		//	}
		//	return result;
		//}
        //
		//public static pointIntr(a:egret.Point,b:egret.Point,c:egret.Point,d:egret.Point):egret.Point
		//{
		//	var aren_abc:number = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
		//	var area_abd:number = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
		//	if(aren_abc * area_abd >= 0)
		//	{
		//		return null;
		//	}
		//	var area_cda:number = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
		//	var area_cdb:number = area_cda + aren_abc - area_abd;
		//	if(area_cda * area_cdb >= 0)
		//	{
		//		return null;
		//	}
		//	var t:number = area_cda / (area_abd - aren_abc);
		//	var dx:number = t * (b.x - a.x);
		//	var dy:number = t * (b.y - a.y);
		//	return new egret.Point(a.x + dx,a.y + dy);
		//}
        //
		//public static dirExtensionPoint(dir:number,x:number,y:number):egret.Point
		//{
		//	var angle:number = LinearUtils.getAngle(dir);
		//	var radian:number = LinearUtils.angle2Radian(angle);
		//	var dx:number = x + Math.cos(radian);
		//	var dy:number = y + Math.sin(radian);
		//	return new egret.Point(dx,dy);
		//}
        //
		//public static getTileByDir(tileIndex:egret.Point,dir:number,size:number):egret.Point
		//{
		//	if(dir == 0 || dir == 4)
		//	{
		//		size = TileConst.TILE_HEIGHT * size;
		//	}
		//	else
		//	{
		//		if(dir == 2 || dir == 6)
		//		{
		//			size = TileConst.TILE_WIDTH * size;
		//		}
		//		else
		//		{
		//			size = TileConst.Tile_XIE * size;
		//		}
		//	}
		//	var tileP:egret.Point = new egret.Point(tileIndex.x,tileIndex.y);
		//	tileIndex = TileUtils.tileToPixels(tileIndex,tileIndex);
		//	var valueP:egret.Point = new egret.Point();
		//	if(dir == 0)
		//	{
		//		valueP.x = tileIndex.x;
		//		valueP.y = tileIndex.y - TileConst.HH;
		//	}
		//	else if(dir == 1)
		//	{
		//		TileUtils.getTileTopRightPoint(tileP,valueP);
		//	}
		//	else if(dir == 2)
		//	{
		//		valueP.x = tileIndex.x + TileConst.WH - 2;
		//		valueP.y = tileIndex.y;
		//	}
		//	else if(dir == 3)
		//	{
		//		TileUtils.getTileBottomRightPoint(tileP,valueP);
		//	}
		//	else if(dir == 4)
		//	{
		//		valueP.x = tileIndex.x;
		//		valueP.y = tileIndex.y + TileConst.HH - 2;
		//	}
		//	else if(dir == 5)
		//	{
		//		TileUtils.getTileBottomLeftPoint(tileP,valueP);
		//	}
		//	else if(dir == 6)
		//	{
		//		valueP.x = tileIndex.x - TileConst.WH;
		//		valueP.y = tileIndex.y;
		//	}
		//	else if(dir == 7)
		//	{
		//		TileUtils.getTileTopLeftPoint(tileP,valueP);
		//	}
		//	var result:egret.Point = LinearUtils.extensionPoint(tileIndex,valueP,size);
		//	TileUtils.pixelsAlginTile(result.x,result.y,result);
		//	return result;
		//}
        //
		//public static getAngle(dir:number):number {
		//	switch(dir) {
		//		case 0 :
		//			return -90;
		//			break;
		//		case 1 :
		//			return -45;
		//			break;
		//		case 2 :
		//			return 0;
		//			break;
		//		case 3 :
		//			return 45;
		//			break;
		//		case 4 :
		//			return 90;
		//			break;
		//		case 5 :
		//			return 135;
		//			break;
		//		case 6 :
		//			return -175;
		//			break;
		//		case 7 :
		//			return -135;
		//			break;
		//	}
		//	return 0;
		//}
        //
		//public static getAnglebyDir(tileIndex:egret.Point, dir:number):number
		//{
		//	var tileP:egret.Point = new egret.Point(tileIndex.x,tileIndex.y);
		//	tileIndex = TileUtils.tileToPixels(tileIndex, tileIndex);
		//	var valueP:egret.Point = new egret.Point();
		//	if(dir == 0)
		//	{
		//		valueP.x = tileIndex.x;
		//		valueP.y = tileIndex.y - TileConst.HH;
		//	}
		//	else if(dir == 1)
		//	{
		//		TileUtils.getTileTopRightPoint(tileP,valueP);
		//	}
		//	else if(dir == 2)
		//	{
		//		valueP.x = tileIndex.x + TileConst.WH - 2;
		//		valueP.y = tileIndex.y;
		//	}
		//	else if(dir == 3)
		//	{
		//		TileUtils.getTileBottomRightPoint(tileP,valueP);
		//	}
		//	else if(dir == 4)
		//	{
		//		valueP.x = tileIndex.x;
		//		valueP.y = tileIndex.y + TileConst.HH - 2;
		//	}
		//	else if(dir == 5)
		//	{
		//		TileUtils.getTileBottomLeftPoint(tileP,valueP);
		//	}
		//	else if(dir == 6)
		//	{
		//		valueP.x = tileIndex.x - TileConst.WH;
		//		valueP.y = tileIndex.y;
		//	}
		//	else if(dir == 7)
		//	{
		//		TileUtils.getTileTopLeftPoint(tileP,valueP);
		//	}
		//	var minP:egret.Point = TileUtils.getTileMidVertex(tileP);
		//	var dx:number = minP.x - valueP.x;
		//	var dy:number = minP.y - valueP.y;
		//	var result:number = LinearUtils.radian2Angle(Math.atan2(dy,dx));
		//	return result;
		//}

		public static getDirection(curr_x:number, curr_y:number, tar_x:number, tar_y:number):number {
			var angle:number = LinearUtils.getAngle(curr_x, curr_y, tar_x, tar_y);
			var dir:number = 0;
			if(angle >= -22 && angle < 22) {
				dir = DirConst.RIGHT;
			}
			else if(angle >= 22 && angle < 67) {
				dir = DirConst.BOTTOM_RIGHT;
			}
			else if(angle >= 67 && angle < 112) {
				dir = DirConst.BOTTOM;
			}
			else if(angle >= 112 && angle < 157) {
				dir = DirConst.BOTTOM_LEFT;
			}
			else if(angle >= 157 || angle < -157) {
				dir = DirConst.LEFT;
			}
			else if(angle >= -157 && angle < -112) {
				dir = DirConst.TOP_LEFT;
			}
			else if(angle >= -112 && angle < -67) {
				dir = DirConst.TOP;;
			}
			else if(angle >= -67 && angle < -22) {
				dir = DirConst.TOP_RIGHT;
			}
			return dir;
		}

		public static getCharDir(x:number, y:number, tar_x:number, tar_y:number):number {
			return LinearUtils.getDirection(x, y, tar_x, tar_y);
		}

		public static angle2Radian(angle:number):number {
			return angle * LinearUtils._angle_;
		}

		public static radian2Angle(radian:number):number {
			return radian * LinearUtils._radian_;
		}

		public static getAngle(cur_x:number, cur_y:number, tar_x:number, tar_y:number):number {
			var dx:number = tar_x - cur_x;
			var dy:number = tar_y - cur_y;
			var radian:number = Math.atan2(dy, dx);
			return LinearUtils.radian2Angle(radian);
		}

		public static getRadian(cur_x:number, cur_y:number, tar_x:number, tar_y:number):number {
			var dx:number = tar_x - cur_x;
			var dy:number = tar_y - cur_y;
			var radian:number = Math.atan2(dy, dx);
			return radian;
		}

	}
}

