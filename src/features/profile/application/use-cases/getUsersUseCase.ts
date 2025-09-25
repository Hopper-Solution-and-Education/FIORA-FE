import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { UserFilterParams, UsersResponse } from '../../domain/entities/models/user.types';
import { UserRepositoryInterface } from '../../domain/repositories/userRepository.interface';
import { userRepository } from '../../infrastructure/repositories/userRepository';

class GetUsersUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute(params: UserFilterParams): Promise<UsersResponse> {
    const { search, role, status, fromDate, toDate, page = 1, pageSize = 10 } = params;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(pageSize)));

    // Build filters
    let filters = await this.userRepository.buildFilters({
      search,
      role,
      status,
      fromDate,
      toDate,
    });

    // Add search filter
    const searchFilter = await this.userRepository.searchFilter(search as string);
    if (searchFilter) {
      // If there are existing filters, we need to combine them properly
      if (Object.keys(filters).length > 0) {
        // Create a combined filter that ensures both conditions are met
        filters = {
          AND: [filters, searchFilter],
        };
      } else {
        // If no other filters, just use search filter
        filters = searchFilter;
      }
    }

    const skip = (pageNum - 1) * limitNum;

    // Get data
    try {
      const result = await this.userRepository.getWithFilters(filters, skip, limitNum);

      return {
        status: RESPONSE_CODE.OK,
        message: Messages.GET_SUCCESS,
        data: result,
      };
    } catch (error) {
      console.error('Error in getUsersUseCase:', error);
      console.error('Filters:', JSON.stringify(filters, null, 2));
      throw error;
    }
  }
}

export const getUsersUseCase = new GetUsersUseCase(userRepository);
