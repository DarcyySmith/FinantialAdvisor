import Constants from 'expo-constants';

export type OCRResult = {
  title: string;
  amount: number;
  category: string;
};

export interface VisionProvider {
  parseReceipt(imageBase64: string): Promise<OCRResult>;
}

export async function getVisionProvider(): Promise<VisionProvider> {
  const provider = Constants.expoConfig?.extra?.visionProvider || 'mock';
  if (provider === 'google') {
    const mod = await import('./providers/google');
    return new mod.GoogleVisionProvider();
  }
  const mod = await import('./providers/mock');
  return new mod.MockVisionProvider();
}
