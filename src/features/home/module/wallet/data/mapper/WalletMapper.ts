import { Wallet } from '../../domain/entity/Wallet';
import { WalletResponse, WalletsResponse } from '../dto/response/WalletResponse';

class WalletMapper {
  static toWalletResponse(response: WalletResponse): Wallet {
    return {
      ...response.data,
      frBalanceActive: Number(response.data.frBalanceActive),
      frBalanceFrozen: Number(response.data.frBalanceFrozen),
      creditLimit:
        response.data.creditLimit !== undefined ? Number(response.data.creditLimit) : undefined,
    };
  }

  static toWalletsResponse(response: WalletsResponse): Wallet[] {
    return response.data.map((item) => WalletMapper.toWalletResponse({ ...response, data: item }));
  }
}

export default WalletMapper;
