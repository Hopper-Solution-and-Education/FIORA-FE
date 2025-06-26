import {
  GetListMembershipsRequest,
  GetListMembershipsResponse,
  Membership,
} from '../../domain/entities';
import { GetListMembershipsRequestDTO, GetListMembershipsResponseDTO } from '../dto';

export class MemberMapper {
  static toGetListMembershipsRequest(
    data: GetListMembershipsRequest,
  ): GetListMembershipsRequestDTO {
    return {
      page: data.page,
      limit: data.limit,
    };
  }

  static toGetListMembershipsResponse(
    data: GetListMembershipsResponseDTO,
  ): GetListMembershipsResponse {
    return {
      data: data.data.map((item) => new Membership(item)),
      message: data.message,
    };
  }
}
