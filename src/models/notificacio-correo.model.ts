import {Model, model, property} from '@loopback/repository';

@model()
export class NotificacioCorreo extends Model {
  @property({
    type: 'string',
    required: true,
  })
  destinatario: string;

  @property({
    type: 'string',
    required: true,
  })
  asunto: string;

  @property({
    type: 'string',
    required: true,
  })
  mensaje: string;


  constructor(data?: Partial<NotificacioCorreo>) {
    super(data);
  }
}

export interface NotificacioCorreoRelations {
  // describe navigational properties here
}

export type NotificacioCorreoWithRelations = NotificacioCorreo & NotificacioCorreoRelations;
