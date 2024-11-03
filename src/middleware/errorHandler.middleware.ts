import { type NextFunction, type Request, type Response } from 'express'
import { Message } from '../constant/messages'

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.log('🚀 ~ errorHandler ~ error:', error)
  let statusCode = 500
  let data = {
    status: false,
    message: Message.error,
    originalError: error.message,
  }
  if (error?.isOperational || error?.isCustom) {
    statusCode = error.statusCode
    data = {
      ...data,
      message: error.message,
    }
  }

  return res.status(statusCode).json(data)
}
