module engine {
	export class CharHead extends DisplaySprite {

		public static intanceHash:Array<CharHead>;
		public static cacheBmdHash:com.coder.utils.Hash;
		public static charHeadQueue:Array<any>;
		public static defaultTextFormat:flash.TextFormat;
		public static _blood_:BloodKit;
		public static _nei_:BloodKit;
		public static _nameText_:flash.TextField;
		public static _professionNameText_:flash.TextField;
		public static _unionNameText_:flash.TextField;
		public static _sprite_:egret.Sprite;
		public static _bloodText_:flash.TextField;
		public static _renderNum_:number;
		public static _renderIndex_:number;
		public char_id:string;
		public cacheMode:boolean = false;
		private bmd:flash.BitmapData;
		private topIdName:string;
		private renderInterval:number = 0;
		private renderIndex:number = 0;
		private renderTime:number = 0;
		private tmpTime:number = 0;
		private _headIconSize:number = 30;
		private _disposed_:boolean = false;
		private _name_:string;
		private _unionName_:string;
		private _professionName_:string;
		private _nameColor_:number = 0;
		private _professionNameColor_:number = 0;
		private _unionColor_:number = 0;
		private _professionNameVisible_:boolean = false;
		private _nameVisible_:boolean = false;
		private _unionNameVisible_:boolean = false;
		private _bloodKitVisible_:boolean = false;
		private _owner_:string;
		private _currBlood_:number = 0;
		private _maxBlood_:number = 0;
		private _neiKitVisible_:boolean = false;
		private _currNei_:number = 0;
		private _maxNei_:number = 0;
		private _headIconLeft:egret.DisplayObject;
		private _headIconRight:egret.DisplayObject;
		private _flag:egret.DisplayObject;
		private _headIconCenter:egret.DisplayObject;
		private _headBitmapData:flash.BitmapData;
		private _topIcon:avatar.AvatarEffect;
		private _topImage:items.Image;
		private _topIndexY:number = 0;
		private _tile:CharTitleImage;
		private _wordShape_:WordShape;
		private _isDisposed:boolean = false;
		private _heidTitle:boolean = false;
		private _isCharNameBitmapMode:boolean = false;

		public constructor()
		{
			super();
			this.init();
		}

		public static setBloodBitmapData(value:flash.BitmapData)
		{
			CharHead._blood_.overBitmapData = value;
		}

		public static setNeiLiBitmapData(value:flash.BitmapData)
		{
			CharHead._nei_.overBitmapData = value;
		}

		public static setBGBitmapData(value:flash.BitmapData)
		{
			CharHead._nei_.bitmapData = value;
			CharHead._blood_.bitmapData = value;
		}

		public static createCharHead():CharHead
		{
			var result:CharHead = null;
			if(CharHead.charHeadQueue.length)
			{
				result = CharHead.charHeadQueue.pop();
				result.resetForDisposed();
			}
			else
			{
				result = new CharHead();
			}
			return result;
		}

		public get currHP():number
		{
			return this._currBlood_;
		}

		public get maxHP():number
		{
			return this._maxBlood_;
		}

		public sayWord(value:string)
		{
			if(value)
			{
				if(!this._wordShape_)
				{
					this._wordShape_ = new WordShape();
				}
				if(!this._wordShape_.parent)
				{
					this.addChild(this._wordShape_);
				}
				this._wordShape_.sayWord(value);
				this.updateEffectPos();
			}
			else
			{
				if(this._wordShape_)
				{
					this._wordShape_.closeFunc();
				}
			}
		}

		public setHeidTitle(value:boolean)
		{
			this._heidTitle = value;
			if(value)
			{
				if(this._tile && this._tile.parent)
				{
					this._tile.parent.removeChild(this._tile);
				}
			}
			else
			{
				if(this._tile)
				{
					this.addChild(this._tile);
				}
			}
		}

