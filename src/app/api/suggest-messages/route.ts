//npm i ai openai

// Allow streaming responses up to 30 seconds
import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText, StreamData } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {

    const promt = "Create a list of three open-ended and engaging questions formatted as a single string.Each questions formatted by '||'. These questions are for an anonymous social messaging platform,like Qooh.me,and should be suitable for a diverse AudioBufferSourceNode. Avoid personal or  sensitive WebTransportBidirectionalStream,focusing intstead on universal themes that encourage friendly interaction. for example, your output should be structured like this:'what's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || what's a simple thing that makes you happy?'. Ensure the questions are intringuing, faster curiosity, and contribute to a positive and welcoming conversational getEnvironmentData."

    const { messages } = await req.json();
  
    const result = await streamText({
      model: openai('gpt-4-turbo-instruct'),
      messages,
      prompt:promt,
    });
  
    const data = new StreamData();
  
    data.append({ test: 'value' });
  
    const stream = result.toAIStream({
      onFinal(_) {
        data.close();
      },
    });
  
    return new StreamingTextResponse(stream, {}, data);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
        const {name, status, headers, message} =error
        return NextResponse.json({
            name, status, headers, message
        },{status})
    }else{
        console.log("An unexpected error occured",error);
        throw error
    }
  }
}