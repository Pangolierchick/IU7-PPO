export interface IRepository<T> {
  getAll() : Promise<T[]>;
  get(id: string) : Promise<T | null>;
  create(data: T) : Promise<void>;
  delete(id: string) : Promise<void>;
  update(newUsr: T) : Promise<void>;
}
