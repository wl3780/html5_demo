module com {
	export module coder {
		export module utils {
			export class BitmapScale9Grid extends egret.HashObject {

				public static _defaultBitmapData_:flash.BitmapData;
				private _bitmapdata:flash.BitmapData;
				private _width:number = 0;
				private _height:number = 0;
				private _scale9Grid:egret.Rectangle;
				private _cutRect:egret.Rectangle;
				private _scale9GridRect:Array<any>;
				private _x:number = 0;
				private _y:number = 0;

				public constructor(bitmapData:flash.BitmapData = null,scale9Grid:egret.Rectangle = null)
				{
					super();
					this._bitmapdata = bitmapData;
					if(this._bitmapdata == null)
					{
						this._bitmapdata = com.coder.utils.BitmapScale9Grid._defaultBitmapData_;
					}
					this._scale9Grid = scale9Grid;
					if(this._scale9Grid == null)
					{
						this._scale9Grid = new egret.Rectangle(80,30,121,340);
					}
					this.updataCutRectangle();
				}

				public set x(value:number)
				{
					this._x = value;
					this.updataCutRectangle();
				}

				public set y(value:number)
				{
					this._y = value;
					this.updataCutRectangle();
				}

				public setPos(x:number,y:number)
				{
					this._x = x;
					this._y = y;
					this.updataCutRectangle();
				}

				public get curRect():egret.Rectangle
				{
					return this._cutRect;
				}

				public reander()
				{
					this.updataCutRectangle();
				}

				private updataCutRectangle()
				{
					if(this._bitmapdata == null || (this._bitmapdata.width == 0 && this._bitmapdata.height == 0))
					{
						return ;
					}
					var bmdRect:egret.Rectangle = this._bitmapdata.rect;
					var rHeight:number = (this._width - this._scale9Grid.x) - (bmdRect.right - this._scale9Grid.right);
					var _local13:number = (this._height - this._scale9Grid.y) - (bmdRect.bottom - this._scale9Grid.bottom);
					rHeight < 0?rHeight = 0:"";
					_local13 < 0?_local13 = 0:"";
					this._cutRect = new egret.Rectangle(this._scale9Grid.x,this._scale9Grid.y,rHeight,_local13);
					var xx:Array<number> = [0,this._scale9Grid.x,this._scale9Grid.right];
					var yx:Array<number> = [0,this._scale9Grid.y,this._scale9Grid.bottom];
					var wx:Array<number> = [this._scale9Grid.x,this._scale9Grid.width,bmdRect.right - this._scale9Grid.right];
					var hx:Array<number> = [this._scale9Grid.y,this._scale9Grid.height,bmdRect.bottom - this._scale9Grid.bottom];
					var x:Array<number> = [0,this._cutRect.x,this._cutRect.right];
					var y:Array<number> = [0,this._cutRect.y,this._cutRect.bottom];
					var w:Array<number> = [this._cutRect.x,this._cutRect.width,bmdRect.right - this._scale9Grid.right];
					var h:Array<number> = [this._cutRect.y,this._cutRect.height,bmdRect.bottom - this._scale9Grid.bottom];
					var mat:flash.Matrix = null;
					var sx:number = 0;
					var sy:number = 0;
					this._scale9GridRect = [];
					for(var i:number = 0;i < 3; i++)
					{
						for(var j:number = 0;j < 3; j++)
						{
							mat = new flash.Matrix();
							sx = w[i] / wx[i];
							sy = h[j] / hx[j];
							mat.scale(sx,sy);
							mat.ty = y[j] - yx[j] + this._y;
							mat.tx = x[i] - xx[i] + this._x;
							if(i == 1)
							{
								mat.tx = (1 - sx) * x[1] + this._x;
							}
							if(j == 1)
							{
								mat.ty = (1 - sy) * y[1] + this._y;
							}
							this._scale9GridRect.push({rect:new egret.Rectangle(x[i],y[j],w[i],h[j]),matrix:mat});
						}
					}
				}

				public set width(value:number)
				{
					this._width = value;
					this.updataCutRectangle();
				}

				public set height(value:number)
				{
					this._height = value;
					this.updataCutRectangle();
				}

				public setup(bitmapData:flash.BitmapData,scale9Grid:egret.Rectangle)
				{
					this.bitmapData = bitmapData;
					this.scale9Grid = scale9Grid;
				}

				public set scale9Grid(innerRectangle:egret.Rectangle)
				{
					this._scale9Grid = innerRectangle;
					this.updataCutRectangle();
				}

				public get scale9Grid():egret.Rectangle
				{
					return this._scale9Grid;
				}

				public set rect(value:egret.Rectangle)
				{
					this._x = value.x;
					this._y = value.y;
					this._width = value.width;
					this._height = value.height;
					this.updataCutRectangle();
				}

				public set bitmapData(value:flash.BitmapData)
				{
					this._bitmapdata = value;
					this.updataCutRectangle();
				}

				public draw(graphics:egret.Graphics,clear:boolean = true,drawCutRect:boolean = true)
				{
					if(clear)
					{
						graphics.clear();
					}
					var sRect:egret.Rectangle = null;
					var sMat:flash.Matrix = null;
					for(var i:number = 0;i < 9; i++)
					{
						sRect = this._scale9GridRect[i].rect;
						sMat = this._scale9GridRect[i].matrix;
						graphics["beginBitmapFill" + ""](this._bitmapdata,sMat,false,true);
						if(!(!drawCutRect && i == 4))
						{
							graphics.drawRect(sRect.x + this._x,sRect.y + this._y,sRect.width,sRect.height);
						}
					}
				}

				public setSize(width:number,height:number)
				{
					this._width = width;
					this._height = height;
					this.updataCutRectangle();
				}

			}
		}
	}
}

com.coder.utils.BitmapScale9Grid._defaultBitmapData_ = new flash.BitmapData(10,10,false,0xFFFFFF);
