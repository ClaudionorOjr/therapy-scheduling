import {
  Scheduling,
  type SchedulingProps,
} from '@domain/scheduling/enterprise/entities/scheduling'
import { faker } from '@faker-js/faker'

/**
 * Factory function for creating a {@link Scheduling} entity.
 *
 * @param {Partial<SchedulingProps>} override - Optional partial override for the entity props.
 * @param {string} id - Optional id for the entity.
 * @returns {Scheduling} A new {@link Scheduling} entity.
 */
export function makeScheduling(
  override?: Partial<SchedulingProps>,
  id?: string,
): Scheduling {
  return Scheduling.create(
    {
      patientId: faker.string.uuid(),
      psychologistId: faker.string.uuid(),
      appointmentDatetime: faker.date.soon({ days: 30 }),
      appointmentLocation: faker.location.streetAddress({
        useFullAddress: true,
      }),
      typeOfService: faker.helpers.arrayElement(['REMOTE', 'INPERSON']),
      ...override,
    },
    id,
  )
}
