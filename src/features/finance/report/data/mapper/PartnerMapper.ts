import { GetListPartnerRequest, GetListPartnerResponse } from '../../domain/entities';
import { GetListPartnersRequestDTO, GetListPartnersResponseDTO } from '../dto';

class PartnerMapper {
  static toGetListPartnerRequestDTO(request: GetListPartnerRequest): GetListPartnersRequestDTO {
    return {
      ...request,
    };
  }

  static toGetListPartnerResponse(response: GetListPartnersResponseDTO): GetListPartnerResponse {
    return {
      data: response.data,
    };
  }
}

export { PartnerMapper };
