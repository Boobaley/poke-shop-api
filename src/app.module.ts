import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { TokenModule } from "./token/token.module";
import { PokemonModule } from "./pokemon/pokemon.module";
import { AppController } from "./app.controller";
import { OrderModule } from "./order/order.module";
import { CartModule } from "./cart/cart.module";

console.log(process.env.MONGODB_CONNECTION_STRING);
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    UserModule,
    AuthModule,
    TokenModule,
    PokemonModule,
    OrderModule,
    CartModule
  ],
  controllers: [AppController]
})
export class AppModule {}
