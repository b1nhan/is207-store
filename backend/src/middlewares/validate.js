import { sendError } from '../utils/response.js';

/**
 * Factory: trả về Express middleware validate req.body hoặc req.params/req.query với Zod schema.
 * Khi fail → trả 400 kèm danh sách lỗi từng field.
 * Khi pass → ghi đè source bằng dữ liệu đã được parse/coerce.
 *
 * @param {import('zod').ZodSchema} schema
 * @param {string} source - 'body' | 'params' | 'query'
 *
 * @example
 * router.post('/register', validate(registerSchema), authController.register);
 * router.patch('/:id/default', validate(idSchema, 'params'), controller.setDefault);
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, {
      status: 400,
      message: 'Dữ liệu đầu vào không hợp lệ',
      errorCode: 'VALIDATION_ERROR',
      errors,
    });
  }

  req[source] = result.data;
  next();
};

export default validate;
