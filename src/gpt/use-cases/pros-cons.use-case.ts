import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDiscusserUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
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

  return completion.choices[0].message;
};
