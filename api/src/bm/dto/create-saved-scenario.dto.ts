import { IsArray, IsNumber, IsObject, IsOptional, IsString, MinLength } from 'class-validator';

// /bm/simulator 저장 시나리오(v1.3 §11) 신규 등록
export class CreateBmSavedScenarioDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  linkedBm!: string;

  @IsObject()
  inputs!: Record<string, number>;

  @IsArray()
  @IsString({ each: true })
  enabledFeatures!: string[];

  @IsNumber()
  monthly!: number;

  @IsNumber()
  arr!: number;

  @IsString()
  @MinLength(1)
  assumptionStatus!: string;

  @IsString()
  @MinLength(1)
  assumptionVersion!: string;

  @IsOptional()
  @IsString()
  memo?: string;
}
