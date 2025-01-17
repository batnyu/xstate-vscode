import { createMachine } from "xstate";
import { parseMachinesFromFile } from "xstate-parser-demo";
import {
  DocumentValidationsResult,
  filterOutIgnoredMachines,
  introspectMachine,
} from ".";

export const getDocumentValidationsResults = (
  text: string,
): DocumentValidationsResult[] => {
  return filterOutIgnoredMachines(parseMachinesFromFile(text)).machines.map(
    (parseResult) => {
      if (!parseResult) {
        return {
          documentText: text,
        };
      }

      const config = parseResult.toConfig();
      try {
        const machine: any = createMachine(config as any);
        const introspectionResult = introspectMachine(machine as any);
        return {
          parseResult,
          machine,
          introspectionResult,
          documentText: text,
        };
      } catch (e) {
        return {
          parseResult,
          documentText: text,
        };
      }
    },
  );
};
