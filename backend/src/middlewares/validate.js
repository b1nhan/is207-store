import { sendError } from '../utils/response.js';

/**
 * Factory: trả về Express middleware validate req.body với Zod schema.
 * Khi fail → trả 400 kèm danh sách lỗi từng field.
 * Khi pass → ghi đè req.body bằng dữ liệu đã được parse/coerce.
 *
 * @param {import('zod').ZodSchema} schema
 *
 * @example
 * router.post('/register', validate(registerSchema), authController.register);
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

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

  req.body = result.data;
  next();
};

export default validate;
