module engine {
    export class AvatarTypes {
        /**
         * eid
         */
        public static EFFECT_TYPE:string = "eid";
        /**
         * mid
         */
        public static BODY_TYPE:string = "mid";
        /**
         * wid
         */
        public static WEAPON_TYPE:string = "wid";
        /**
         * wgid
         */
        public static WING_TYPE:string = "wgid";

        public static depthBaseHash:Array<Array<string>> = [
            ["wgid", "mid", "wid"],
            ["wgid", "wid", "mid"],
            ["wid", "wgid", "mid"],
            ["wid", "mid", "wgid"],
            ["wid", "mid", "wgid"],
            ["mid", "wgid", "wid"],
            ["wgid", "mid", "wid"],
            ["wgid", "mid", "wid"]
        ];
        public static depthAttackHash:Array<Array<string>> = [
            ["wgid", "mid", "wid"],
            ["wgid", "wid", "mid"],
            ["wid", "mid", "wgid"],
            ["wid", "mid", "wgid"],
            ["wid", "mid", "wgid"],
            ["mid", "wgid", "wid"],
            ["wgid", "mid", "wid"],
            ["wgid", "mid", "wid"]
        ];
        public static depthDeathHash:Array<string> = ["wid", "mid", "wgid"];

    }
}

module engine {
    export class AvatarRenderTypes {
        public static BODY_EFFECT:string = "body_effect";
        public static BODY_TOP_EFFECT:string = "body_top_effect";
        public static BODY_BOTTOM_EFFECT:string = "body_bottom_effect";

        /** 0 */
        public static NORMAL_RENDER:number = 0;
        /** 1 */
        public static UN_PLAY_NEXT_RENDER:number = 1;
        /** 2 */
        public static PLAY_NEXT_RENDER:number = 2;
    }
}

module engine {
    export class ActionConst {
        /**
         * 行走
         */
        public static WALK:string = "walk";
        /**
         * 跑
         */
        public static RUN:string = "run";
        /**
         * 站立
         */
        public static STAND:string = "stand";
        /**
         * 死亡
         */
        public static DEATH:string = "death";
        /**
         * 攻击
         */
        public static ATTACK:string = "attack";
        /**
         * 受击
         */
        public static HIT:string = "hit";
        /**
         * 技能
         */
        public static SKILL:string = "skill";
        /**
         * 攻击起手动作
         */
        public static AttackWarm:string = "attack_warm";

        public static LoopActions:Array<string> = [
            ActionConst.STAND,
            ActionConst.WALK,
            ActionConst.RUN,
            ActionConst.AttackWarm
        ];

        public static warmHash:any = {
            attack:"attack_warm"
        }
    }
}
