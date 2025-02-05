import OpenAI from 'openai';

interface Options {
  prompt: string;
  language: string;
}

export const translateUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, language } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 500,
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: `
          You are a translator. Translate into ${language} the following text: ${prompt}
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
