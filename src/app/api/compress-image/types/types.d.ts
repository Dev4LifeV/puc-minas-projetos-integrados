// types/tinify.d.ts
declare module "tinify" {
  interface CompressResult {
    toBuffer(): Promise<Buffer>;
  }

  function fromFile(path: string): CompressResult;

  const tinify: {
    key: string;
    fromFile: typeof fromFile;
    AccountError: typeof Error;
    ClientError: typeof Error;
    ServerError: typeof Error;
  };

  export = tinify;
}
