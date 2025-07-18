
export type ErrorsModel<T> = {
  [P in keyof T]?: string[];
};

// export type HttpError<T> = ErrorsModel<T> | string;

// export function httpErrorToText(error: HttpError<any>, joinBy: string = ', ') {
//   return ((typeof (error) === 'string') ||
//     (error != null && error.toString() !== undefined && error.toString() !== '[object Object]')) ?
//     error.toString() : (Object.keys(error)
//       .filter(key => Array.isArray(error[key])).map(key => error[key].join(joinBy)).join(joinBy));
// }
// export function isErrorsModel<T>(error: HttpError<T>): error is ErrorsModel<T> {
//   return error && typeof error !== 'string' && Object.keys(error).length !== 0;
// }

// export function isValidationError<T>(error: HttpError<T>): boolean {
//   return isErrorsModel(error);
// }
