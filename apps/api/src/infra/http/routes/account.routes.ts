import { verifyJWT } from '@infra/middlewares/verify-jwt'
import type { FastifyInstance } from 'fastify'

import { authenticate } from '../controllers/account/authenticate-controller'
import { deleteAccount } from '../controllers/account/delete-account-controller'
import { deletePatient } from '../controllers/account/delete-patient-controller'
import { editPatient } from '../controllers/account/edit-patient-controller'
import { editPsychologist } from '../controllers/account/edit-psychologist-controller'
import { fetchPatients } from '../controllers/account/fetch-patients-controller'
import { getPatient } from '../controllers/account/get-patient-controller'
import { registerPatient } from '../controllers/account/register-patient-controller'
import { registerPsychologist } from '../controllers/account/register-psychologist-controller'
import { registerResponsibles } from '../controllers/account/register-responsibles-controller'

export async function accountRoutes(app: FastifyInstance) {
  /* POST */
  app.post('/sessions', authenticate)
  app.post('/psychologists/register', registerPsychologist)
  app.post('/patients/register', { onRequest: [verifyJWT] }, registerPatient)
  app.post(
    '/patients/:patientId/responsibles/register',
    { onRequest: [verifyJWT] },
    registerResponsibles,
  )

  /* GET */
  app.get('/patients', { onRequest: [verifyJWT] }, fetchPatients)
  app.get('/patients/:patientId', { onRequest: [verifyJWT] }, getPatient)

  /* PUT */
  app.put('/psychologists/update', { onRequest: [verifyJWT] }, editPsychologist)
  app.put('/patients/:patientId/edit', { onRequest: [verifyJWT] }, editPatient)

  /* DELETE */
  app.delete('/psychologists/delete', { onRequest: [verifyJWT] }, deleteAccount)
  app.delete(
    '/patients/:patientId/delete',
    { onRequest: [verifyJWT] },
    deletePatient,
  )
}
