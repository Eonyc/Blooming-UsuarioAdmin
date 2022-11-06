/* eslint-disable @typescript-eslint/naming-convention */
import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Configuracion} from '../llaves/configuracion';
import {Credenciales, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class SesionUsuariosService {
  constructor(
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository

  ) { }

  /*
   * Add service methods here
   */

  async IdentificarUsuario(credenciales: Credenciales) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        correo: credenciales.usuario,
        clave: credenciales.clave
      }
    });
    return usuario;
  }

  async GeneradorToken(datos: Usuario): Promise<string> {
    const url = `${Configuracion.urlToken}?${Configuracion.argNombre}=${datos.nombre}&${Configuracion.arg_IdPersona}=${datos._id}&${Configuracion.argIdRol}=${datos.id_rol}`;
    let token = "";
    await fetch(url)
      .then(async (res: any) => {
        token = await res.text()
      })
    return token;
  }

}
