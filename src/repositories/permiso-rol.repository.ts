import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {PermisoRol, PermisoRolRelations} from '../models';

export class PermisoRolRepository extends DefaultCrudRepository<
  PermisoRol,
  typeof PermisoRol.prototype._id,
  PermisoRolRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(PermisoRol, dataSource);
  }
}
