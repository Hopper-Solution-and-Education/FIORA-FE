import { partnerUseCase } from '@/features/partner/application/use-cases/partnerUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { partnerBodySchema } from '@/shared/validators/partnerValidator';
import { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  PUT: ['User', 'Admin', 'CS'],
  GET: ['User', 'Admin', 'CS'],
  DELETE: ['User', 'Admin', 'CS'], // Add DELETE permission
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'PUT':
      return PUT(req, res, userId);
    case 'GET':
      return GET(req, res, userId);
    case 'DELETE':
      return DELETE(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: 'Phương thức không được hỗ trợ' });
  }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;

    const partner = await partnerUseCase.getPartnerById(id as string, userId);

    if (!partner) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createError(res, RESPONSE_CODE.NOT_FOUND, Messages.PARTNER_NOT_FOUND));
    }

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_PARTNER_SUCCESS, partner));
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}

export async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;

    const { error } = validateBody(partnerBodySchema, req.body);
    if (error) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({
        status: RESPONSE_CODE.BAD_REQUEST,
        message: Messages.VALIDATION_ERROR,
        error: error,
      });
    }
    const updatedPartner = await partnerUseCase.editPartner(id as string, userId, req.body);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.UPDATE_PARTNER_SUCCESS, updatedPartner));
  } catch (error: any) {
    if (error.validationErrors) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({
        status: RESPONSE_CODE.BAD_REQUEST,
        message: Messages.VALIDATION_ERROR,
        error: error.validationErrors,
      });
    }

    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
          null,
        ),
      );
  }
}

// export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
//   try {
//     const { id } = req.query;

//     if (!id) {
//       return res
//         .status(RESPONSE_CODE.BAD_REQUEST)
//         .json(createError(res, RESPONSE_CODE.BAD_REQUEST, 'Partner ID is required'));
//     }

//     const deletedPartner = await partnerUseCase.deletePartner(id as string, userId);

//     return res
//       .status(RESPONSE_CODE.OK)
//       .json(createResponse(RESPONSE_CODE.OK, 'Partner deleted successfully', deletedPartner));
//   } catch (error: any) {
//     console.error('Error deleting partner:', error);
//     return res
//       .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
//       .json(
//         createError(
//           res,
//           RESPONSE_CODE.INTERNAL_SERVER_ERROR,
//           error.message || Messages.INTERNAL_ERROR,
//         ),
//       );
//   }
// }

export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;
    const { newid } = req.headers;
    await partnerUseCase.deletePartner(id as string, userId, newid as string | undefined);
    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.DELETE_PARTNER_SUCCESS));
  } catch (error: any) {
    if (error.validationErrors) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({
        status: RESPONSE_CODE.BAD_REQUEST,
        message: Messages.VALIDATION_ERROR,
        error: error.validationErrors,
      });
    }

    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}
