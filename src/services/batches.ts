export interface Batch {
  _id: string;
  name: string;
  byName: string;
  startDate?: string;
  endDate?: string;
  language?: string;
  previewImage?: string;
  feeTotal?: number;
  type?: string;
  slug?: string;
  subjects?: any[];
  subBatches?: any[];
}

import { batches_1 } from './batches_data_1';
import { batches_2 } from './batches_data_2';
import { batches_3 } from './batches_data_3';
import { batches_4 } from './batches_data_4';
import { batches_5 } from './batches_data_5';
import { batches_6 } from './batches_data_6';
import { batches_7 } from './batches_data_7';
import { batches_8 } from './batches_data_8';
import { batches_9 } from './batches_data_9';
import { batches_10 } from './batches_data_10';
import { batches_11 } from './batches_data_11';
import { batches_12 } from './batches_data_12';
import { batches_13 } from './batches_data_13';
import { batches_14 } from './batches_data_14';
import { batches_15 } from './batches_data_15';
import { batches_16 } from './batches_data_16';
import { batches_17 } from './batches_data_17';
import { batches_18 } from './batches_data_18';
import { batches_19 } from './batches_data_19';
import { batches_20 } from './batches_data_20';
import { batches_21 } from './batches_data_21';
import { batches_22 } from './batches_data_22';
import { batches_23 } from './batches_data_23';
import { batches_24 } from './batches_data_24';
import { batches_25 } from './batches_data_25';
import { batches_26 } from './batches_data_26';
import { batches_27 } from './batches_data_27';
import { batches_28 } from './batches_data_28';
import { batches_29 } from './batches_data_29';
import { batches_30 } from './batches_data_30';
import { batches_31 } from './batches_data_31';
import { batches_32 } from './batches_data_32';
import { batches_33 } from './batches_data_33';
import { batches_34 } from './batches_data_34';
import { batches_35 } from './batches_data_35';
import { batches_36 } from './batches_data_36';
import { batches_37 } from './batches_data_37';

export const getCustomBatches = (): Batch[] => {
  const storedBatches = localStorage.getItem('admin_custom_batches');
  if (storedBatches) {
    try {
      return JSON.parse(storedBatches);
    } catch (e) {
      console.error("Failed to parse custom batches", e);
    }
  }

  return [
    ...batches_1,
    ...batches_2,
    ...batches_3,
    ...batches_4,
    ...batches_5,
    ...batches_6,
    ...batches_7,
    ...batches_8,
    ...batches_9,
    ...batches_10,
    ...batches_11,
    ...batches_12,
    ...batches_13,
    ...batches_14,
    ...batches_15,
    ...batches_16,
    ...batches_17,
    ...batches_18,
    ...batches_19,
    ...batches_20,
    ...batches_21,
    ...batches_22,
    ...batches_23,
    ...batches_24,
    ...batches_25,
    ...batches_26,
    ...batches_27,
    ...batches_28,
    ...batches_29,
    ...batches_30,
    ...batches_31,
    ...batches_32,
    ...batches_33,
    ...batches_34,
    ...batches_35,
    ...batches_36,
    ...batches_37
  ];
};

export const customBatches: Batch[] = getCustomBatches();

export const batchDetailsFallback: Record<string, any> = {};

customBatches.forEach(batch => {
  batchDetailsFallback[batch._id] = batch;
  if (batch.slug) {
    batchDetailsFallback[batch.slug] = batch;
  }
});
