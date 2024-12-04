import type { Psychologist } from '@domain/account/enterprise/entities/psychologist'

export interface PsychologistsRepository {
  create(psychologist: Psychologist): Promise<void>
  findByEmail(email: string): Promise<Psychologist | null>
  findById(id: string): Promise<Psychologist | null>
  save(psychologist: Psychologist): Promise<void>
  delete(id: string): Promise<void>
}
