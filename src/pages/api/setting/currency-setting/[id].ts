import { NextApiRequest, NextApiResponse } from 'next';
import { partnerUseCase } from '@/features/partner/application/use-cases/partnerUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { Messages } from '@/shared/constants/message';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { createErrorResponse } from '@/shared/lib';
import { exchangeRateUpsert } from '@/shared/validators/exchangeRate.validation';
import { exchangeRateUseCase } from '@/features/setting/api/domain/use-cases/exchangeRateUsecase';

export default withAuthorization({
    GET: ['Admin', 'CS'],
    POST: ['Admin', 'CS'],
    PUT: ['Admin', 'CS'],
    DELETE: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
    switch (req.method) {
        case 'GET':
            return GET(req, res, userId);
        case 'DELETE':
            return DELETE(req, res, userId);
        default:
            return res
                .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
                .json({ error: Messages.METHOD_NOT_ALLOWED });
    }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
    const { id } = req.query;

    try {
        const exchangeRate = await exchangeRateUseCase.getExchangeRateById(id as string, userId);
        return res
            .status(RESPONSE_CODE.OK)
            .json(createResponse(RESPONSE_CODE.OK, Messages.GET_EXCHANGE_RATE_SUCCESS, exchangeRate));
    } catch (error: any) {
        return res
            .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
            .json(createErrorResponse(error.status, error.message, error));
    }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT, { id: 'id' }));
        }

        await exchangeRateUseCase.deleteExchangeRate(id as string, userId);

        return res
            .status(RESPONSE_CODE.OK)
            .json(createResponse(RESPONSE_CODE.CREATED, Messages.DELETE_EXCHANGE_RATE_SUCCESS, null));
    } catch (error: any) {
        return res
            .status(error.status || RESPONSE_CODE.INTERNAL_SERVER_ERROR)
            .json(createErrorResponse(error.status, error.message, error));
    }
}