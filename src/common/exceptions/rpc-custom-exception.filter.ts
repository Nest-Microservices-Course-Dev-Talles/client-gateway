import {
  Catch,
  // RpcExceptionFilter,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';
// import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
// implements RpcExceptionFilter<RpcException>
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const rpcError: any = exception.getError();
    console.log(rpcError);

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
      return response.status(status).json(rpcError);
    }
    // const status = exception.getError().status || 500;

    response.status(400).json({
      status: 400,
      message: rpcError,
    });

    // response.status(rpcError.status).json(rpcError);
  }
}
