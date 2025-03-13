import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { compare } from 'bcryptjs'
import { Model } from 'mongoose'
import { LoginUserDTO, RegisterUserDTO } from 'src/dto/auth.dto'
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

        const token = this.jwtService.sign({ userId: user._id, type: data.role }, { expiresIn: '30d' })

        return {
            msg: "User Register Successfully",
            token
        }
    }

    async loginUser(data: LoginUserDTO) {
        const check_exist = await this.UserModel.findOne({ email: data.email.toLowerCase() })
        if (!check_exist) {
            throw new BadRequestException("Account Not Found")
        }

        const isMatch = await compare(data.password, check_exist.password)
        if (!isMatch) {
            throw new BadRequestException("Invalid Credentials")
        }

        const token = this.jwtService.sign(
            {
                userId: check_exist._id,
                type: check_exist.role
            },
            {
                expiresIn: '30d'
            }
        )

        return {
            msg: `${check_exist.role} Login Successfully`,
            token
        }
    }

    async profileUser(id: string, role: string) {
        return {
            user: id,
            role
        }
    }
}
