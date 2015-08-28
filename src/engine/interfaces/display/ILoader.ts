module engine {

    export interface ILoader extends IProto {
        path:string;

        name:string;

        loadElemt(url:string, successFunc:()=>void = null, errorFunc:()=>void = null, progressFunc:()=>void = null):void;
    }
}