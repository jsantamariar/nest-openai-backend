import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 100,
    temperature: 0.2,
    response_format: {
      type: 'json_object',
    },
    messages: [
      {
        role: 'system',
        content: `
          You will recieve texts in Spanish with possible orthography errors.
          Your task is to correct them and return the corrected text, 
          but you have to also provide the success rate of the user's orthography. 
          You must answer in English. 
          If there are any errors, you have to provide a congratulation message.
          You have to answer in JSON format.

          Example of output:
          {
            userScore: number,
            errors: string[], // ['error -> solution']
            message: string, // Use emojis and text to congratulate the user
          }
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const jsonResponse = JSON.parse(completion.choices[0].message.content);
  return jsonResponse;
};
