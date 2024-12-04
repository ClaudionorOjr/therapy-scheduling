import { Psychologist } from '@domain/account/enterprise/entities/psychologist'
import { type Prisma, Psychologist as RawPsychologist } from '@prisma/client'

export class PrismaPsychologistMapper {
  /**
   * Converts an {@link Psychologist} object to a `Prisma.PsychologistUncheckedCreateInput` object.
   *
   * @param {Psychologist} psychologist - The {@link Psychologist} object to convert.
   * @return {Prisma.PsychologistUncheckedCreateInput} - The converted `Prisma.PsychologistUncheckedCreateInput` object.
   */
  static toPrisma(
    psychologist: Psychologist,
  ): Prisma.PsychologistUncheckedCreateInput {
    return {
      id: psychologist.id,
      fullName: psychologist.fullName,
      email: psychologist.email,
      passwordHash: psychologist.passwordHash,
      phone: psychologist.phone,
      dateOfBirth: psychologist.dateOfBirth,
      crp: psychologist.crp,
      createdAt: psychologist.createdAt,
      updatedAt: psychologist.updatedAt,
    }
  }

  /**
   * Converts a Prisma raw Psychologist object into an {@link Psychologist} domain object.
   *
   * @param {RawPsychologist} raw - The Prisma Psychologist object to convert.
   * @return {Psychologist} - The converted {@link Psychologist} domain object.
   */
  static toDomain(raw: RawPsychologist): Psychologist {
    return Psychologist.create(
      {
        fullName: raw.fullName,
        email: raw.email,
        passwordHash: raw.passwordHash,
        phone: raw.phone,
        dateOfBirth: raw.dateOfBirth,
        crp: raw.crp,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    )
  }
}
