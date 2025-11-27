import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret-key-change-in-production',
    });
  }

  async validate(payload: any) {
    console.log('='.repeat(80));
    console.log('🔍 JwtStrategy - INICIO DE VALIDACIÓN');
    console.log('🔍 JwtStrategy - Payload recibido del token:', JSON.stringify(payload, null, 2));
    
    try {
      console.log('🔍 JwtStrategy - Buscando usuario con ID:', payload.sub);
      
      const user = await this.usersService.findOne(payload.sub);
      
      console.log('🔍 JwtStrategy - ¿Usuario encontrado?:', user ? 'SÍ' : 'NO');
      
      if (!user) {
        console.log('❌ JwtStrategy - Usuario NO existe en la base de datos');
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Convertir a objeto plano si es un documento de Mongoose
      const userObj = user.toObject ? user.toObject() : user;
      
      console.log('🔍 JwtStrategy - Usuario de BD (completo):', JSON.stringify(userObj, null, 2));
      console.log('🔍 JwtStrategy - ¿Tiene campo "rol"?:', userObj.rol ? 'SÍ' : 'NO');
      console.log('🔍 JwtStrategy - Valor del rol:', userObj.rol);

      // Construir objeto user para request.user
      const userForRequest = {
        userId: userObj._id,
        id: userObj._id,
        username: userObj.username,
        email: userObj.email,
        rol: userObj.rol, // ← CRÍTICO
      };

      console.log('✅ JwtStrategy - Objeto que se retorna a request.user:', JSON.stringify(userForRequest, null, 2));
      
      if (!userForRequest.rol) {
        console.log('⚠️⚠️⚠️ ADVERTENCIA: El rol está undefined en el objeto final');
        console.log('⚠️ Verificar que el campo en MongoDB se llama "rol" y no "role"');
      }
      
      console.log('🔍 JwtStrategy - FIN DE VALIDACIÓN');
      console.log('='.repeat(80));

      return userForRequest;
      
    } catch (error) {
      console.log('❌ JwtStrategy - ERROR:', error.message);
      console.log('='.repeat(80));
      throw new UnauthorizedException('Error en la validación del token');
    }
  }
}