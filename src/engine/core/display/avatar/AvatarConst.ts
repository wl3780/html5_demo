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
        /**
         * midm
         */
        public static MOUNT_TYPE:string = "midm";
        /**
         * fid
         */
        public static FLY_TYPE:string = "fid";

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
        public static BODY_TYPE:string = "body_type";
        public static BODY_EFFECT:string = "body_effect";

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
         * 群攻
         */
        public static QUNGONG:string = "qungong";
        /**
         * 攻击
         */
        public static ATTACK:string = "attack";
        /**
         * 飞行
         */
        public static FLY:string = "fly";
        /**
         * 受击
         */
        public static HIT:string = "hit";
        /**
         * 采集
         */
        public static COLLECTION:string = "caiji";
        /**
         * 打坐
         */
        public static MEDITATION:string = "dazuo";
        /**
         * 技能
         */
        public static SKILL:string = "skill";
        /**
         * 跳跃
         */
        public static JUMP:string = "jump";
        /**
         * 攻击起手动作
         */
        public static AttackWarm:string = "attack_warm";

        public static LoopActions:Array<string> = [
            ActionConst.AttackWarm,
            ActionConst.STAND,
            ActionConst.RUN,
            ActionConst.WALK
        ];

        public static warmHash:any = {
            attack:"attack_warm",
            walk:"walk_warm",
            run:"run_warm"
        }
    }
}
