import {ExportStateType} from "./types";

export abstract class BaseFormat {
  static ext: string
  abstract export(state: ExportStateType): string
  abstract import(string: string): ExportStateType


}
