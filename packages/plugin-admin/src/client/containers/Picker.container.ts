import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { EntityGridProps } from '../components/EntityGrid/EntityGrid';

export interface PickerProps {
  title?: string;
  query: string;
  queryKey: string;
  itemMap: EntityGridProps['itemMap'];
  pickKey?: string;
}
export type PickerCB = (value: any) => void;

export const Picker = createContainer(() => {
  const [picker, setPicker] = useState<PickerProps | null>(null);
  const [value, setValue] = useState<any>();
  const [callBack, setCallBack] = useState<PickerCB | null>();

  const open = (props: PickerProps, cb: PickerCB) => {
    setPicker(props);
    setCallBack(() => cb);
  };
  const close = (useValue?: boolean) => {
    let v = useValue ? value : null;
    if (v && picker?.pickKey) v = v[picker.pickKey as keyof typeof v];
    setPicker(null);
    callBack?.(v);
    setCallBack(null);
  };

  return { open, close, picker, value, setValue };
});
