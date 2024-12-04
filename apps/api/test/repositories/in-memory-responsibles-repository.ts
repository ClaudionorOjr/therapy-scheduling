import type { ResponsiblesRepository } from '@domain/account/application/repositories/responsibles-repository'
import type { Responsible } from '@domain/account/enterprise/entities/responsible'

export class InMemoryResponsiblesRepository implements ResponsiblesRepository {
  public responsibles: Responsible[] = []

  async create(responsible: Responsible): Promise<void> {
    this.responsibles.push(responsible)
  }

  async createMany(responsibles: Responsible[]): Promise<void> {
    this.responsibles.push(...responsibles)
  }

  async findById(id: string): Promise<Responsible | null> {
    const responsible = this.responsibles.find(
      (responsible) => responsible.id === id,
    )

    if (!responsible) {
      return null
    }

    return responsible
  }

  async findManyByPatientId(id: string): Promise<Responsible[]> {
    return this.responsibles.filter(
      (responsible) => responsible.patientId === id,
    )
  }

  async findMany(): Promise<Responsible[]> {
    return this.responsibles
  }

  async save(responsible: Responsible): Promise<void> {
    const responsibleIndex = this.responsibles.findIndex(
      (item) => item.id === responsible.id,
    )

    this.responsibles[responsibleIndex] = responsible
  }

  async delete(id: string): Promise<void> {
    const responsibleIndex = this.responsibles.findIndex(
      (responsible) => responsible.id === id,
    )

    this.responsibles.splice(responsibleIndex, 1)
  }

  async deleteMany(ids: string[]): Promise<void> {
    this.responsibles = this.responsibles.filter(
      (responsible) => !ids.includes(responsible.id),
    )
  }
}
