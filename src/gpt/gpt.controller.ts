import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Get('/ping')
  ping() {
    return 'pong';
  }

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDiscusser(@Body() ProsConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDiscusser(ProsConsDiscusserDto);
  }

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
}
