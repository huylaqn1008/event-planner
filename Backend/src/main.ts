import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from 'dotenv'
import { ValidationPipe } from '@nestjs/common'

config({
  path: '.env'
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT ?? 3000
  app.enableCors({
    origin: '*',
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(port, ()=> {
    console.log(`This app is listen at http://localhost:${port}`)
  })
}
bootstrap()
