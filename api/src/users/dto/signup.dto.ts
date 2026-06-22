import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

// 가입: 이름 + (휴대폰 또는 이메일 중 하나 필수)
export class SignupDto {
  @IsString()
  @MinLength(1)
  name!: string;

  // email 이 없으면 phone 필수
  @ValidateIf((o: SignupDto) => !o.email)
  @IsString()
  @MinLength(1)
  phone?: string;

  // phone 이 없으면 email 필수
  @ValidateIf((o: SignupDto) => !o.phone)
  @IsEmail()
  email?: string;
}
