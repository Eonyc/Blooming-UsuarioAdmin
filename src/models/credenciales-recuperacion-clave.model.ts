import {Model, model, property} from '@loopback/repository';

@model()
export class CredencialesRecuperacionClave extends Model {
  @property({
    type: 'string',
    required: true,
  })
  correo: string;


  constructor(data?: Partial<CredencialesRecuperacionClave>) {
    super(data);
  }
}

export interface CredencialesRecuperacionClaveRelations {
  // describe navigational properties here
}

export type CredencialesRecuperacionClaveWithRelations = CredencialesRecuperacionClave & CredencialesRecuperacionClaveRelations;
