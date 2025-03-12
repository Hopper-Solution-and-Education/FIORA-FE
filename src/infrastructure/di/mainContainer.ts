// src/di/mainContainer.ts
import { Container } from 'inversify';
import { httpClient, IHttpClient } from '@/lib/HttpClient';
import { TYPES } from './type';

const mainContainer = new Container();

// Bind global dependencies
mainContainer.bind<IHttpClient>(TYPES.IHttpClient).toConstantValue(httpClient);

export { mainContainer };
