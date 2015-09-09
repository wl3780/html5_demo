module engine {

    export interface IAvatar extends IDisplay {
        loadAvatarPart(type:string, idNum:string, random?:number);

        play(action:string, renderType?:number, playEndFunc?:Function, stopFrame?:number);

        stop();

        onBodyRender(renderType:string, avatarType:string, texture:egret.Texture, tx:number, ty:number);

        onEffectRender(oid:string, renderType:string, texture:egret.Texture, tx:number, ty:number);
    }
}