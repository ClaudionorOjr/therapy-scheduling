import {
  Responsible,
  type ResponsibleProps,
} from '@domain/account/enterprise/entities/responsible'
import { faker } from '@faker-js/faker'

export function makeResponsible(
  override?: Partial<ResponsibleProps>,
  id?: string,
) {
  return Responsible.create(
    {
      patientId: faker.string.uuid(),
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number().toString(),
      degreeOfKinship: faker.lorem.word(7),
      ...override,
    },
    id,
  )
}