		public showTile(char:Char,tiles:Array<any>,type:number = 0)
		{
			if(tiles && !this._tile)
			{
				this._tile = CharTitleImage.createCharTitleImage(char);
				this._tile.onReanderFunc = flash.bind(this.doit,this);
			}
			else
			{
				if(this._tile && !this._tile.char)
				{
					this._tile = CharTitleImage.createCharTitleImage(char);
					this._tile.onReanderFunc = flash.bind(this.doit,this);
				}
			}
			this._tile.setTiles(tiles,type);
			if(tiles.length)
			{
				this.setHeadIcon(this._tile);
			}
			else
			{
				this.setHeadIcon(null);
			}
			if(this._heidTitle)
			{
				if(this._tile && this._tile.parent)
				{
					this._tile.parent.removeChild(this._tile);
				}
			}
			this.setHeidTitle(this._heidTitle);
			this.doit();
		}

		public get currNei():number
		{
			return this._currNei_;
		}

		public get maxNei():number
		{
			return this._maxNei_;
		}

		public setNeiValue(curr:number,max:number)
		{
			this._currNei_ = curr;
			this._maxNei_ = max;
			this.doit();
		}

		public setBloodValue(curr:number,max:number)
		{
			this._currBlood_ = curr;
			this._maxBlood_ = max;
			this.doit();
		}

		public setTopImage(value:any)
		{
			if(!this._topImage)
			{
				this._topImage = new items.Image();
			}
			this._topImage.source = value;
			this.addChild(this._topImage);
			this.doit();
		}

		public setTopIcon(idName:string,passKey:string = null)
		{
			if(this._topIcon)
			{
				if(this._topIcon.parent_com_coder_core_displays_avatar_AvatarEffect)
				{
					this._topIcon.parent_com_coder_core_displays_avatar_AvatarEffect.removeChild(this._topIcon);
				}
				this._topIcon.recover();
			}
			if(!idName || idName == "0")
			{
				this.topIdName = null;
			}
			else
			{
				this._topIcon = new avatar.AvatarEffect();
				this._topIcon.name = "task_icon";
				this.topIdName = idName;
				this._topIcon.loadEffect(idName,world.SceneConst.TOP_LAYER,passKey);
				this.addChild(this._topIcon);
			}
			this.doit();
		}

		public set bloodKitVisible(value:boolean)
		{
			this._bloodKitVisible_ = value;
			this.doit();
		}

		public set neiKitVisible(value:boolean)
		{
			this._neiKitVisible_ = value;
			this.doit();
		}

		public set nameVisible(value:boolean)
		{
			if(this._nameVisible_ == value)
			{
				return ;
			}
			this._nameVisible_ = value;
			this.doit();
		}

		public set professionNameVisible(value:boolean)
		{
			if(this._professionNameVisible_ == value)
			{
				return ;
			}
			this._professionNameVisible_ = value;
			this.doit();
		}

		public set professionNameColor(value:number)
		{
			if(this._professionNameColor_ == value)
			{
				return ;
			}
			this._professionNameColor_ = value;
			this.doit();
		}

		public set nameColor(value:number)
		{
			if(this._nameColor_ == value)
			{
				return ;
			}
			this._nameColor_ = value;
			this.doit();
		}

		public set professionName(value:string)
		{
			if(this._professionName_ == value)
			{
				return ;
			}
			this._professionName_ = value;
			this.doit();
		}

		public set unionName(value:string)
		{
			if(this._unionName_ == value)
			{
				return ;
			}
			if(value)
			{
				this._unionNameVisible_ = true;
			}
			else
			{
				this._unionNameVisible_ = false;
			}
			this._unionName_ = value;
			this.doit();
		}

		public set name_com_coder_core_displays_world_char_CharHead(value:string)
		{
			if(this._name_ == value)
			{
				return ;
			}
			this._name_ = value;
			this.doit();
		}

		public get neiKitVisible():boolean
		{
			return this._neiKitVisible_;
		}

