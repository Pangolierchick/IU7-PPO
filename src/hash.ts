import { compare, hash, hashSync } from "bcrypt";

const SALT_ROUNDS = 10;

export class Hash {
  public static hash(str: string) {
    return hashSync(str, SALT_ROUNDS);
  }

  public static async hashAsync(str: string) {
    return hash(str, SALT_ROUNDS);
  }

  public static async compare(str: string, encrypted: string) {
    return compare(str, encrypted);
  }
}
