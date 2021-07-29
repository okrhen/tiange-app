import * as yup from 'yup';


export const loginFormValidation = yup
.object()
.shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
})