import { Output } from "./typegen/plugin";

export const add = (a: number, b: number): Output => {
  console.log("running plugin. a + b = ", a + b);
  return {
    value: a + b,
  };
};
