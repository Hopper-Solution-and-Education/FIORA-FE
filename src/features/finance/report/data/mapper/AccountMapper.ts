import { GetListAccountRequest, GetListAccountResponse } from '../../domain/entities';
import { GetListAccountRequestDTO, GetListAccountResponseDTO } from '../dto/getListAccountDTO';

class AccountMapper {
  static toGetListAccountRequestDTO(request: GetListAccountRequest): GetListAccountRequestDTO {
    return {
      ...request,
    };
  }

  static toGetListAccountResponse(response: GetListAccountResponseDTO): GetListAccountResponse {
    return response.data;
  }
}

export { AccountMapper };
