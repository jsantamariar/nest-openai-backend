import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { GptService } from './gpt.service';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageGenerationVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  // Health check
  @Get('/ping')
  ping() {
    return 'pong';
  }

  // Orthography check
  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  // Pros and Cons Discusser
  @Post('pros-cons-discusser')
  prosConsDiscusser(@Body() ProsConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDiscusser(ProsConsDiscusserDto);
  }

  // Pros and Cons Discusser Stream
  @Post('pros-cons-discusser-stream')
  async prosConsDiscusserStream(
    @Body() ProsConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDiscusserStream(ProsConsDiscusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      res.write(piece);
    }

    res.end();
  }

  // Translate
  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }

  // Text to Audio
  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudio: TextToAudioDto,
    @Res() response: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudio);

    response.setHeader('Content-Type', 'audio/mp3');
    response.status(HttpStatus.OK);
    response.sendFile(filePath);
  }

  // Text to Audio Getter
  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() response: Response,
    @Param('fileId') fileId: string,
  ) {
    const filePath = await this.gptService.textToAudioGetter(fileId);

    response.setHeader('Content-Type', 'audio/mp3');
    response.status(HttpStatus.OK);
    response.sendFile(filePath);
  }

  // Audio to Text
  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().toISOString()}.${fileExtension}`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5MB',
          }),
          new FileTypeValidator({ fileType: 'audio/*' }),
        ],
      }),
    )
    audioFile: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return this.gptService.audioToText(audioFile, audioToTextDto);
  }

  // Images Generation
  @Post('image-generation')
  async imagesGeneration(@Body() imagesGenerationDto: ImageGenerationDto) {
    return await this.gptService.imageGeneration(imagesGenerationDto);
  }

  // Images Generation Getter
  @Get('image-generation/:imageId')
  async imagesGenerationGetter(
    @Param('imageId') imageId: string,
    @Res() response: Response,
  ) {
    const filePath = await this.gptService.imageGenerationGetter(imageId);
    response.status(HttpStatus.OK);
    response.sendFile(filePath);
  }

  // Images Generation Variation
  @Post('image-generation-variation')
  async imagesGenerationVariation(
    @Body() imagesGenerationVariationDto: ImageGenerationVariationDto,
  ) {
    return await this.gptService.imageGenerationVariation(
      imagesGenerationVariationDto,
    );
  }
}
