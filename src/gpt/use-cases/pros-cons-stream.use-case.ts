import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDiscusserStreamUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  return await openai.chat.completions.create({
    stream: true,
    model: 'gpt-4o-mini',
    max_tokens: 500,
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: `
            You will be given a question and your task is to give an answer with pros and cons,
            the answer must be in markdown format,
            the pros and cons must be in a list.
         
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });
};
