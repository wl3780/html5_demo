module engine {
	export class BloodKit extends egret.Sprite {

		private currValue:number = 0;
		private maxValue:number = 0;
		private percent:number = 0;

		private _width:number = 0;
		private _height:number = 0;
		private _color:number = 0;

		private _bitmap:egret.Bitmap;
		private _overBitmap:egret.Bitmap;

		private _bitmapData:egret.Texture;
		private _overBitmapData:egret.Texture;

		public constructor(color:number = 0xFF0000) {
			super();
			this._color = color;
			this.width = 40;
			this.height = 3;
			this.cacheAsBitmap = true;
		}

		/** 表 */
		public set overBitmapData(value:egret.Texture) {
			this._overBitmapData = value;
			this.onRender();
		}

		/** 底 */
		public set bitmapData(value:egret.Texture) {
			this._bitmapData = value;
			this.onRender();
		}

		public setValue(currValue:number, maxValue:number) {
			this.currValue = currValue;
			this.maxValue = maxValue;
			this.percent = (currValue / maxValue) * 100 / 100;
			if (this.percent > 1) {
				this.percent = 1;
			}
			if (this.percent < 0) {
				this.percent = 0;
			}
			this.onRender();
		}

		public onRender() {
			this.graphics.clear();
			if (this._bitmapData) {
				if (this._bitmap == null) {
					this._bitmap = new egret.Bitmap(this._bitmapData);
					this.addChildAt(this._bitmap, 0);
				}
			} else {
				this.graphics.beginFill(this._color);
				this.graphics.drawRect(0, 0, this.width*this.percent >> 0, this.height);
				this.graphics.endFill();
			}
			if (this._overBitmapData) {
				if (this._overBitmap == null) {
					this._overBitmap = new egret.Bitmap(this._overBitmapData);
					this._overBitmap.x = 1;
					this._overBitmap.y = 1;
					this.addChild(this._overBitmap);
				}
				this._overBitmap.width = this._overBitmapData.textureWidth * this.percent;
			} else {
				this.graphics.lineStyle(0.6, 0);
				this.graphics.drawRect(0, 0, this.width, this.height);
			}
		}

		public _getWidth():number {
			return this._width;
		}
		public _setWidth(value:number) {
			this._width = value;
			this.onRender();
		}

		public _getHeight():number {
			return this._height;
		}
		public _setHeight(value:number) {
			this._height = value;
			this.onRender();
		}

	}
}

