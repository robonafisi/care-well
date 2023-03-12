import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type Out = {
  message: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Out>
) {
  console.log('m', req.body.messages)
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: req.body.messages,
  });
  res.status(200).json({ message: completion.data.choices[0].message })
}