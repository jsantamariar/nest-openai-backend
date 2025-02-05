import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId = 'asst_OVQvQvmcCqELwamfy5Fxu8dQ' } = options;

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions: WARN: whatever added here will be overwritten
  });
  return run;
};
