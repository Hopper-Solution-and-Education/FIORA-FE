import { userRepository } from '@/features/auth/infrastructure/repositories/userRepository';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';

export function withAuthorization(rolePermissions: any) {
  return function (handler: any) {
    return sessionWrapper(async (req, res, userId) => {
      const user = await userRepository.findById(userId);

      if (!user || !user.role) {
        return res
          .status(RESPONSE_CODE.FORBIDDEN)
          .json(
            createError(
              res,
              RESPONSE_CODE.FORBIDDEN,
              'You do not have permission to access this resource',
            ),
          );
      }

      const allowedRoles = rolePermissions[req.method as keyof typeof rolePermissions] || [];
      if (!allowedRoles.includes(user.role)) {
        return res
          .status(RESPONSE_CODE.FORBIDDEN)
          .json(createError(res, RESPONSE_CODE.FORBIDDEN, 'Access denied'));
      }

      return handler(req, res, userId, user);
    });
  };
}