		public get bloodKitVisible():boolean
		{
			return this._bloodKitVisible_;
		}

		public get nameVisible():boolean
		{
			return this._nameVisible_;
		}

		public get nameColor():number
		{
			return this._nameColor_;
		}

		public get professionNameVisible():boolean
		{
			return this._professionNameVisible_;
		}

		public get professionNameColor():number
		{
			return this._professionNameColor_;
		}

		public get professionName():string
		{
			return this._professionName_;
		}

		public get unionName():string
		{
			return this._unionName_;
		}

		public get name_com_coder_core_displays_world_char_CharHead():string
		{
			return this._name_;
		}

		public showFlag(value:egret.DisplayObject)
		{
			if(this._flag && this._flag.parent)
			{
				this._flag.parent.removeChild(this._flag);
			}
			this._flag = value;
			this.doit();
		}

		public disposeFlag()
		{
			if(this._flag)
			{
				if(this._flag.parent)
				{
					this._flag.parent.removeChild(this._flag);
				}
				if(<flash.Loader>flash.As3As(this._flag,flash.Loader))
				{
					(<flash.Loader>(this._flag)).unloadAndStop();
				}
				if(<flash.Bitmap>flash.As3As(this._flag,flash.Bitmap))
				{
					flash.AS3Object(this._flag)["bitmapData" + ""] = null;
				}
				this._flag = null;
			}
		}

		public setHeadIcon(value:any,align:string = "center")
		{
			if(!value)
			{
				this.disposeHeadIcon(align);
				return ;
			}
			var icon:egret.DisplayObject = null;
			if(<flash.BitmapData>flash.As3As(value,flash.BitmapData))
			{
				icon = new flash.Bitmap();
				(<flash.Bitmap>(icon)).bitmapData = <flash.BitmapData>flash.As3As(value,flash.BitmapData);
			}
			else
			{
				if(<egret.DisplayObject>flash.As3As(value,egret.DisplayObject))
				{
					icon = <egret.DisplayObject>flash.As3As(value,egret.DisplayObject);
				}
			}
			if(align == "left")
			{
				this._headIconLeft = icon;
			}
			if(align == "right")
			{
				this._headIconRight = icon;
			}
			if(align == "center")
			{
				this._headIconCenter = icon;
			}
			if(icon)
			{
				this.addChild(icon);
			}
			this.doit();
		}

		public disposeHeadIcon(type:string = "all")
		{
			if(this._headIconLeft && (type == "all" || type == "left"))
			{
				if(this._headIconLeft.parent)
				{
					this._headIconLeft.parent.removeChild(this._headIconLeft);
				}
				if(<flash.Loader>flash.As3As(this._headIconLeft,flash.Loader))
				{
					(<flash.Loader>(this._headIconLeft)).unloadAndStop();
				}
				if(<flash.Bitmap>flash.As3As(this._headIconLeft,flash.Bitmap))
				{
					(<flash.Bitmap>(this._headIconLeft)).bitmapData = null;
				}
				this._headIconLeft = null;
			}
			if(this._headIconRight && (type == "all" || type == "right"))
			{
				if(this._headIconRight.parent)
				{
					this._headIconRight.parent.removeChild(this._headIconRight);
				}
				if(<flash.Loader>flash.As3As(this._headIconRight,flash.Loader))
				{
					(<flash.Loader>(this._headIconRight)).unloadAndStop();
				}
				if(<flash.Bitmap>flash.As3As(this._headIconRight,flash.Bitmap))
				{
					(<flash.Bitmap>(this._headIconRight)).bitmapData = null;
				}
				this._headIconRight = null;
			}
			if(this._headIconCenter && (type == "all" || type == "center"))
			{
				if(this._headIconCenter.parent)
				{
					this._headIconCenter.parent.removeChild(this._headIconCenter);
				}
				if(<flash.Loader>flash.As3As(this._headIconCenter,flash.Loader))
				{
					(<flash.Loader>(this._headIconCenter)).unloadAndStop();
				}
				if(<flash.Bitmap>flash.As3As(this._headIconCenter,flash.Bitmap))
				{
					(<flash.Bitmap>(this._headIconCenter)).bitmapData = null;
				}
				this._headIconCenter = null;
			}
		}

