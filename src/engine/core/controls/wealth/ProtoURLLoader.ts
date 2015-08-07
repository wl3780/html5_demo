module engine {

    export class ProtoURLLoader extends egret.URLLoader {

        public name:string;
        public x:number;
        public y:number;

        public constructor(request?:egret.URLRequest) {
            super(request);
        }

    }

}