// controller 시작전과 시작후를 동작할 일이 있을 때 사용하거나
// controller 다음에 어떤 작업을 할 때 사용함
// 예를들어 controller 끝에 res.json으로 리턴값을 보내고 나서
// 어떤 조작이 필요할 때 사용하면 좋음. 가끔 이런 일이 있음

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // return next 전에 controller 가기 전 부분
    // return next.handle()뒤에 마지막 데이터 핸들링 부분
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data)));
    //json에 undefined가 들어가면 에러가 날 수 있음
  }
}
