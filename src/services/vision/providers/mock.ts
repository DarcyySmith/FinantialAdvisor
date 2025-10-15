import type { OCRResult, VisionProvider } from '../index';

export class MockVisionProvider implements VisionProvider {
  async parseReceipt(_imageBase64: string): Promise<OCRResult> {
    return {
      title: 'Compra Supermercado',
      amount: 42.5,
      category: 'Alimentación'
    };
  }
}
