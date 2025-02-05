import { Injectable, NotFoundException } from '@nestjs/common';
import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';
import {
  audioToTextUseCase,
  imageGenerationUseCase,
  imageGenerationVariationUseCase,
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageGenerationVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Orthography check
  async orthographyCheck({ prompt }: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: prompt,
    });
  }

  // Pros and Cons Discusser
  async prosConsDiscusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openai, {
      prompt: prompt,
    });
  }

  // Pros and Cons Discusser Stream
  async prosConsDiscusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDiscusserStreamUseCase(this.openai, {
      prompt: prompt,
    });
  }

  // Translate
  async translate({ prompt, language }: TranslateDto) {
    return await translateUseCase(this.openai, {
      prompt: prompt,
      language: language,
    });
  }

  // Text to Audio
  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, {
      prompt: prompt,
      voice: voice,
    });
  }

  // Text to Audio Getter
  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios',
      `${fileId}.mp3`,
    );

    const wasFound = fs.existsSync(filePath);

    if (!wasFound)
      throw new NotFoundException(`Audio File ${fileId} not found`);

    return filePath;
  }

  // Audio to Text
  async audioToText(
    audioFile: Express.Multer.File,
    AudioToTextDto: AudioToTextDto,
  ) {
    const { prompt } = AudioToTextDto;

    return await audioToTextUseCase(this.openai, {
      prompt: prompt,
      audioFile: audioFile,
    });
  }

  // Image generation
  async imageGeneration({
    prompt,
    originalImage,
    maskImage,
  }: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, {
      prompt,
      originalImage,
      maskImage,
    });
  }

  async imageGenerationGetter(imageId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/images',
      `${imageId}`,
    );

    const wasFound = fs.existsSync(filePath);

    if (!wasFound) throw new NotFoundException(`Image ${imageId} not found`);

    return filePath;
  }

  async imageGenerationVariation({ baseImage }: ImageGenerationVariationDto) {
    return await imageGenerationVariationUseCase(this.openai, {
      baseImage,
    });
  }
}
