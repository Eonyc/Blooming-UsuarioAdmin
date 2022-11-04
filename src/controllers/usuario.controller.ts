import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {CambioClave, Usuario} from '../models';
import {Credenciales} from '../models/credenciales.model';
import {UsuarioRepository} from '../repositories';
import {AdmClavesService} from '../services';

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository : UsuarioRepository,
    @service(AdmClavesService)
    public servicioClaves: AdmClavesService
  ) {}

  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['_id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, '_id'>,
  ): Promise<Usuario> {
    let clave = this.servicioClaves.CrearClaveAle();
    console.log(clave)
    let claveCifrada= this.servicioClaves.EncrypText(clave)
    usuario.clave = claveCifrada;
    let usuarioCreado = await this.usuarioRepository.create(usuario);
    if(usuarioCreado){
      //Envio de correo electronico
    }
    return usuarioCreado;
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }

//**Métodos adicionales*/

@post('/identificador-usuarios')
@response(200, {
  description: 'Usuario identificado',
  content: {'application/json': {schema: getModelSchemaRef(Credenciales)}},
})
async idenUsuario(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Credenciales, {
          title: 'Identificador de usuario',
        }),
      },
    },
  })
  credenciales: Credenciales,
): Promise<Usuario | null> {
  let usuario = await this.usuarioRepository.findOne({
    where: {
      correo: credenciales.usuario,
      clave: credenciales.clave
    }
  });
  if(usuario){
    //Generador de token para agregarlo a la respuesta
  }
  return usuario;
}

@post('/cambiar-clave')
@response(200, {
  description: 'Cambio de clave del usuario',
  content: {'application/json': {schema: getModelSchemaRef(CambioClave)}},
})
async cambiarClave(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(CambioClave, {
          title: 'Cambio de clave del usuario',
        }),
      },
    },
  })
  credencialesClave: CambioClave,
): Promise<boolean> {
  let respuesta = await this.servicioClaves.CambiarClave(credencialesClave);
  if(respuesta){
    //Servicio de notificaciones para enviar correo al usuario
  }
  return respuesta;
}

@post('/recuperar-clave')
@response(200, {
  description: 'Recuperación de clave del usuario',
  content: {'application/json': {schema: {}}},
})
async recuperarClave(
  @requestBody({
    content: {
      'application/json': {

      },
    },
  })
  correo: string,
): Promise<Usuario | null> {
  let respuesta = await this.servicioClaves.RecuperarClave(correo);
  if(usuario){
    //Servicio de notificaciones para enviar correo al usuario con nueva clave
  }
  return usuario;
}

}
