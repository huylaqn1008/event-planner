import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { HydratedDocument } from "mongoose"
import { User } from "./user.model"

export type ProfileDocument = HydratedDocument<Profile>

export type Address = {
    street?: string
}

interface Avatar {
    uri: string,
    public_id: string
}

@Schema({ timestamps: true, versionKey: false })
export class Profile {
    @Prop({
        required: true,
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    })
    user: User

    @Prop({
        default: { uri: "", public_id: "" },
        type: {}
    })
    avatar: Avatar

    @Prop({
        default: false, type: Boolean
    })
    isEmailVerified: boolean

    @Prop({
        default: {},
        type: {}
    })
    address: Address

    @Prop({
        default: '',
        type: String
    })
    bio: String

    @Prop({
        default: '',
        type: String,
        enum: ['male', 'female', 'other']
    })
    gender: String
}

export const ProfileSchema = SchemaFactory.createForClass(Profile)