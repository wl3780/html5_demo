module engine {
	export class ByteArrayUtil extends egret.HashObject {

		public constructor()
		{
			super();
		}

		public static readInt(bytes:egret.ByteArray):number
		{
			var temp:number = ByteArrayUtil.readVarint32(bytes);
			return ByteArrayUtil.decodeZigZag32(temp);
		}

		public static writeInt(bytes:egret.ByteArray, value:number)
		{
			var temp:number = ByteArrayUtil.encodeZigZag32(value);
			ByteArrayUtil.writeVarint32(bytes,temp);
		}

		private static readVarint32(bytes:egret.ByteArray):number
		{
			var result:number = 0;
			var next:number = 0;
			for(var i:number = 0;i < 5; i++)
			{
				next = bytes.readByte();
				result |= (next & 127) << (7 * i);
				if(!(next & 128))
				{
					break;
				}
			}
			return result;
			next = bytes.readByte();
			if(next >= 0)
			{
				return next;
			}
			result = next & 127;
			next = bytes.readByte();
			if(next >= 0)
			{
				result |= next << 7;
			}
			else
			{
				result |= (next & 127) << 7;
				next = bytes.readByte();
				if(next >= 0)
				{
					result |= next << 14;
				}
				else
				{
					result |= (next & 127) << 14;
					next = bytes.readByte();
					if(next >= 0)
					{
						result |= next << 21;
					}
					else
					{
						result |= (next & 127) << 21;
						next = bytes.readByte();
						if(next >= 0)
						{
							result |= next << 28;
						}
					}
				}
			}
			return result;
		}

		private static writeVarint32(bytes:egret.ByteArray, value:number)
		{
			while(value > 127)
			{
				bytes.writeByte((value & 127) | 128);
				value = value >>> 7;
			}
			bytes.writeByte(value & 127);
			return ;
			if(value < (1 << 7))
			{
				bytes.writeByte(value);
			}
			else if(value < (1 << 14))
			{
				bytes.writeByte(value | 128);
				bytes.writeByte(value >>> 7);
			}
			else if(value < (1 << 21))
			{
				bytes.writeByte(value | 128);
				bytes.writeByte((value >>> 7) | 128);
				bytes.writeByte(value >>> 14);
			}
			else if(value < (1 << 28))
			{
				bytes.writeByte(value | 128);
				bytes.writeByte((value >>> 7) | 128);
				bytes.writeByte((value >>> 14) | 128);
				bytes.writeByte(value >>> 21);
			}
			else
			{
				bytes.writeByte(value | 128);
				bytes.writeByte((value >>> 7) | 128);
				bytes.writeByte((value >>> 14) | 128);
				bytes.writeByte((value >>> 21) | 128);
				bytes.writeByte(value >>> 28);
			}
		}

		public static encodeZigZag32(value:number):number
		{
			return (value << 1) ^ (value >> 31);
		}

		public static decodeZigZag32(value:number):number
		{
			return (value >>> 1) ^ -(value & 1);
		}

	}
}

