module engine {
	export class EngineGlobal {

		public static WEALTH_QUEUE_ALONE_SIGN:String = "【WQA】";
		public static WEALTH_QUEUE_GROUP_SIGN:String = "【WQG】";

		public static SM_EXTENSION:string = ".sm";
		public static TMP_EXTENSION:string = ".tmp";

		public static IMAGE_WIDTH:number = 320;
		public static IMAGE_HEIGHT:number = 180;

		public static AVATAR_IMAGE_WIDTH:number = 400;
		public static AVATAR_IMAGE_HEIGHT:number = 300;

		public static stageRect:egret.Rectangle = new egret.Rectangle();
        public static stagePoint: egret.Point = new egret.Point();
		public static charIntersectsRect:egret.Rectangle = new egret.Rectangle();

		public static language:string = "zh_CN";
		public static version:string = "ver-1";
		public static assetsHost:string;

		public static SHADOW_MALE:string = "ym1001";
		public static SHADOW_FEMALE:string = "yw1001";

		public static SHADOW_ID:String = "mid_npc054";
		public static MALE_SHADOW:String = "mid_" + EngineGlobal.SHADOW_MALE;
		public static FEMALE_SHADOW:String = "mid_" + EngineGlobal.SHADOW_FEMALE;
		public static MALE_BASE:string = "mid_wcx001";
		public static FEMALE_BASE:string = "mid_wco001";

		public static shadowAvatarGroup:AvatarActionFormatGroup;
		public static shadowAvatarGroupMale:AvatarActionFormatGroup;
		public static shadowAvatarGroupFemale:AvatarActionFormatGroup;
		public static baseAvatarGroupMale:AvatarActionFormatGroup;
		public static baseAvatarGroupFemale:AvatarActionFormatGroup;

		public static shadowAvatarData:AvatarActionData;
		public static shadowAvatarDataMale:AvatarActionData;
		public static shadowAvatarDataFemale:AvatarActionData;
		public static baseAvatarDataMale:AvatarActionData;
		public static baseAvatarDataFemale:AvatarActionData;

		public static TYPE_REFLEX:Object = {
			mid:"clothes",
			eid:"effects",
			midm:"mounts",
			wid:"weapons",
			wgid:"wings"
		};

		public static getAvatarAssetsConfigPath(idName:string):string {
			return "resource/avatars/output/" + idName + ".sm?ver=" + EngineGlobal.version;
		}
		public static getAvatarAssetsJsonPath(idName:string, action:string, dir:number):string {
			var idType:string = idName.split(Engine.LINE)[0];
			return "resource/avatars/" + EngineGlobal.TYPE_REFLEX[idType] + "/" + (idName+"_"+action+"_"+dir) + ".json?ver=" + EngineGlobal.version;
		}
		public static getAvatarAssetsImagePath(idName:string, action:string, dir:number):string {
			var idType:string = idName.split(Engine.LINE)[0];
			return "resource/avatars/" + EngineGlobal.TYPE_REFLEX[idType] + "/" + (idName+"_"+action+"_"+dir) + ".png?ver=" + EngineGlobal.version;
		}

		public static getMapConfigPath(map_id:string):string {
			return "resource/maps/map_data/scene_" + map_id + ".data?ver=" + EngineGlobal.version
		}
		public static getMapMiniPath(map_id:string):string {
			return "resource/maps/map_mini/scene_" + map_id + ".jpg?ver=" + EngineGlobal.version
		}
		public static getMapImagePath(map_id:string, x:number, y:number):string {
			return "resource/maps/map_image/scene_" + map_id + "/" + x + Engine.LINE + y + ".jpg?ver=" + EngineGlobal.version;
		}

	}
}
