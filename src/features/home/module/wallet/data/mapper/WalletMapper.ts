import { Wallet } from '../../domain/entity/Wallet';
import { WalletResponse } from '../dto/response/WalletResponse';

class WalletMapper {
  static toWalletResponse(response: WalletResponse): Wallet {
    return {
      ...response.data,
    };
  }
}

export default WalletMapper;
