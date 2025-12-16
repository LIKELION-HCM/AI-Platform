/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "pdf-parse/lib/pdf-parse.js" {
  import type { Buffer } from "buffer";

  interface PDFParseData {
    text: string;
    numpages?: number;
    info?: any;
    metadata?: any;
    version?: string;
  }

  function pdfParse(dataBuffer: Buffer): Promise<PDFParseData>;

  export default pdfParse;
}
