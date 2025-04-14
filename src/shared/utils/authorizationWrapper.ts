import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { createError } from '@/shared/lib/responseUtils/createResponse';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { userRepository } from '@/features/auth/infrastructure/repositories/userRepository';

export function withAuthorization(rolePermissions: any) {
  return function (handler: any) {
    return sessionWrapper(async (req, res, userId) => {
      const user = await userRepository.findById(userId);

      if (!user || !user.role) {
        return res
          .status(RESPONSE_CODE.FORBIDDEN)
          .json(createError(res, RESPONSE_CODE.FORBIDDEN, 'Bạn không có quyền truy cập'));
      }

      const allowedRoles = rolePermissions[req.method as keyof typeof rolePermissions] || [];
      if (!allowedRoles.includes(user.role)) {
        return res
          .status(RESPONSE_CODE.FORBIDDEN)
          .json(
            createError(res, RESPONSE_CODE.FORBIDDEN, 'Bạn không có quyền thực hiện hành động này'),
          );
      }

      return handler(req, res, userId, user);
    });
  };
}
