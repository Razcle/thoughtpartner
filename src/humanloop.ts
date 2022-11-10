import { request } from "obsidian";

export interface GenerateResponse {
  //   [any: string]: string;
  data: { output: string; raw_output: string; id: string }[];
}

export interface FeedbackResponse {
  [any: string]: string;
}

export const generate = async (
  body: any,
  api_key: string
): Promise<GenerateResponse> => {
  console.log("generate", body);
  let response;
  try {
    response = JSON.parse(
      await request({
        url: "https://api.humanloop.com/v2/generate",
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
  const text = response.data[0]?.raw_output;
  return text;
};

export const feedback = async (
  body: {
    data_id: string;
    label: string;
    group: string;
    user: string;
  },
  api_key: string
): Promise<FeedbackResponse> => {
  console.log("feedback", body);
  let response;
  try {
    response = JSON.parse(
      await request({
        url: "https://api.humanloop.com/v2/feedback",
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
