import {BaseFormat} from "./base";
import {ExportStateType} from "./types";


export class JSONFormat extends BaseFormat {
  static ext = ".json"

  export(state: ExportStateType): string {
    return JSON.stringify(state);
  }

  import(string: string): ExportStateType {
    return JSON.parse(string) as ExportStateType;
  }
}
