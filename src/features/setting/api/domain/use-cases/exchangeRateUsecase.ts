import { IExchangeRateRepository } from "../../repositories/exchangeRateRepository.interface";
import { exchangeRateRepository } from "../../infrastructure/repositories/exchangeRateRepository";
import { ExchangeRateSetting, Prisma } from "@prisma/client";
import { Messages } from "@/shared/constants/message";

class ExchangeRateUseCase {
    private exchangeRateRepository: IExchangeRateRepository;

    constructor(exchangeRateRepository: IExchangeRateRepository) {
        this.exchangeRateRepository = exchangeRateRepository;
    }

    async createExchangeRate(data: Prisma.ExchangeRateSettingUncheckedCreateInput, authorId: string): Promise<ExchangeRateSetting> {
        const { fromCurrency, toCurrency, fromSymbol, toSymbol, fromValue, toValue } = data;

        if (!fromCurrency || !toCurrency || !fromSymbol || !toSymbol || !fromValue || !toValue) {
            throw new Error(Messages.INVALID_EXCHANGE_RATE_DATA);
        }

        try {
            const foundExchangeRate = await this.exchangeRateRepository.findFirstExchangeRate({
                authorId,
                OR: [
                    { fromCurrency, toCurrency },
                ],
            });

            if (foundExchangeRate) {
                throw new Error(Messages.EXCHANGE_RATE_DUPLICATED_FIELDS);
            }

            return await this.exchangeRateRepository.createExchangeRate({
                ...data,
                authorId,
                createdBy: authorId,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error(Messages.EXCHANGE_RATE_DUPLICATED_FIELDS);
                }
            }
            throw new Error(Messages.CREATE_EXCHANGE_RATE_FAILED);
        }
    }

    async getExchangeRate(authorId: string): Promise<ExchangeRateSetting[]> {
        try {
            return await this.exchangeRateRepository.findManyExchangeRate({ authorId });
        } catch (error) {
            throw new Error(Messages.GET_EXCHANGE_RATE_FAILED);
        }
    }

    async getAllExchangeRate(authorId: string): Promise<ExchangeRateSetting[]> {
        try {
            return await this.exchangeRateRepository.findManyExchangeRate({ authorId }) || [];
        } catch (error) {
            throw new Error(Messages.GET_EXCHANGE_RATE_FAILED);
        }
    }

    async updateExchangeRate(id: string, data: Prisma.ExchangeRateSettingUncheckedUpdateInput, authorId: string): Promise<ExchangeRateSetting> {
        try {

            const foundExchangeRate = await this.exchangeRateRepository.findFirstExchangeRate({
                id,
                authorId,
            });

            if (!foundExchangeRate) {
                throw new Error(Messages.EXCHANGE_RATE_NOT_FOUND);
            }

            return await this.exchangeRateRepository.updateExchangeRate(id, {
                ...data,
                updatedBy: authorId,
            });
        } catch (error) {
            throw new Error(Messages.UPDATE_EXCHANGE_RATE_FAILED);
        }
    }

    async deleteExchangeRate(id: string, authorId: string): Promise<void> {
        try {
            const foundExchangeRate = await this.exchangeRateRepository.findFirstExchangeRate({
                id,
                authorId,
            });

            if (!foundExchangeRate) {
                throw new Error(Messages.EXCHANGE_RATE_NOT_FOUND);
            }

            return await this.exchangeRateRepository.deleteExchangeRate(id);
        } catch (error) {
            throw new Error(Messages.DELETE_EXCHANGE_RATE_FAILED);
        }
    }
}

export const exchangeRateUseCase = new ExchangeRateUseCase(exchangeRateRepository);