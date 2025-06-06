import { NextApiRequest, NextApiResponse } from 'next';
import { partnerUseCase } from '@/features/partner/application/use-cases/partnerUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { Messages } from '@/shared/constants/message';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { validateBody } from '@/shared/utils/validate';
import { createErrorResponse } from '@/shared/lib';
import { exchangeRateCreation, exchangeRateUpdate } from '@/shared/validators/exchangeRate.validation';
import { exchangeRateUseCase } from '@/features/setting/api/domain/use-cases/exchangeRateUsecase';

export default withAuthorization({
    GET: ['Admin', 'CS'],
    POST: ['Admin', 'CS'],
    PUT: ['Admin', 'CS'],
    DELETE: ['Admin'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
    switch (req.method) {
        case 'POST':
            return POST(req, res, userId);
        case 'GET':
            return GET(req, res, userId);
        case 'PUT':
            return PUT(req, res, userId);
        case 'DELETE':
            return DELETE(req, res, userId);
        default:
            return res
                .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
                .json({ error: Messages.METHOD_NOT_ALLOWED });
    }
});

export async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
    try {
        const partners = await partnerUseCase.listPartners(userId);
        return res
            .status(RESPONSE_CODE.OK)
            .json(createResponse(RESPONSE_CODE.OK, Messages.GET_PARTNER_SUCCESS, partners));
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

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
    try {

        const { error } = validateBody(exchangeRateCreation, req.body);

        if (error) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
        }

        const newExchangeRate = await exchangeRateUseCase.createExchangeRate(req.body, userId);

        return res
            .status(RESPONSE_CODE.CREATED)
            .json(createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_EXCHANGE_RATE_SUCCESS, newExchangeRate));
    } catch (error: any) {
        if (error.validationErrors) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).json({
                status: RESPONSE_CODE.BAD_REQUEST,
                message: Messages.VALIDATION_ERROR,
                error: error.validationErrors,
            });
        }

        // Handle other errors
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

        if (!id) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT, { id: 'id' }));
        }

        const { error } = validateBody(exchangeRateUpdate, req.body);

        if (error) {
            return res.status(RESPONSE_CODE.BAD_REQUEST).json(createErrorResponse(RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR, error));
        }

        const newExchangeRate = await exchangeRateUseCase.updateExchangeRate(id as string, req.body, userId);

        return res
            .status(RESPONSE_CODE.OK)
            .json(createResponse(RESPONSE_CODE.OK, Messages.UPDATE_EXCHANGE_RATE_SUCCESS, newExchangeRate));
    } catch (error: any) {
        return res
            .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
            .json(createError(res, RESPONSE_CODE.INTERNAL_SERVER_ERROR, error.message || Messages.INTERNAL_ERROR));
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
            .json(createResponse(RESPONSE_CODE.OK, Messages.DELETE_EXCHANGE_RATE_SUCCESS, null));
    } catch (error: any) {
        return res
            .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
            .json(createError(res, RESPONSE_CODE.INTERNAL_SERVER_ERROR, error.message || Messages.INTERNAL_ERROR));
    }
}