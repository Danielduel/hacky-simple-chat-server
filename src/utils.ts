import { Option, some, none } from "fp-ts/Option";

export const nbsp = "\xa0";
export const parseJSON = <T>(data: string): Option<T> => {
  try {
    return some(JSON.parse(data));
  } catch (error) {
    // log?
    return none;
  }
}
