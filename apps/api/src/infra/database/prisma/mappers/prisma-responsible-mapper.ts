import { Responsible } from '@domain/account/enterprise/entities/responsible'
import type { Prisma, Responsible as RawResponsible } from '@prisma/client'

export class PrismaResponsibleMapper {
  /**
   * Converts an {@link Responsible} object to a `Prisma.ResponsibleUncheckedCreateInput` object.
   *
   * @param {Responsible} Responsible - The {@link Responsible} object to convert.
   * @return {Prisma.ResponsibleUncheckedCreateInput} - The converted `Prisma.ResponsibleUncheckedCreateInput` object.
   */
  static toPrisma(
    responsible: Responsible,
  ): Prisma.ResponsibleUncheckedCreateInput {
    return {
      fullName: responsible.fullName,
      email: responsible.email,
      phone: responsible.phone,
      degreeOfKinship: responsible.degreeOfKinship,
      patientId: responsible.patientId,
    }
  }

  /**
   * Converts a Prisma raw Responsible object into an {@link Responsible} domain object.
   *
   * @param {RawResponsible} raw - The Prisma Responsible object to convert.
   * @return {Responsible} - The converted {@link Responsible} domain object.
   */
  static toDomain(raw: RawResponsible): Responsible {
    return Responsible.create(
      {
        patientId: raw.patientId,
        fullName: raw.fullName,
        email: raw.email,
        phone: raw.phone,
        degreeOfKinship: raw.degreeOfKinship,
      },
      raw.id,
    )
  }
}
