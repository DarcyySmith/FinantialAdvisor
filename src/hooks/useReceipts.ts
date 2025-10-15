import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { addReceipt, initDb, listReceipts, type Receipt } from '@/services/storage/db';
import { getVisionProvider } from '@/services/vision';

export function useReceipts() {
  const [items, setItems] = useState<Receipt[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      await initDb();
      const all = await listReceipts();
      setItems(all);
    })();
  }, []);

  const pickAndParse = async () => {
    setBusy(true);
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });
      if (res.canceled) return;
      const asset = res.assets?.[0];
      if (!asset) return;
      const base64 = asset.base64 ?? (await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' }));
      const provider = await getVisionProvider();
      const ocr = await provider.parseReceipt(base64);
      await addReceipt({ title: ocr.title, amount: ocr.amount, category: ocr.category, imageUri: asset.uri });
      const all = await listReceipts();
      setItems(all);
    } finally {
      setBusy(false);
    }
  };

  return { items, busy, pickAndParse };
}
