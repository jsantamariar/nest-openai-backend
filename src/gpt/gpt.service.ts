import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
} from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDiscusser(prosConsDiscusser: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openai, {
      prompt: prosConsDiscusser.prompt,
    });
  }

  async prosConsDiscusserStream(prosConsDiscusser: ProsConsDiscusserDto) {
    return await prosConsDiscusserStreamUseCase(this.openai, {
      prompt: prosConsDiscusser.prompt,
    });
  }
}
