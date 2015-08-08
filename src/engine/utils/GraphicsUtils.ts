module com {
	export module coder {
		export module utils {
			export class GraphicsUtils extends egret.HashObject {

				public static matrix:flash.Matrix;
				public static draw(graphics:egret.Graphics,bitmapData:flash.BitmapData,pox:number,poy:number,width:number,height:number)
				{
					var mat:flash.Matrix = com.coder.utils.GraphicsUtils.matrix;
					mat.identity();
					mat.tx = pox;
					mat.ty = poy;
					graphics["beginBitmapFill" + ""](bitmapData,mat);
					graphics.drawRect(pox,poy,width,height);
				}

				public static drawTransformBitmap(target:egret.DisplayObject,containerWidth:number,containerHeight:number,noScale:boolean = false):flash.BitmapData
				{
					var mat:flash.Matrix = com.coder.utils.GraphicsUtils.getFitMatrix(containerWidth,containerHeight,target.width,target.height,noScale);
					var result:flash.BitmapData = new flash.BitmapData(containerWidth,containerHeight,true,0);
					result["draw" + ""](target,mat,null,null,null,true);
					return result;
				}

				public static getFitMatrix(containerWidth:number,containerHeight:number,targetWidth:number,targetHeight:number,noScale:boolean = false):flash.Matrix
				{
					var scale:number = com.coder.utils.GraphicsUtils.getScale(containerWidth,containerHeight,targetWidth,targetHeight);
					if(noScale)
					{
						scale = 1;
					}
					com.coder.utils.GraphicsUtils.matrix.identity();
					com.coder.utils.GraphicsUtils.matrix.scale(scale,scale);
					var dx:number = (containerWidth - (targetWidth * scale)) / 2;
					var dy:number = (containerHeight - (targetHeight * scale)) / 2;
					com.coder.utils.GraphicsUtils.matrix.tx = com.coder.utils.GraphicsUtils.matrix.tx + dx;
					com.coder.utils.GraphicsUtils.matrix.ty = com.coder.utils.GraphicsUtils.matrix.ty + dy;
					return com.coder.utils.GraphicsUtils.matrix;
				}

				public static getScale(width:number,height:number,targetWidth:number,targetHeight:number):number
				{
					var minSize:number = width < height?width:height;
					var result:number = targetWidth > targetHeight?(minSize / targetWidth):(minSize / targetHeight);
					return result;
				}

			}
		}
	}
}

com.coder.utils.GraphicsUtils.matrix = new flash.Matrix();
