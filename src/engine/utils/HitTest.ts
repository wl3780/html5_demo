module com {
	export module coder {
		export module utils {
			export class HitTest extends egret.HashObject {

				public static pixel:flash.BitmapData;
				public static pixelRect:egret.Rectangle;
				public static colorTransform:egret.ColorTransform;
				public static matrix:flash.Matrix;
				public static bitmapData:flash.BitmapData;
				private static replacColor(bmd:flash.BitmapData,replaceColor:number):flash.BitmapData
				{
					var clone:flash.BitmapData = new flash.BitmapData(bmd.width,bmd.height);
					var threshold:number = 0x22000000;
					replaceColor = 0xFFFF0000;
					clone["threshold" + ""](bmd,bmd.rect,com.coder.utils.RecoverUtils.point,">=",threshold,replaceColor,4294967295,true);
					return clone;
				}

				public static getChildUnderPoint(parent:egret.DisplayObjectContainer,point:egret.Point,items:Array<any> = null,unHits:Array<any> = null,className:any = null,alpha:number = 10):egret.DisplayObject
				{
					var result:egret.DisplayObject = null;
					var child:any;
					var boundsRect:egret.Rectangle = null;
					var tmpData:flash.BitmapData = null;
					var hitRect:egret.Rectangle = null;
					var tmpAlpha:number = 0;
					if(items)
					{
						flash.sortOn(items,["type","y"],[flash.AS3Array.DESCENDING,flash.AS3Array.NUMERIC]);
					}
					if(className == null)
					{
						className = egret.DisplayObject;
					}
					if(unHits == null)
					{
						unHits = [];
					}
					for(var i:number = items.length - 1;i >= 0; i--)
					{
						child = items[i];
						if(flash.As3is(child,className) && child.type != null)
						{
							boundsRect = items[i].getBounds(parent);
							hitRect = (<com.coder.core.displays.world.char.Char>(child)).hitTestArea.clone();
							hitRect.x = hitRect.x + child.x;
							hitRect.y = hitRect.y + child.y;
							if(unHits.indexOf(child) == -1 && child.type != "effect" && (<com.coder.core.displays.world.char.Char>(child)).isDeath == false && (<com.coder.core.displays.world.char.Char>(child)).stage)
							{
								tmpData = com.coder.utils.HitTest.bitmapData;
								tmpData["setPixel32" + ""](0,0,0);
								com.coder.utils.HitTest.matrix.tx = -child.mouseX;
								com.coder.utils.HitTest.matrix.ty = -child.mouseY;
								tmpData["draw" + ""](child,com.coder.utils.HitTest.matrix,null,null,com.coder.utils.HitTest.pixelRect);
								tmpAlpha = (tmpData["getPixel32" + ""](0,0) >> 24) & 0xFF;
								if(boundsRect.containsPoint(point))
								{
									if(tmpAlpha >= alpha)
									{
										result = child;
										break;
									}
									if(hitRect.containsPoint(point) && tmpAlpha >= 0)
									{
										result = child;
										break;
									}
								}
							}
						}
					}
					return result;
				}

				public static getChildUnderPointWithDifferentLayer(parent:egret.DisplayObjectContainer,point:egret.Point,items:Array<any> = null,className:any = null):egret.DisplayObject
				{
					if(items == null)
					{
						return null;
					}
					if(className == null)
					{
						className = egret.DisplayObject;
					}
					var result:egret.DisplayObject = null;
					var child:egret.DisplayObject = null;
					var infos:Array<any> = [];
					for(var i:number = 0;i < items.length; i++)
					{
						child = items[i];
						if(flash.As3is(child,className))
						{
							var pIndex:number = child.parent.parent.getChildIndex(child.parent) * 1000000;
							infos.push({target:child,depth:pIndex + child.y});
						}
					}
					flash.sortOn(infos,"depth",(flash.AS3Array.NUMERIC | flash.AS3Array.DESCENDING));
					var tmpData:flash.BitmapData = null;
					var mtx:flash.Matrix = null;
					for(i = infos.length - 1; i >= 0; i--)
					{
						child = infos[i].target;
						tmpData = new flash.BitmapData(1,1,true,0);
						mtx = new flash.Matrix();
						mtx.tx = -(child["mouseX"]);
						mtx.ty = -(child["mouseY"]);
						tmpData["draw" + ""](child,mtx,null,null,com.coder.utils.HitTest.pixelRect);
						var targetAlpha:number = (tmpData["getPixel32" + ""](0,0) >> 24) & 0xFF;
						if(targetAlpha > 40)
						{
							result = child;
							break;
						}
					}
					return result;
				}

				public static getChildAtPoint(targetParent:egret.DisplayObjectContainer,point:egret.Point,elements:Array<any> = null):egret.DisplayObject
				{
					if(elements == null)
					{
						elements = targetParent["getObjectsUnderPoint" + ""](point);
					}
					var tmpList:Array<any> = [];
					var bounds:egret.Rectangle = null;
					for(var item_key_a in elements)
					{
						var item:egret.DisplayObject = elements[item_key_a];
						bounds = flash.getBounds(item,targetParent);
						if(bounds.containsPoint(point))
						{
							tmpList.push(item);
						}
					}
					elements = tmpList;
					tmpList = [];
					var index:number = 0;
					var cf:egret.ColorTransform = new egret.ColorTransform();
					for(index = 0; index < elements.length; index++)
					{
						cf.color = index;
						tmpList.push(elements[index].transform.colorTransform);
						elements[index].transform.colorTransform = cf;
					}
					var mtx:flash.Matrix = new flash.Matrix();
					mtx.tx = -point.x;
					mtx.ty = -point.y;
					var tmpData:flash.BitmapData = new flash.BitmapData(1,1);
					var orgRect:egret.Rectangle = new egret.Rectangle(0,0,tmpData.width,tmpData.height);
					tmpData["draw" + ""](targetParent,mtx,null,null,orgRect);
					var colorIndex:number = tmpData["getPixel" + ""](0,0);
					for(index = 0; index < elements.length; index++)
					{
						elements[index].transform.colorTransform = tmpList[index];
					}
					return elements[colorIndex];
				}

				private static setfilter(index:number):flash.ColorMatrixFilter
				{
					var params:Array<any> = [];
					params = params.concat([1,0,0,2,0]);
					params = params.concat([1,0,0,2,0]);
					params = params.concat([1,0,0,2,0]);
					params = params.concat([1,0,0,1,0]);
					return new flash.ColorMatrixFilter(params);
				}

			}
		}
	}
}

com.coder.utils.HitTest.pixel = new flash.BitmapData(1,1,true,0);
com.coder.utils.HitTest.pixelRect = new egret.Rectangle(0,0,1,1);
com.coder.utils.HitTest.colorTransform = new egret.ColorTransform(0,0,0,0);
com.coder.utils.HitTest.matrix = new flash.Matrix();
com.coder.utils.HitTest.bitmapData = new flash.BitmapData(1,1,true,0);
