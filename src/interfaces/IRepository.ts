export interface IRepository<T> {
  value: T[];
  getAll() : T[];
  get(id: string) : T | undefined;
  create(data: T) : void;
  delete(id: string) : void;
  update(newUsr: T) : void;
}
