import { Partner } from '../../domain/entities/Partner';
import { CreatePartnerAPIResponseDTO } from '../dto/response/CreatePartnerAPIResponseDTO';
import { GetPartnerAPIResponseDTO } from '../dto/response/GetPartnerAPIResponseDTO';
import { GetPartnerByIdAPIResponseDTO } from '../dto/response/GetPartnerByIdAPIResponseDTO';

export class PartnerMapper {
  static toEntityFromCreate(dto: CreatePartnerAPIResponseDTO): Partner {
    return new Partner(
      dto.data.id,
      dto.data.userId,
      dto.data.name,
      dto.data.createdAt,
      dto.data.updatedAt,
      dto.data.createdBy,
      dto.data.user,
      dto.data.transactions,
      dto.data.children,
      dto.data.logo,
      dto.data.identify,
      dto.data.dob,
      dto.data.taxNo,
      dto.data.address,
      dto.data.email,
      dto.data.phone,
      dto.data.description,
      dto.data.updatedBy,
      dto.data.parentId === 'none' ? null : dto.data.parentId,
      dto.data.parent,
    );
  }

  static toEntityListFromGet(dto: GetPartnerAPIResponseDTO): Partner[] {
    if (!dto?.data?.data || !Array.isArray(dto.data.data)) {
      console.error('Invalid API response:', dto);
      return [];
    }
    return dto.data.data.map(
      (item) =>
        new Partner(
          item.id,
          item.userId,
          item.name,
          item.createdAt,
          item.updatedAt,
          item.createdBy,
          item.user,
          item.transactions,
          item.children,
          item.logo,
          item.identify,
          item.dob,
          item.taxNo,
          item.address,
          item.email,
          item.phone,
          item.description,
          item.updatedBy,
          item.parentId === 'none' ? null : item.parentId,
          item.parent,
        ),
    );
  }

  static toEntityFromGetById(dto: GetPartnerByIdAPIResponseDTO): Partner {
    return new Partner(
      dto.data.id,
      dto.data.userId,
      dto.data.name,
      dto.data.createdAt,
      dto.data.updatedAt,
      dto.data.createdBy,
      dto.data.user,
      dto.data.transactions,
      dto.data.children,
      dto.data.logo,
      dto.data.identify,
      dto.data.dob,
      dto.data.taxNo,
      dto.data.address,
      dto.data.email,
      dto.data.phone,
      dto.data.description,
      dto.data.updatedBy,
      dto.data.parentId === 'none' ? null : dto.data.parentId,
      dto.data.parent,
    );
  }
}
