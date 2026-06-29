import { IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// 브라우저 PushSubscription.toJSON() = { endpoint, keys: { p256dh, auth } }
class SubscriptionKeys {
  @IsString()
  @MinLength(1)
  p256dh!: string;

  @IsString()
  @MinLength(1)
  auth!: string;
}

export class SaveSubscriptionDto {
  @IsString()
  @MinLength(1)
  endpoint!: string;

  @ValidateNested()
  @Type(() => SubscriptionKeys)
  keys!: SubscriptionKeys;
}
