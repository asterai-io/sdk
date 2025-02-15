import { BinaryOperationInput, Output } from "./typegen/plugin";

export const add = (input: BinaryOperationInput): Output => {
  const result = input.a + input.b;
  // The `systemMessage` field is sent to the LLM.
  return {
    systemMessage: `the result is ${result}`,
  };
};
