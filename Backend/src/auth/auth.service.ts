import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { RegisterUserDTO } from 'src/dto/auth.dto'
import { User } from 'src/models/user.model'

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private UserModel: Model<User>, private jwtService: JwtService) { }

    async registerUser(data: RegisterUserDTO) {
        const checkUser = await this.UserModel.findOne({ email: data.email.toLowerCase() })
        if (checkUser) {
            throw new BadRequestException("User Alrealdy Exist with this Email")
        }

        const user = await this.UserModel.create({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role
        })

        const token = this.jwtService.sign({ userId: user._id }, { expiresIn: '30d' })

        return {
            msg: "User Register Successfully",
            token
        }
    }
}
