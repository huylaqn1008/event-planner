import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { config } from 'dotenv'
import { MongooseModule } from '@nestjs/mongoose'

config({
  path:'.env'
})

@Module({
  imports: [AuthModule, MongooseModule.forRoot(process.env.MONGODB_URI!)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
