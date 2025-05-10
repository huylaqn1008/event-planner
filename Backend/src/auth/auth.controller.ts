import { Body, Controller, Get, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { LoginUserDTO, RegisterUserDTO, UpdateProfileDTO } from 'src/dto/auth.dto'
import { AuthService } from './auth.service'
import { AuthGuard } from './auth.guard'
import { VendorGuard } from 'src/guards/vendor/vendor.guard'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    async registerUser(@Body() data: RegisterUserDTO) {
        const res_obj = await this.authService.registerUser(data)
        return res_obj
    }

    @Post('/login')
    async loginUser(@Body() data: LoginUserDTO) {
        const res_obj = await this.authService.loginUser(data)
        return res_obj
    }

    @Get('/profile')
    @UseGuards(AuthGuard)
    async profileUser(@Req() req) {
        const res_obj = await this.authService.profileUser(req.user, req.type)
        return res_obj
    }

    @Put('/update-avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async avatarUpdate(@UploadedFile() file: Express.Multer.File, @Req() req) {
        const res_obj = await this.authService.avatarUpdate(file, req.user)
        return res_obj
    }

    @Put('/update-profile')
    @UseGuards(AuthGuard)
    async profileUpdate(@Body() data:UpdateProfileDTO) {
        const res_obj = await this.authService.profileUpdate(data)
        return res_obj
    }
}
