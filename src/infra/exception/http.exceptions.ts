import { HTTPStatusCode } from '../../constants/http-status-code.enum';
import { HTTPMessages } from '../../constants/http-messages.constants';
import createHttpError = require('http-errors');
import { response } from 'express';

export class BadRequestException {
  constructor(message = HTTPMessages.BAD_REQUEST) {
    throw createHttpError(HTTPStatusCode.BadRequest, message);
  }
}

export class UnauthorizedException {
  constructor(message = HTTPMessages.UNAUTHORIZED) {
    return response.json(createHttpError(HTTPStatusCode.Unauthorized, message)) 
  }
}

export class NotFoundException {
  constructor(message = HTTPMessages.NOT_FOUND) {
    throw  createHttpError(HTTPStatusCode.NotFound, message);
  }
}

export class ConflictException {
  constructor(message = HTTPMessages.CONFLICT) {
    throw createHttpError(HTTPStatusCode.Conflict, message);
  }
}

export class UnprocessableEntityException {
  constructor(message = HTTPMessages.UNPROCESSABLE_ENTITY) {
    throw createHttpError(HTTPStatusCode.UnprocessableEntity, message);
  }
}

export class TooManyRequestsException {
  constructor(message = HTTPMessages.TOO_MANY_REQUESTS) {
    throw createHttpError(HTTPStatusCode.TooManyRequests, message);
  }
}

export class InternalServerErrorException {
  constructor(message = HTTPMessages.INTERNAL_SERVER_ERROR) {
    throw createHttpError(HTTPStatusCode.InternalServerError, message);
  }
}

export class BadGatewayException {
  constructor(message = HTTPMessages.BAD_GATEWAY) {
    throw createHttpError(HTTPStatusCode.BadGateway, message);
  }
}