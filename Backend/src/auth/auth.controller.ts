import { Body, Controller, Post } from '@nestjs/common'
import { RegisterUserDTO } from 'src/dto/auth.dto'

@Controller('/api/v1/auth')
export class AuthController {
    @Post('/register')
    async registerUser(@Body() data:RegisterUserDTO){
        return data
    }
}
