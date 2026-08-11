/**
 * Repositories are responsible only for data access and must not contain
 * business rules. Services consume these contracts and own all business
 * decisions made from the returned data.
 *
 * Collection methods always resolve to an array. An empty result is
 * represented by [], never by null.
 */
export type RepositoryListResult<TEntity> = Promise<TEntity[]>

/**
 * Methods that fetch one entity, create an entity, or update an entity always
 * resolve to the expected entity. They never resolve to null or undefined.
 *
 * Returning a nullable value would force absence handling into every caller
 * and weaken the contract between Repositories and Services. Missing records
 * are surfaced as exceptions by the data provider and translated at the API
 * boundary.
 */
export type RepositoryEntityResult<TEntity> = Promise<TEntity>

/**
 * Removal methods do not return the deleted entity. Successful completion is
 * represented by a resolved Promise<void>; failures are reported as
 * exceptions.
 */
export type RepositoryRemovalResult = Promise<void>