		public doit()
		{
			this.tmpTime = egret.getTimer();
			com.coder.core.controls.elisor.HeartbeatFactory.getInstance().addFrameOrder(flash.bind(this.onEnterFrameFunc,this));
		}

		protected onEnterFrameFunc()
		{
			CharHead._renderIndex_ = CharHead._renderIndex_ + 1;
			if(CharHead._renderIndex_ > 1)
			{
				CharHead._renderIndex_ = 0;
			}
			var char:Char = <Char>flash.As3As(avatar.AvatarUnitDisplay.takeUnitDisplay(this.oid),Char);
			if(!char || char.char_id != this.char_id)
			{
				com.coder.core.controls.elisor.HeartbeatFactory.getInstance().removeFrameOrder(flash.bind(this.onEnterFrameFunc,this));
				return ;
			}
			if(this.renderIndex == CharHead._renderIndex_ || egret.getTimer() - this.tmpTime > this.renderInterval || com.coder.utils.FPSUtils.fps > 30)
			{
				this.tmpTime = egret.getTimer();
				com.coder.core.controls.elisor.HeartbeatFactory.getInstance().removeFrameOrder(flash.bind(this.onEnterFrameFunc,this));
				if(char)
				{
					this.onRender();
				}
			}
		}

		protected init()
		{
			super.init();
			this.tabEnabled = false;
			this["tabChildren"] = false;
			this.touchEnabled = false;
			this.touchChildren = false;
			CharHead._nameText_.filters = com.coder.global.EngineGlobal.textFilter;
			CharHead._unionNameText_.filters = com.coder.global.EngineGlobal.textFilter;
			CharHead._professionNameText_.filters = com.coder.global.EngineGlobal.textFilter;
			CharHead._nameText_.defaultTextFormat = CharHead.defaultTextFormat;
			CharHead._unionNameText_.defaultTextFormat = CharHead.defaultTextFormat;
			CharHead._professionNameText_.defaultTextFormat = CharHead.defaultTextFormat;
			this.renderInterval = ((Math.random() * 700) >> 0) + 100;
			this.renderIndex = ((Math.random() * (1 + 1)) >> 0);
		}

		public set isCharNameBitmapMode(value:boolean)
		{
			this._isCharNameBitmapMode = value;
		}

