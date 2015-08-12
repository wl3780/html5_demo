module engine {
	export class AvatarUnitDisplay extends NoderSprite {

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

		protected _hide_body_:boolean = false;
		protected _hide_wing_:boolean = false;
		protected _hide_title_:boolean = false;

		public constructor() {
			super();
			this.setup();
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

		public loadAvatarPart(type:string, idName:string) {
			if (type == AvatarTypes.BODY_TYPE) {
				this.mid = idName;
			}
			if (type == AvatarTypes.WEAPON_TYPE) {
				this.wid = idName;
			}
			if (type == AvatarTypes.WING_TYPE) {
				this.wgid = idName;
			}
			this._unit_.loadAvatarPart(type, idName);
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

	}
}