import { IsString } from 'class-validator';

export class TranslateDto {
  @IsString()
  readonly prompt: string;

  @IsString()
  readonly language: string;
}
