import { Body, Controller, Post } from '@nestjs/common';
import { AssistantTestService } from './assistant-test.service';
import { QuestionDto } from './dtos/question.dto';

@Controller('assistant-test')
export class AssistantTestController {
  constructor(private readonly assistantTestService: AssistantTestService) {}

  @Post('create-thread')
  async createThread() {
    return this.assistantTestService.createThread();
  }

  @Post('user-question')
  async userQuestion(@Body() questionDto: QuestionDto) {
    return this.assistantTestService.userQuestion(questionDto);
  }
}
