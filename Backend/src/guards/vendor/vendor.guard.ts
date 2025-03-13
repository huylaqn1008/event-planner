import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class VendorGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest()
      if(request.type!=="vendor"){
        throw new UnauthorizedException("Only Vendors can access this Route")
      }

      return true
    } catch (error) {
      throw new UnauthorizedException("User Can not access This Route")
    }
  }
}
