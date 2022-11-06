/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Configuracion} from '../llaves/configuracion';
import {NotificacioCorreo} from '../models';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionesService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */

  EnviarCorreo(datos: NotificacioCorreo) {
    let url = `${Configuracion.urlCorreo}?${Configuracion.argDestino}=${datos.destinatario}&${Configuracion.argAsunto}=${datos.asunto}&${Configuracion.argMensaje}=${datos.mensaje}&${Configuracion.argHash}=${Configuracion.hashNotificacion}`;
    fetch(url)
      .then((res:any) => {
        console.log(res.text())
      })
  }
}
