import { Module } from '@nestjs/common';
import { AssistantTestService } from './assistant-test.service';
import { AssistantTestController } from './assistant-test.controller';

@Module({
  controllers: [AssistantTestController],
  providers: [AssistantTestService],
})
export class AssistantTestModule {}
