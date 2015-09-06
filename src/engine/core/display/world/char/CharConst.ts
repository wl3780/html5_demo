module engine {
	export class CharTypes {

		public static MAIN_CHAR:string = "hero";

		public static CHAR:string = "char";

		public static MONSTER:string = "monster_normal";
		public static SUMMON_MONSTER:string = "monster_summon";

		public static NPC:string = "npc_normal";
		public static SUMMON_NPC:string = "npc_summon";
	}
}

module engine {
	export class SexTypes {
		/**
		 * 性别男
		 * @type {number}
		 */
		public static Male:number = 1;
		/**
		 * 性别女
		 * @type {number}
		 */
		public static Female:number = 2;
	}
}