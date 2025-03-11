import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { hash } from "bcryptjs"
import { HydratedDocument } from "mongoose"

export type UserDocument = HydratedDocument<User>

@Schema({
    timestamps: true,
    versionKey: false
})

export class User {
    @Prop({
        required: true,
        trim: true,
        type: String
    })
    name: string

    @Prop({
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        type: String
    })
    email: string

    @Prop({
        required: true,
        trim: true,
        type: String
    })
    password: string

    @Prop({
        required: true,
        enum: ['user', 'admin', 'vendor']
    })
    role: string

    @Prop({
        default: '',
        type: String
    })
    address: string

    @Prop({
        type: Boolean,
        default: false
    })
    isEmailVerified: boolean

    @Prop({
        default: '',
        type: String
    })
    avatar: string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        this.password = await hash(user.password, 10)
    }
    next()
})