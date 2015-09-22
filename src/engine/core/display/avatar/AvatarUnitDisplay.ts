module engine {
	export class AvatarUnitDisplay extends NoderSprite implements IAvatar {

		public static _instanceHash_:Map<string, IAvatar> = new Map<string, IAvatar>();

		public mid:string;
		public wid:string;
		public wgid:string;

		protected _unit_:AvatarUnit;

		protected bmd_mid:egret.Bitmap;
		protected bmd_wid:egret.Bitmap;
		protected bmd_wgid:egret.Bitmap;

		protected _hide_body_:boolean = false;
		protected _hide_wing_:boolean = false;
		protected _hide_title_:boolean = false;
		protected _effectHash_:Map<string, egret.Bitmap> = new Map<string, egret.Bitmap>();

		public constructor() {
			super();
			this.setup();
		}

		public static takeUnitDisplay(unitId:string):IAvatar {
			return AvatarUnitDisplay._instanceHash_.get(unitId);
		}

		public set hideBody(value:boolean) {
			this._hide_body_ = value;
			this.updateBitmapDepth();
		}

		public set hideWing(value:boolean) {
			this._hide_wing_ = value;
			this.updateBitmapDepth();
		}

		public set hideTitle(value:boolean) {
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

		public loadEffect(idNum:string, type:string=AvatarRenderTypes.BODY_TOP_EFFECT, random:number=0) {
			this._unit_.loadEffect(idNum, type, random);
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

		public onBodyRender(avatarType:string, bitmapData:egret.Texture, tx:number, ty:number) {
			if (bitmapData) {
				var bitmap:egret.Bitmap = null;
				if (this._hide_body_ == false) {
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
				}

                this.setBitmapValue(bitmap, bitmapData, -tx, -ty);
                if (bitmap.texture && !bitmap.parent) {
                    this.updateBitmapDepth();
                }
			} else {
				if (avatarType == AvatarTypes.BODY_TYPE && this.bmd_mid) {
					this.bmd_mid.texture = null;
				}
				if (avatarType == AvatarTypes.WEAPON_TYPE && this.bmd_wid) {
					this.bmd_wid.texture = null;
				}
				if (avatarType == AvatarTypes.WING_TYPE && this.bmd_wgid) {
					this.bmd_wgid.texture = null;
				}
			}
		}

		public onEffectRender(oid:string, renderType:string, bitmapData:egret.Texture, tx:number, ty:number, remove:boolean=false) {
			var bitmap:egret.Bitmap;
			if (bitmapData && this._effectHash_.has(oid) == false) {
				bitmap = new egret.Bitmap();
				this._effectHash_.set(oid, bitmap);
			} else {
				bitmap = this._effectHash_.get(oid);
			}
			if (remove) {	// 移除特效
				this._effectHash_.delete(oid);
			} else if (bitmap) {
				bitmap.name = renderType + "#" + (-tx) + "#" + (-ty);
				if (renderType == AvatarRenderTypes.BODY_TOP_EFFECT) {
					Scene.scene.topLayer.addChild(bitmap);
				} else if (renderType == AvatarRenderTypes.BODY_BOTTOM_EFFECT) {
					Scene.scene.bottomLayer.addChild(bitmap);
				} else if (renderType == AvatarRenderTypes.BODY_EFFECT) {
					this.addChild(bitmap);
				}
			}
			this.setBitmapValue(bitmap, bitmapData, -tx, -ty);
		}

		public get dir():number {
			return this._unit_.dir;
		}
		public set dir(value:number) {
			this._unit_.dir = value;
			this.updateBitmapDepth();
		}

		public get action():string {
			return this._unit_.action;
		}

		public get stageIntersects():boolean {
			var rect:egret.Rectangle = EngineGlobal.charIntersectsRect;
			rect.x = this.x - 100;
			rect.y = this.y - 150;
			rect.width = 200;
			rect.height = 300;
			return EngineGlobal.stageRect.intersects(rect) ? true : false;
		}

		public _setX(value:number) {
			super._setX(value);
		}

		public _setY(value:number) {
			super._setY(value);
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
			this._unit_.oid = this.id;
			this._unit_.init();
		}

		protected updateBitmapDepth() {
			var depthInfos:Array<string> = AvatarTypes.depthBaseHash[this.dir];
			if (this.action == ActionConst.ATTACK || this.action == ActionConst.SKILL || this.action == ActionConst.AttackWarm) {
				depthInfos = AvatarTypes.depthAttackHash[this.dir];
			} else if (this.action == ActionConst.DEATH) {
				depthInfos = AvatarTypes.depthDeathHash;
			}
			var bmp:egret.Bitmap;
			depthInfos.forEach(act => {
				bmp = this["bmd_"+act];
				if (bmp) {
					if (this._hide_body_ || (this._hide_wing_ && act == AvatarTypes.WING_TYPE)) {
						if (bmp.parent) {
							bmp.parent.removeChild(bmp);
						}
					} else {
						this.addChildAt(bmp, 0);
					}
				}
			});
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
				if (bitmap.parent == this) {
					bitmap.x = vx;
					bitmap.y = vy;
				} else {
					bitmap.x = this.x + vx;
					bitmap.y = this.y + vy;
				}
			}
		}

	}
}