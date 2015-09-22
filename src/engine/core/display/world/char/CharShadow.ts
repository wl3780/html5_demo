module engine {
	export class CharShadow extends DisplaySprite implements IAvatar {

		protected bmd_mid:egret.Bitmap;

		private _unit_:AvatarUnit;

		public constructor() {
			super();
            Scene.scene.itemLayer.addChild(this);
			AvatarUnitDisplay._instanceHash_.set(this.id, this);
		}

		public set unit(value:AvatarUnit) {
			this._unit_ = value;
		}

		public play(action:string, renderType:number = AvatarRenderTypes.NORMAL_RENDER, playEndFunc:Function = null, stopFrame:number = -1) {
			if (this._unit_) {
				this._unit_.play(action, renderType, stopFrame);
			}
		}

		public stop() {

		}

		public loadAvatarPart(type:string, idNum:string, random:number=0) {
			if (this._unit_) {
				this._unit_.loadAvatarPart(type, idNum, random);
			}
		}

		public display(action:string, dir:number, frame:number) {
			if (this._unit_ && this._unit_.mainActionData) {
				var actData:AvatarActionData = this._unit_.mainActionData;
				if (actData.isReady) {
					actData.currAction = action;
					actData.currDir = dir;
					actData.currFrame = frame;
					var bmd:egret.Texture = actData.getBitmapData(dir, frame);
					var tx:number = actData.getBitmapDataOffsetX(dir, frame);
					var ty:number = actData.getBitmapDataOffsetY(dir, frame);
					// 渲染回调
					this.onBodyRender(actData.type, bmd, tx, ty);
				}
			}
		}

		public onEffectRender(oid:string, renderType:string, bitmapData:egret.Texture, tx:number, ty:number, remove:boolean=false) {

		}

		public onBodyRender(avatarType:string, bitmapData:egret.Texture, tx:number, ty:number) {
			if (bitmapData) {
				if (this.bmd_mid == null) {
					this.bmd_mid = new egret.Bitmap();
					this.addChild(this.bmd_mid);
				}
				this.bmd_mid.texture = bitmapData;
				this.bmd_mid.x = -tx;
				this.bmd_mid.y = -ty;
			} else {
				if (this.bmd_mid) {
					this.bmd_mid.texture = null;
				}
			}
		}

		public dispose() {
			AvatarUnitDisplay._instanceHash_.delete(this.id);
			this._unit_ = null;
			if (this.bmd_mid) {
				this.bmd_mid.texture = null;
				this.bmd_mid = null;
			}
			super.dispose();
		}

	}
}
