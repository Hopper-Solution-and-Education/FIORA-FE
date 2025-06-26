import { PackageFX } from '../../domain/entity/PackageFX';
import { PackageFXResponse } from '../dto/response/PackageFXResponse';

export class PackageFXMapper {
  static toPackageFX(response: PackageFX): PackageFX {
    return {
      ...response,
    };
  }

  static toPackageFXs(response: PackageFXResponse): PackageFX[] {
    const { data } = response;
    if (Array.isArray(data)) {
      return data.map((item) => PackageFXMapper.toPackageFX(item));
    }
    return [PackageFXMapper.toPackageFX(data)];
  }
}
