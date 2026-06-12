import { google } from '@ai-sdk/google';
import { cohere } from '@ai-sdk/cohere';
import { mistral } from '@ai-sdk/mistral';
import { groq } from '@ai-sdk/groq';
import { createOllama } from 'ollama-ai-provider-v2';

const ollama = createOllama({
    baseURL: process.env.OLLAMA_HOST || "http://localhost:11434/api",
});

export const getModel = (modelName: string) => {
    const availableModels = {
        'gemini': google('gemini-2.5-flash'),
        'mistral': mistral('mistral-small-2603'),
        'cohere': cohere('command-a-03-2025'),
        'groq': groq('qwen/qwen3-32b'),
        'llama3.1': ollama('llama3.1'),
    };
    return availableModels[modelName as keyof typeof availableModels] || availableModels['mistral'];
};

export const AI_CONFIG = {
    maxDuration: 30,
    maxSteps: 7,
    systemMessage: `Você é Julia, uma assistente de saúde especializada. Seja prestativa, empática e profissional.`
} as const;
