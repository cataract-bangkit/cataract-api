const response = (status: string, message: string | string[], rest: any) => {
  return {
    status,
    message,
    ...rest
  }
}

export const success = (message: string, data?: any) => response("success", message, {data})

export const fail = (message: string | string[], code?: string) => response("fail", message, {code})

export enum ResponseErrorCode {
  ERR_0 = "ERR_0",
  ERR_1 = "ERR_1",
  ERR_2 = "ERR_2",
  ERR_3 = "ERR_3",
  ERR_4 = "ERR_4",
  ERR_5 = "ERR_5",
  ERR_6 = "ERR_6"
}