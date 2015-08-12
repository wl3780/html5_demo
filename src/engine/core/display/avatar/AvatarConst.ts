module engine {
    export class AvatarActions {
        /**
         * 行走
         */
        public static WALK:string = "walk";
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
         * 技能1
         */
        public static SKILL1:string = "skill1";
        /**
         * 技能2
         */
        public static SKILL2:string = "jump";
        /**
         * 技能3
         */
        public static SKILL3:string = "skill3";
    }
}

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

    }
}