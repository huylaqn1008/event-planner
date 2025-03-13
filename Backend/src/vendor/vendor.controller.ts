import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/auth.guard'
import { VendorGuard } from 'src/guards/vendor/vendor.guard'

@Controller('/api/v1/vendor')
@UseGuards(AuthGuard, VendorGuard)

export class VendorController {
    @Get("/")
    hello(){
        return "hello vendor"
    }
}
