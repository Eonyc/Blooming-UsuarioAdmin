/* eslint-disable @typescript-eslint/naming-convention */
import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CambioClave, Credenciales, CredencialesRecuperacionClave, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
const generator = require('generate-password');
const CryptoJS = require("crypto-js");

@injectable({scope: BindingScope.TRANSIENT})
export class AdmClavesService {
  constructor(@repository(UsuarioRepository)
  public usuarioRepository: UsuarioRepository
  ) { }

  /*
   * Add service methods here
   */

  async CambiarClave(credencialesClave: CambioClave): Promise<Usuario | null> {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        _id: credencialesClave.id_usuario,
        clave: credencialesClave.clave_actual
      }
    });
    if (usuario) {
      usuario.clave = credencialesClave.nueva_clave;
      await this.usuarioRepository.updateById(credencialesClave.id_usuario, usuario)

      return usuario;
    } else {
      return null;
    }
  }

  async RecuperarClave(credenciales: CredencialesRecuperacionClave): Promise<Usuario | null> {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        correo: credenciales.correo
      }
    });
    if (usuario) {
      let clave = this.CrearClaveAle()
      usuario.clave = this.EncrypText(clave);
      await this.usuarioRepository.updateById(usuario._id, usuario)

      //Notificacion de nueva clave por correo
      return usuario;
    } else {
      return null;
    }
  }

  CrearClaveAle(): string {
    let password = generator.generate({
      length: 10,
      numbers: true,
      uppercase: true
    });
    return password;
  }

  EncrypText(texto: string) {
    let texCryp = CryptoJS.MD5(texto).toString();
    return texCryp;
  }
}
