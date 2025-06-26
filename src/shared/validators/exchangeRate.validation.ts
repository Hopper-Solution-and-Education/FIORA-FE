import Joi from 'joi';

export const exchangeRateCreation = Joi.object({
    fromCurrency: Joi.string().required().max(100),
    fromSymbol: Joi.string().required().max(100),
    fromValue: Joi.number().required().precision(2),
    toValue: Joi.number().required().precision(2),
    toCurrency: Joi.string().required().max(100),
    toSymbol: Joi.string().required().max(100),
});

export const exchangeRateUpdate = Joi.object({
    fromCurrency: Joi.string().max(100),
    fromSymbol: Joi.string().max(100),
    fromValue: Joi.number().precision(2),
    toValue: Joi.number().precision(2),
    toCurrency: Joi.string().max(100),
    toSymbol: Joi.string().max(100),
})

export const exchangeRateDelete = Joi.object({
    fromCurrencyId: Joi.string().required(),
    toCurrencyId: Joi.string().required(),
});