export interface Encrypter {
  encrypt(payload: Record<string, unknown>, expiresIn?: string): Promise<string>
}
