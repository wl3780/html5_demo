module engine {
	export class AvatarUnitDisplay extends NoderSprite implements IAvatar {

		public static depthBaseHash:Array<Array<string>> = [["wgid", "mid", "wid"], ["wgid", "wid", "mid"], ["wid", "wgid", "mid"], ["wid", "mid", "wgid"], ["wid", "mid", "wgid"], ["mid", "wgid", "wid"], ["wgid", "mid", "wid"], ["wgid", "mid", "wid"]];
		public static depthAttackHash:Array<Array<string>> = [["wgid", "mid", "wid"], ["wgid", "wid", "mid"], ["wid", "mid", "wgid"], ["wid", "mid", "wgid"], ["wid", "mid", "wgid"], ["mid", "wgid", "wid"], ["wgid", "mid", "wid"], ["wgid", "mid", "wid"]];
		public static depthDeathHash:Array<string> = ["wid", "mid", "wgid"];
		public static charIntersectsRect:egret.Rectangle = new egret.Rectangle();

		private static _instanceHash_:Map<string, IAvatar> = new Map<string, IAvatar>();

		public mid:string;
		public wid:string;
		public wgid:string;

		protected _unit_:AvatarUnit;

		protected bmd_mid:egret.Bitmap;
		protected bmd_wid:egret.Bitmap;
		protected bmd_wgid:egret.Bitmap;
		protected bmd_eid:egret.Bitmap;

		protected _hide_body_:boolean = false;
		protected _hide_wing_:boolean = false;
		protected _hide_title_:boolean = false;

		public constructor() {
			super();
			this.setup();
		}

		public static takeUnitDisplay(unitId:string):IAvatar {
			return AvatarUnitDisplay._instanceHash_.get(unitId);
		}

		public hideBody(value:boolean) {
			this._hide_body_ = value;
		}

		public hideWing(value:boolean) {
			this._hide_wing_ = value;
		}

		public hideTitle(value:boolean) {
			this._hide_title_ = value;
		}

		public loadAvatarPart(type:string, idNum:string, random:number=0) {
			if (type == AvatarTypes.BODY_TYPE) {
				this.mid = idNum;
			}
			if (type == AvatarTypes.WEAPON_TYPE) {
				this.wid = idNum;
			}
			if (type == AvatarTypes.WING_TYPE) {
				this.wgid = idNum;
			}
			this._unit_.loadAvatarPart(type, idNum, random);
		}

		public play(action:string, renderType:number=AvatarRenderTypes.NORMAL_RENDER, playEndFunc:Function=null, stopFrame:number=-1) {
			if (action == ActionConst.DEATH) {
				renderType = AvatarRenderTypes.PLAY_NEXT_RENDER;
			}
			this._unit_.play(action, renderType, stopFrame);
			this.updateBitmapDepth();
		}

		public stop() {

		}

		public onBodyRender(renderType:string, avatarType:string, bitmapData:egret.Texture, tx:number, ty:number, shadow:egret.Texture=null) {
			if (bitmapData) {
				var bitmap:egret.Bitmap = null;
				if (this._hide_body_ == false) {
					if (renderType == AvatarRenderTypes.BODY_TYPE) {
						switch (avatarType) {
							case AvatarTypes.BODY_TYPE:
								if (!this.bmd_mid) {
									this.bmd_mid = new egret.Bitmap();
								}
								bitmap = this.bmd_mid;
								break;
							case AvatarTypes.WEAPON_TYPE:
								if (!this.bmd_wid) {
									this.bmd_wid = new egret.Bitmap();
								}
								bitmap = this.bmd_wid;
								break;
							case AvatarTypes.WING_TYPE:
								if (!this.bmd_wgid) {
									this.bmd_wgid = new egret.Bitmap();
								}
								bitmap = this.bmd_wgid;
								break;
						}
					} else if (renderType == AvatarRenderTypes.BODY_EFFECT) {
						if (!this.bmd_eid) {
							this.bmd_eid = new egret.Bitmap();
							this.addChild(this.bmd_eid);
						}
						bitmap = this.bmd_eid;
					}
				}

				if (this._hide_body_) {
					if (this.bmd_mid && this.bmd_mid.texture) {
						this.bmd_mid.texture = null;
					}
					if (this.bmd_wid && this.bmd_wid.texture) {
						this.bmd_wid.texture = null;
					}
					if (this.bmd_wgid && this.bmd_wgid.texture) {
						this.bmd_wgid.texture = null;
					}
				} else if (this._hide_wing_) {
					if (this.bmd_wgid && this.bmd_wgid.texture) {
						this.bmd_wgid.texture = null;
					}
					this.setBitmapValue(bitmap, bitmapData, -tx, -ty);
					if (!bitmap.parent && bitmapData) {
						this.updateBitmapDepth();
					}
				}
			} else {
				if (renderType == AvatarRenderTypes.BODY_TYPE) {
					if (avatarType == AvatarTypes.BODY_TYPE && this.bmd_mid) {
						this.bmd_mid.texture = null;
					}
					if (avatarType == AvatarTypes.WEAPON_TYPE && this.bmd_wid) {
						this.bmd_wid.texture = null;
					}
					if (avatarType == AvatarTypes.WING_TYPE && this.bmd_wgid) {
						this.bmd_wgid.texture = null;
					}
				} else if (renderType == AvatarRenderTypes.BODY_EFFECT) {
					if (this.bmd_eid) {
						this.bmd_eid.texture = null;
					}
				}
			}
		}

		public onEffectRender(oid:string, renderType:string, bitmapData:egret.Texture, tx:number, ty:number) {

		}

		public updateBitmapDepth() {
		}

		public get stageIntersects():Boolean {
			var rect:egret.Rectangle = EngineGlobal.charIntersectsRect;
			rect.x = this.x - 100;
			rect.y = this.y - 150;
			rect.width = 200;
			rect.height = 300;
			return EngineGlobal.stageRect.intersects(rect) ? true : false;
		}

		public dispose() {
			AvatarUnitDisplay._instanceHash_.delete(this.id);
			if (this.bmd_mid) {
				this.bmd_mid.texture = null;
			}
			if (this.bmd_wid) {
				this.bmd_wid.texture = null;
			}
			if (this.bmd_wgid) {
				this.bmd_wgid.texture = null;
			}
			if (this._unit_) {
				this._unit_.recover();
				this._unit_ = null;
			}
			this.mid = null;
			this.wid = null;
			this.wgid = null;
			super.dispose();
		}

		protected setup() {
			AvatarUnitDisplay._instanceHash_.set(this.id, this);
			this.registerNodeTree(SceneConst.SCENE_ITEM_NODER);
			this._unit_ = AvatarUnit.createAvatarUnit();
		}

		private setBitmapValue(bitmap:egret.Bitmap, bitmapData:egret.Texture, vx:number, vy:number) {
			if (!bitmap) {
				return;
			}
			if (bitmapData == null) {
				if (bitmap.parent) {
					bitmap.parent.removeChild(bitmap);
				}
				return;
			}
			if (this._hide_body_ && (bitmap == this.bmd_mid || bitmap == this.bmd_wid || bitmap == this.bmd_wgid)) {
				return;
			}
			if (this._hide_wing_ && bitmap == this.bmd_wgid) {
				return;
			}
			if (this.stageIntersects) {
				if (bitmap.texture != bitmapData) {
					bitmap.texture = bitmapData;
				}
			}
		}

	}
}