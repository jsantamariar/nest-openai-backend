import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  checkCompleteStatusUseCase,
  createQuestionUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessageListUseCase,
} from './user-cases';
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class AssistantTestService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThreadUseCase(this.openai);
  }

  async userQuestion(questionDto: QuestionDto) {
    const { threadId, question } = questionDto;

    await createQuestionUseCase(this.openai, {
      threadId,
      question,
    });

    const run = await createRunUseCase(this.openai, { threadId });

    await checkCompleteStatusUseCase(this.openai, {
      runId: run.id,
      threadId: threadId,
    });

    const messages = await getMessageListUseCase(this.openai, { threadId });

    return messages;
  }
}
