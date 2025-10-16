export default function errorCatching(error: unknown) {
  if (error instanceof Error) {
    try {
      // Parse lỗi JSON nếu có
      const parsed = JSON.parse(error.message);

      return {
        message: parsed.message || 'Something went wrong!',
      };
    } catch {
      // Nếu message không phải JSON
      return {
        message: error.message || 'Something went wrong!',
      };
    }
  } else {
    console.error('Unknown error:', error);
    return {
      message: 'Unexpected error occurred!',
    };
  }
}