		public onRender()
		{
			if(this._disposed_)
			{
				return ;
			}
			if(this._isDisposed)
			{
				return ;
			}
			var _this:any = CharHead._sprite_;
			CharHead._nameText_.htmlText = "";
			CharHead._professionNameText_.htmlText = "";
			CharHead._unionNameText_.htmlText = "";
			CharHead._bloodText_.htmlText = "";
			if(this.bmd)
			{
				this.bmd.dispose();
				this.bmd = null;
			}
			if(this.cacheMode)
			{
				this.bmd = <flash.BitmapData>flash.As3As(CharHead.cacheBmdHash["take" + ""](this._name_ + this._nameColor_),flash.BitmapData);
				if(this.bmd && (this.bmd.width == 0 || this.bmd.height))
				{
					this.bmd = null;
				}
			}
			this.graphics.clear();
			while(_this.numChildren)
			{
				_this.removeChildAt(0);
			}
			if(this._flag && this._flag.parent)
			{
				this._flag.parent.removeChild(this._flag);
			}
			if(this._headIconLeft && this._headIconLeft.parent)
			{
				this._headIconLeft.parent.removeChild(this._headIconLeft);
			}
			if(this._headIconRight && this._headIconRight.parent)
			{
				this._headIconRight.parent.removeChild(this._headIconRight);
			}
			if(this._headIconCenter && this._headIconCenter.parent)
			{
				this._headIconCenter.parent.removeChild(this._headIconCenter);
			}
			if(this._bloodKitVisible_)
			{
				_this.addChild(CharHead._bloodText_);
				_this.addChild(CharHead._blood_);
			}
			if(this._neiKitVisible_)
			{
				_this.addChild(CharHead._nei_);
			}
			if(this._name_ && this._nameVisible_)
			{
				_this.addChild(CharHead._nameText_);
			}
			if(this._professionName_ && this._professionNameVisible_)
			{
				_this.addChild(CharHead._professionNameText_);
			}
			if(this._unionName_)
			{
				_this.addChild(CharHead._unionNameText_);
			}
			if(this._professionName_ && this._professionNameVisible_)
			{
				with(CharHead._professionNameText_);
				{
					textColor = this.professionNameColor;
					this.width = 200;
					htmlText = this._professionName_;
					this.width = (textWidth + 4);
					this.x = (-(this.width) / 2);
					this.height = (textHeight + 4);
					this.y = 0;
				}
			}
			if(this._unionName_ && this._unionNameVisible_)
			{
				with(CharHead._unionNameText_);
				{
					textColor = 0xFFFFFF;
					this.width = 200;
					htmlText = this._unionName_;
					this.width = (textWidth + 4);
					this.x = (-(this.width) / 2);
					this.height = (textHeight + 4);
				}
				if(this._professionName_ && this._unionNameVisible_)
				{
					CharHead._unionNameText_.y = CharHead._professionNameText_.textHeight + 2;
				}
				else
				{
					CharHead._unionNameText_.y = 0;
				}
			}
			if(this._name_ && this._nameVisible_)
			{
				with(CharHead._nameText_);
				{
					textColor = this.nameColor;
					this.width = 200;
					htmlText = this._name_;
					this.width = (textWidth + 4);
					this.x = (-(this.width) / 2);
					this.height = (textHeight + 4);
					if(this._unionName_ && this._nameVisible_)
					{
						this.y = CharHead._unionNameText_.y + CharHead._unionNameText_.textHeight + 2;
					}
					else
					{
						if(this._professionName_ && this._professionNameVisible_)
						{
							this.y = CharHead._professionNameText_.y + CharHead._professionNameText_.textHeight + 2;
						}
						else
						{
							this.y = 0;
						}
					}
				}
			}
			if(this._bloodKitVisible_)
			{
				with(CharHead._bloodText_);
				{
					CharHead.defaultTextFormat = new flash.TextFormat("宋体",12,0xFFFFFF);
					this.filters = com.coder.global.EngineGlobal.textFilter;
					this.width = 200;
					text = this._currBlood_ + "/" + this._maxBlood_;
					this.width = textWidth + 4;
					this.x = -this.width / 2 + 1;
					this.height = textHeight + 4;
					if(CharHead._nameText_)
					{
						this.y = CharHead._nameText_.y + CharHead._nameText_.textHeight + 4;
					}
					else
					{
						if(CharHead._unionNameText_)
						{
							this.y = CharHead._unionNameText_.y + CharHead._unionNameText_.textHeight + 2;
						}
						else
						{
							if(CharHead._professionNameText_)
							{
								this.y = CharHead._professionNameText_.y + CharHead._professionNameText_.textHeight + 2;
							}
						}
					}
				}
				with(CharHead._blood_);
				{
					this.width = 46;
					this.height = 5;
					setValue(this._currBlood_,this._maxBlood_);
					this.x = (-(this.width) / 2);
					this.y = ((CharHead._bloodText_.y + 16) + 2);
				}
				with(CharHead._nei_);
				{
					this.width = 46;
					this.height = 5;
					setValue(this._currNei_,this._maxNei_);
					this.x = -this.width / 2;
					this.y = CharHead._blood_.y + 4;
				}
			}
			var rect:egret.Rectangle = flash.getBounds(CharHead._sprite_,null);
			rect.height = CharHead._sprite_.height;
			rect.width = CharHead._sprite_.width;
			var pass:boolean = true;
			if(rect.isEmpty())
			{
				pass = false;
			}
			var mat:flash.Matrix = new flash.Matrix();
			mat.tx = -rect.x;
			mat.ty = -rect.y;
			if(!this.bmd)
			{
				this.bmd = new flash.BitmapData(CharHead._sprite_.width + 2,CharHead._sprite_.height + 2,true,0);
				this.bmd["draw" + ""](CharHead._sprite_,mat);
			}
			if(CharHead._nameText_.parent)
			{
				CharHead._nameText_.parent.removeChild(CharHead._nameText_);
			}
			if(CharHead._professionNameText_.parent)
			{
				CharHead._professionNameText_.parent.removeChild(CharHead._professionNameText_);
			}
			if(CharHead._unionNameText_.parent)
			{
				CharHead._unionNameText_.parent.removeChild(CharHead._unionNameText_);
			}
			if(CharHead._blood_.parent)
			{
				CharHead._blood_.parent.removeChild(CharHead._blood_);
			}
			if(pass)
			{
				mat = new flash.Matrix();
				mat.tx = rect.x;
				mat.ty = -this.bmd.height;
				this.graphics["beginBitmapFill" + ""](this.bmd,mat,false);
				this.graphics.drawRect(mat.tx,mat.ty,this.bmd.width,this.bmd.height);
				this._topIndexY = -this.bmd.height;
			}
			else
			{
				this._topIndexY = 0;
			}
			if(this.cacheMode)
			{
				CharHead.cacheBmdHash["put" + ""]((this._name_ + this._nameColor_),this.bmd["clone" + ""]());
			}
			if(this._headIconLeft)
			{
				this._headIconLeft.y = -this._headIconSize / 2;
				this._headIconLeft.x = CharHead._blood_.width_com_coder_core_displays_world_char_BloodKit - this._headIconSize - 5;
				if(this._headIconLeft.width > 0)
				{
					this._headIconLeft.x = mat.tx - this._headIconLeft.width - 1;
				}
				if(!this._headIconLeft.parent)
				{
					this.addChild(this._headIconLeft);
				}
			}
			if(this._flag)
			{
				if(this._headIconLeft)
				{
					this._flag.x = this._headIconLeft.x - this._headIconSize - 5;
					if(this._flag.width > 0)
					{
						this._flag.x = this._headIconLeft.x - this._flag.width - 1;
					}
				}
				else
				{
					this._flag.x = ((mat.tx - this._headIconSize) - 5);
					if(this._flag.width > 0)
					{
						this._flag.x = CharHead._blood_.width_com_coder_core_displays_world_char_BloodKit - this._flag.width - 1;
					}
				}
				this._flag.y = -this._headIconSize / 2;
				if(!this._flag.parent)
				{
					this.addChild(this._flag);
				}
			}
			if(this._headIconRight)
			{
				this._headIconRight.y = -this._headIconSize / 2;
				this._headIconRight.x = CharHead._blood_.width_com_coder_core_displays_world_char_BloodKit - this._headIconSize + 5;
				if(this._headIconRight.width > 0)
				{
					CharHead._blood_.width_com_coder_core_displays_world_char_BloodKit - this._headIconRight.width;
				}
				if(!this._headIconRight.parent)
				{
					this.addChild(this._headIconRight);
				}
			}
			if(this._headIconCenter)
			{
				this._headIconCenter.y = -this.bmd.height;
				this._headIconCenter.x = 0;
				if(!this._heidTitle && !this._headIconCenter.parent)
				{
					this.addChild(this._headIconCenter);
				}
				this._topIndexY = this._headIconCenter.y - this._headIconCenter.height;
			}
			if(this._topIcon && this.topIdName && !this._topIcon.parent_com_coder_core_displays_avatar_AvatarEffect)
			{
				this.addChild(this._topIcon);
			}
			if(this._topImage && !this._topImage.parent)
			{
				this.addChild(this._topImage);
			}
			this.updateEffectPos();
		}

