module engine {

    export interface ILoader extends IProto {

        path:string;

        name:string;

        dataFormat:string;

        loadElemt(url:string, successFunc:Function, errorFunc?:Function, progressFunc?:Function, thisObject?:any);
    }
}