import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Usuario, UsuarioRelations, Rol} from '../models';
import {RolRepository} from './rol.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype._id,
  UsuarioRelations
> {

  public readonly tiene_un: BelongsToAccessor<Rol, typeof Usuario.prototype._id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('RolRepository') protected rolRepositoryGetter: Getter<RolRepository>,
  ) {
    super(Usuario, dataSource);
    this.tiene_un = this.createBelongsToAccessorFor('tiene_un', rolRepositoryGetter,);
    this.registerInclusionResolver('tiene_un', this.tiene_un.inclusionResolver);

  }
}
