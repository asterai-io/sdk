import { BinaryOperationInput } from "./generated/plugin";
import * as asterai from "asterai:host/api@0.1.0";

export const add = (input: BinaryOperationInput): number => {
  const result = input.a + input.b;
  // Send the calculation result to the agent.
  asterai.sendResponseToAgent(`the result is ${result}`);
  // This result is not seen by the agent, but it can be consumed by
  // other plugins calling this function.
  return result;
};
