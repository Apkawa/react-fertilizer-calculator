import {JSONFormat} from "./json";
import {HPGFormat} from "./hpg";

export const FORMATS = [
  JSONFormat,
  HPGFormat
]

export const FORMATS_MAP = Object.fromEntries(FORMATS.map(f => [f.ext, f]))
export const ACCEPT_FORMATS = FORMATS.map(f => f.ext).join(', ')
