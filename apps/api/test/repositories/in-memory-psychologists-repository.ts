import type { PsychologistsRepository } from '@domain/account/application/repositories/psychologists-repository'
import type { Psychologist } from '@domain/account/enterprise/entities/psychologist'

export class InMemoryPsychologistsRepository
  implements PsychologistsRepository
{
  public psychologists: Psychologist[] = []

  async create(psychologist: Psychologist): Promise<void> {
    this.psychologists.push(psychologist)
  }

  async findByEmail(email: string): Promise<Psychologist | null> {
    const psychologist = this.psychologists.find(
      (psychologist) => psychologist.email === email,
    )

    if (!psychologist) {
      return null
    }

    return psychologist
  }

  async findById(id: string): Promise<Psychologist | null> {
    const psychologist = this.psychologists.find(
      (psychologist) => psychologist.id === id,
    )

    if (!psychologist) {
      return null
    }

    return psychologist
  }

  async findMany(): Promise<Psychologist[]> {
    return this.psychologists
  }

  async save(psychologist: Psychologist): Promise<void> {
    const psychologistIndex = this.psychologists.findIndex(
      (item) => item.id === psychologist.id,
    )

    this.psychologists[psychologistIndex] = psychologist
  }

  async delete(id: string): Promise<void> {
    const psychologistIndex = this.psychologists.findIndex(
      (psychologist) => psychologist.id === id,
    )

    this.psychologists.splice(psychologistIndex, 1)
  }
}
