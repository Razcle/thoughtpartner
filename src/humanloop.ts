import { request } from "obsidian";

export interface GenerateResponse {
  //   [any: string]: string;
  logs: { output: string; id: string }[];
}

export const generate = async (reqParams: any): Promise<GenerateResponse> => {
  let response;
  try {
    response = JSON.parse(await request(reqParams));
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

export const feedback = async (reqParams: any): Promise<void> => {
  console.log("feedback", reqParams);
  //   try {
  //     await request(reqParams);
  //   } catch (error) {
  //     console.log(error);
  //     return Promise.reject(error);
  //   }
};
