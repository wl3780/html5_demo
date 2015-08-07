module engine {

    export interface INoder {
        x:number;

        y:number;

        id:string;

        tid?:string;

        isActive?:boolean;

        node:INodeRect;

        activate():void;

        unactivate():void;
    }
}