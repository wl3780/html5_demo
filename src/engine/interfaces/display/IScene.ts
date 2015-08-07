module engine {

    export interface IScene {
        addItem(item:ISceneItem, layer:string);

        removeItem(item:ISceneItem):void;

        takeItem(char_id:string):ISceneItem;

        sceneMoveTo(px:number, py:number):void;

        changeScene(scene_id:string):void;

        dispose():void;
    }
}