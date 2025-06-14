import { GetListProductRequest, GetListProductResponse } from '../../domain/entities';
import { GetListProductsRequestDTO, GetListProductsResponseDTO } from '../dto';

class ProductMapper {
  static toGetListProductRequestDTO(request: GetListProductRequest): GetListProductsRequestDTO {
    return {
      ...request,
    };
  }

  static toGetListProductResponse(response: GetListProductsResponseDTO): GetListProductResponse {
    return response.data;
  }
}

export { ProductMapper };
