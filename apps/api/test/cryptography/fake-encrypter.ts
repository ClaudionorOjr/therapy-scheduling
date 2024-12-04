import type { Encrypter } from '@domain/account/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>) {
    const serializedPayload = JSON.stringify(payload)

    return Buffer.from(serializedPayload).toString('base64')
  }
}
