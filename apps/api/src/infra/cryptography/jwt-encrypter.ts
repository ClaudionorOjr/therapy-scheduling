import type { Encrypter } from '@domain/account/cryptography/encrypter'
import { sign } from 'jsonwebtoken'
import { injectable } from 'tsyringe'

@injectable()
export class JwtEncrypter implements Encrypter {
  /**
   * Encrypts the given payload using JSON Web Token (JWT).
   *
   * @param {Record<string, unknown>} payload - The payload to be encrypted.
   * @return {Promise<string>} The encrypted payload as a string.
   */
  async encrypt(
    payload: Record<string, unknown>,
    expiresIn?: string,
  ): Promise<string> {
    return sign(payload, 'secret', { expiresIn: expiresIn ?? '1d' })
  }
}
