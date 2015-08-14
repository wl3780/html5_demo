module engine {

    export interface IAvatar extends IDisplay {
        stop();

        play(action:string, renderType?:number, playEndFunc?:Function, stopFrame?:number);

        loadAvatarPart(type:string, idNum:string, random?:number);

        onEffectRender(oid:string, renderType:string, bitmapData:egret.Texture, tx:number, ty:number);

        onBodyRender(renderType:string, bitmapType:string, bitmapData:egret.Texture, tx:number, ty:number, shadow?:egret.Texture);
    }
}