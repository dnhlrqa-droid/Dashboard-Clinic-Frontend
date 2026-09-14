import type { teethTreated } from "../types/Types";
import { MESSAGES } from "./constants";





export function hasMessage(data: unknown): data is {message: string}{
   return (
      typeof data === "object" && data !== null &&
      "message" in data && 
      typeof (data as {message: unknown}).message === "string"
   )
};

export function validateTeethTreated(teeth: teethTreated[]): string | null {
      for(let i = 0; i < teeth.length; i++){
          const tooth = teeth[i];
        if(
            tooth.toothNumber <= 0 ||
            tooth.procedure === "" ||
            tooth.newToothCondition === "" ||
            tooth.cost <= 0
           ) return MESSAGES.ERROR_ENTER_INPUTS;
      }
      return null;
};


export function errorCatch(error: unknown) {
   const errorMessage = error as {error: string, status: string};
   const Error = error as {status: boolean | number, data: {status: boolean | string, message: string}};

      if(errorMessage.status === "ETCH_ERROR") return errorMessage.error;
      if(errorMessage.status === "TIMEOUT_ERROR") return MESSAGES.ERROR_NETWORK;

      if(Error.status === 429) return Error.data.message;
      if(Error.status === 500) return Error.data.message;

      return MESSAGES.ERROR_SERVER
   
};