		public updateEffectPos()
		{
			var offsetY:number = 0;
			if(this._topIcon)
			{
				this._topIcon.y = this._topIndexY;
			}
			if(this._topImage)
			{
				if(this._topIcon)
				{
					this._topImage.y = this._topIndexY - this._topIcon.height;
				}
				else
				{
					this._topImage.y = this._topIndexY;
				}
			}
			if(this._wordShape_ && this._wordShape_.parent)
			{
				if(this._topImage)
				{
					offsetY = this._topImage.y;
				}
				else
				{
					if(this._topIcon)
					{
						offsetY = this._topIcon.y;
					}
					else
					{
						offsetY = this._topIndexY;
					}
				}
				this._wordShape_.y = -this._wordShape_.height + offsetY;
				this._wordShape_.x = -this._wordShape_.width / 2;
			}
		}

		public recover()
		{
			if(this.bmd)
			{
				this.bmd.dispose();
			}
			this.graphics.clear();
			while(CharHead._sprite_.numChildren)
			{
				CharHead._sprite_.removeChildAt(0);
			}
			if(this._flag && this._flag.parent)
			{
				this._flag.parent.removeChild(this._flag);
			}
			if(this._headIconLeft && this._headIconLeft.parent)
			{
				this._headIconLeft.parent.removeChild(this._headIconLeft);
			}
			if(this._headIconRight && this._headIconRight.parent)
			{
				this._headIconRight.parent.removeChild(this._headIconRight);
			}
			if(this._headIconCenter && this._headIconCenter.parent)
			{
				this._headIconCenter.parent.removeChild(this._headIconCenter);
			}
			if(this._topIcon && this._topIcon.parent_com_coder_core_displays_avatar_AvatarEffect)
			{
				this._topIcon.parent_com_coder_core_displays_avatar_AvatarEffect.removeChild(this._topIcon);
			}
			this._bloodKitVisible_ = false;
			this._currBlood_ = 0;
			this._maxBlood_ = 0;
			this._name_ = "";
			this._nameVisible_ = false;
			this._nameColor_ = 0xFFFFFF;
			this._professionName_ = "";
			this._professionNameColor_ = 0xFFFFFF;
			this._professionNameVisible_ = false;
			this._nameVisible_ = false;
			if(this._tile)
			{
				if(this._tile.parent)
				{
					this._tile.parent.removeChild(this._tile);
				}
				this._tile.dispose();
				this._tile = null;
			}
			if(this._wordShape_)
			{
				if(this._wordShape_.parent)
				{
					this._wordShape_.parent.removeChild(this._wordShape_);
				}
				this._wordShape_.dispose();
				this._wordShape_ = null;
			}
		}

