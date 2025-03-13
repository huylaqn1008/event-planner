import { Controller, Get, UseGuards } from '@nestjs/common'
import { AdminGuard } from 'src/auth/admin/admin.guard'
import { AuthGuard } from 'src/auth/auth.guard'

@Controller('/api/v1/admin')
@UseGuards(AuthGuard, AdminGuard)

export class AdminController {
    @Get("/")
    hello() {
        return "hello admin"
    }
}
