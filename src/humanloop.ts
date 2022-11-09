import { request } from "obsidian";

export interface GenerateResponse {
  //   [any: string]: string;
  logs: { output: string; id: string }[];
}

export interface FeedbackResponse {
  [any: string]: string;
}

export const generate = async (
  body: any,
  api_key: string
): Promise<GenerateResponse> => {
  let response;
  try {
    response = JSON.parse(
      await request({
        url: "https://api.humanloop.com/v1/generate",
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": api_key,
        },
      })
    );
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
  return response;
};

export const extractText = (response: GenerateResponse): string => {
  const text = response.logs[0]?.output;
  return text;
};

export const feedback = async (
  body: any,
  api_key: string
): Promise<FeedbackResponse> => {
  console.log("feedback", body);
  let response;
  try {
    response = JSON.parse(
      await request({
        url: "https://api.humanloop.com/v1/feedback",
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": api_key,
        },
      })
    );
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
  return response;
};
