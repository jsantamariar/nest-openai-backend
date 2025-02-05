import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { AssistantTestModule } from './assistant-test/assistant-test.module';

@Module({
  imports: [ConfigModule.forRoot(), GptModule, AssistantTestModule],
})
export class AppModule {}