		public resetForDisposed()
		{
			this.graphics.clear();
			this._headIconSize = 30;
			this._disposed_ = false;
			this._nameColor_ = 0;
			this._professionNameColor_ = 0;
			this._unionColor_ = 0;
			this._professionNameVisible_ = false;
			this._nameVisible_ = false;
			this._unionNameVisible_ = false;
			this._bloodKitVisible_ = false;
			this._owner_ = null;
			this._currBlood_ = 0;
			this._maxBlood_ = 0;
			this.bmd = null;
			this._neiKitVisible_ = false;
			this._currNei_ = 0;
			this._maxNei_ = 0;
			this._topIndexY = 0;
			this._isDisposed = false;
			this._heidTitle = false;
			this._isCharNameBitmapMode = false;
			if(this._tile)
			{
				if(this._tile.parent)
				{
					this._tile.parent.removeChild(this._tile);
				}
				this._tile.dispose();
			}
			this._tile = null;
			super.resetForDisposed();
			this.init();
		}

		public dispose()
		{
			com.coder.core.controls.elisor.HeartbeatFactory.getInstance().removeFrameOrder(flash.bind(this.onEnterFrameFunc,this));
			this.graphics.clear();
			this.char_id = null;
			this._disposed_ = true;
			this._headIconSize = 0;
			this._isDisposed = true;
			this._name_ = null;
			this._unionName_ = null;
			this._professionName_ = null;
			this._nameColor_ = 0;
			this._professionNameColor_ = 0;
			this._unionColor_ = 0;
			this._professionNameVisible_ = false;
			this._nameVisible_ = false;
			this._unionNameVisible_ = false;
			this._bloodKitVisible_ = false;
			this._owner_ = null;
			this._currBlood_ = 0;
			this._maxBlood_ = 0;
			this.bmd = null;
			this.x = 0;
			this.y = 0;
			this.oid = null;
			this._neiKitVisible_ = false;
			this._currNei_ = 0;
			this._maxNei_ = 0;
			this._topIndexY = 0;
			if(this._headIconLeft)
			{
				if(this._headIconLeft.parent)
				{
					this._headIconLeft.parent.removeChild(this._headIconLeft);
				}
				this._headIconLeft = null;
			}
			if(this._headIconRight)
			{
				if(this._headIconRight.parent)
				{
					this._headIconRight.parent.removeChild(this._headIconRight);
				}
				this._headIconRight = null;
			}
			if(this._headIconCenter)
			{
				if(this._headIconCenter.parent)
				{
					this._headIconCenter.parent.removeChild(this._headIconCenter);
				}
				this._headIconCenter = null;
			}
			if(this._flag)
			{
				if(this._flag.parent)
				{
					this._flag.parent.removeChild(this._flag);
				}
				this._flag = null;
			}
			this._headBitmapData = null;
			if(this._topIcon)
			{
				if(this._topIcon.parent_com_coder_core_displays_avatar_AvatarEffect)
				{
					this._topIcon.parent_com_coder_core_displays_avatar_AvatarEffect.removeChild(this._topIcon);
				}
				this._topIcon.dispose();
				this._topIcon = null;
			}
			if(this._topImage)
			{
				if(this._topImage.parent)
				{
					this._topIcon.parent_com_coder_core_displays_avatar_AvatarEffect.removeChild(this._topImage);
				}
				this._topImage.dispose();
				this._topImage = null;
			}
			if(this._tile)
			{
				if(this._tile.parent)
				{
					this._tile.parent.removeChild(this._tile);
				}
				this._tile.dispose();
				this._tile = null;
			}
			if(this._wordShape_)
			{
				if(this._wordShape_.parent)
				{
					this._wordShape_.parent.removeChild(this._wordShape_);
				}
				this._wordShape_.dispose();
				this._wordShape_ = null;
			}
			if(this.parent)
			{
				this.parent.removeChild(this);
			}
			super.dispose();
			if(CharHead.charHeadQueue.length < com.coder.engine.Asswc.POOL_INDEX)
			{
				CharHead.charHeadQueue.push(this);
			}
		}

		public get isSaying():boolean
		{
			if(this._wordShape_ && this._wordShape_.parent)
			{
				return true;
			}
			return false;
		}

	}
}

CharHead.intanceHash = new Array<CharHead>();
CharHead.cacheBmdHash = new Hash();
CharHead.charHeadQueue = [];
CharHead.defaultTextFormat = new flash.TextFormat("宋体",12);
CharHead._blood_ = new BloodKit();
CharHead._nei_ = new BloodKit(0xFFFF00);
CharHead._nameText_ = new flash.TextField();
CharHead._professionNameText_ = new flash.TextField();
CharHead._unionNameText_ = new flash.TextField();
CharHead._sprite_ = new egret.Sprite();
CharHead._bloodText_ = new flash.TextField();
CharHead._renderNum_ = 1;
CharHead._renderIndex_ = 0;
