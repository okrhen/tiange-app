import * as yup from 'yup';

const addProductValidation = yup
.object()
.shape({
  barcode: yup.string().required(),
  name: yup.string().required(),
  category: yup.string().required(),
  cost: yup.string().required(),
  price: yup.string().required(),
  quantity: yup.string().required(),
  unit: yup.string().required()
})

export { addProductValidation }