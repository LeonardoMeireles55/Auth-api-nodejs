export interface IHTTPError extends Error {
    statusCode: number;
  }
  
  export interface IMariaDbError extends Error {
    code: number;
  }