import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { compare } from 'bcryptjs'
import { Model } from 'mongoose'
import { LoginUserDTO, RegisterUserDTO, UpdateProfileDTO } from 'src/dto/auth.dto'
import { Profile } from 'src/models/profile.model'
import { User } from 'src/models/user.model'
import cloudinary from 'src/utils/Cloudinary'

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(Profile.name) private ProfileModel: Model<Profile>,
        private jwtService: JwtService
    ) { }

    async registerUser(data: RegisterUserDTO) {
        const checkUser = await this.UserModel.findOne({ email: data.email.toLowerCase() })
        if (checkUser) {
            throw new BadRequestException("User Alrealdy Exist with this Email")
        }

        const user = await this.UserModel.create({
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
        })

        const token = this.jwtService.sign({ userId: user._id, type: data.role }, { expiresIn: '30d' })

        return {
            msg: `Register successfully as ${data.role}`,
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
            msg: `Login successfully`,
            token
        }
    }

    async profileUser(id: string, role: string) {
        const user = await this.UserModel.findById(id).select("name email role -_id")
        const profile = {}

        const existProfile = await this.ProfileModel.findOne({ user: id })

        if (!existProfile) {
            const profileData = await this.ProfileModel.create({
                user: id
            })
            profile['avatar'] = profileData.avatar.uri
            profile['isEmailVerified'] = profileData.isEmailVerified
            profile['address'] = profileData.address
            profile['bio'] = profileData.bio
        } else {
            profile['avatar'] = existProfile.avatar.uri
            profile['isEmailVerified'] = existProfile.isEmailVerified
            profile['address'] = existProfile.address
            profile['bio'] = existProfile.bio
        }

        return { ...user?.toObject(), ...profile }
    }

    async avatarUpdate(file: Express.Multer.File, id: string) {
        const profileImage = await cloudinary.uploader.upload(file.path, {
            folder: 'event-planner'
        })

        const userProfile = await this.ProfileModel.findOne({ user: id })
        if (userProfile?.avatar?.public_id) {
            await cloudinary.uploader.destroy(userProfile?.avatar?.public_id)
        }

        const profiled = await this.ProfileModel.findByIdAndUpdate({ user: id }, {
            avatar: {
                uri: profileImage.secure_url,
                public_id: profileImage.public_id
            }
        })

        return {
            msg: 'Avatar Update Successfully',
            profiled
        }
    }

    async profileUpdate(data: UpdateProfileDTO) {
        return {
            msg: 'Hello World'
        }
    }
}
