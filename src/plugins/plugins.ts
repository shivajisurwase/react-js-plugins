
import { FormRef, ValidationResult, MenuItem, ReducerActionHandler, StorageType, StorageAction, UseStorageParams, FlattenedObject } from "../types/types";
import moment from "moment";
import * as Yup from 'yup';

export const _isValidForm = async (formRef: FormRef): Promise<ValidationResult> => {
  if (formRef && formRef.current) {
    const errors = await formRef.current.validateForm();
    const isValid = Object.keys(errors).length === 0;
    return { isValid, errors: isValid ? [] : errors };
  }
  return { isValid: false, errors: [] };
};


export const _getStartStopTime = (sdate: Date, format: string = 'YYYY-MM-DDTHH:mm:ss') => {
  if (!(sdate instanceof Date) || isNaN(sdate.getTime())) {
    return 'Invalid Date';
  }
  const start = new Date(sdate.getFullYear(), sdate.getMonth(), 1);
  const end = new Date(sdate.getFullYear(), sdate.getMonth() + 1, 0, 23, 59, 59);
  return {
    startTime: moment(start).format(format),
    stopTime: moment(end).format(format)
  };
};

export const _promise = (time: number) => new Promise((res) => setTimeout(res, time));

export const _hasItem = (
  menuItems: MenuItem[],
  path: string,
  key: string
): any | null => {
  for (const item of menuItems) {
    if (item?.path === path) {
      return item[key];
    }
    if (item?.data && item.data.length > 0) {
      const result = _hasItem(item.data, path, key);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const _dynamicReducer = <State, Action extends { type: string }>(
  initialState: State,
  actions: Record<string, ReducerActionHandler<State, Action>>
) => (
  state: State = initialState,
  action: Action
): State => {
    if (actions[action.type]) {
      return actions[action.type](state, action);
    }
    return state;
  };

export const _thousandSeparator = (num: number) => {
  const parts = num.toString().split('.');
  const numberPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decimalPart = parts[1] ? `.${parts[1]}` : '.00';
  const twoDecimalPart = parts[1] ? `.${parts[1].slice(0, 2)}` : '.00';
  const allDecimal = numberPart + decimalPart;
  const twoDecimal = numberPart + twoDecimalPart;
  return {
    allDecimal,
    twoDecimal
  };
};

export const _getFinancialYear = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startYear = month >= 3 ? currentYear : currentYear - 1;
  const endYear = startYear + 1;
  return `${startYear}-${endYear}`;
};


export const _getStorage = ({
  action,
  type,
  key,
  value,
}: UseStorageParams): any | null => {
  if (type !== 'local' && type !== 'session') {
    throw new Error("Invalid storage type. Use 'local' or 'session'.");
  }
  let result: any = null;
  const storage = type === 'local' ? localStorage : sessionStorage;
  if (action === 'CLEAR') {
    storage.clear();
  } else if (action === 'SET' && value !== undefined && value !== null) {
    storage.setItem(key, JSON.stringify(value));
  } else if (action === 'GET' && value === undefined) {
    const storedValue = storage.getItem(key);
    result = storedValue ? JSON.parse(storedValue) : null;
  } else if (action === 'REMOVE' && key !== undefined) {
    storage.removeItem(key);
  }

  return result;
};

export const _deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const _getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
};

export const _setCookie = (name: string, value: string, days: number): void => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
};

export const _isEmpty = (value: any): boolean => {
  return value == null || (typeof value === 'object' && Object.keys(value).length === 0);
};

export const _mergeObjects = <T>(obj1: T, obj2: T): T => ({
  ...obj1,
  ...obj2,
});

export const _mapObject = <T>(obj: { [key: string]: any }, callback: (key: string, value: any) => T): T[] => {
  return Object.keys(obj).map(key => callback(key, obj[key]));
};

export const _isEqual = <T>(value1: T, value2: T): boolean => {
  return JSON.stringify(value1) === JSON.stringify(value2);
};

export const _capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const _convertToCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export const _getBrowserInfo = (): string => {
  const { userAgent } = navigator;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  return 'Unknown';
};

export const _isMobile = (): boolean => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

export const _parseJSON = <T>(json: string): T | null => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const _scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const _batchProcess = async <T>(data: T[], batchSize: number, processFn: (item: T) => Promise<void>): Promise<void> => {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await Promise.all(batch.map(processFn));
  }
};



export const _flattenObject = (obj: any, prefix: string = ''): FlattenedObject => {
  let result: FlattenedObject = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result = { ...result, ..._flattenObject(obj[key], newKey) };
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
};

export const _deepMerge = (target: any, source: any) => {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && target[key]) {
        target[key] = _deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
};

export const _chunk = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export const _asyncDebounce = (fn: (...args: any[]) => Promise<void>, delay: number) => {
  let timeout: any;
  return async (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

export const _deepCloneArray = <T>(arr: T[]): T[] => {
  return arr.map(item => (typeof item === 'object' ? _deepClone(item) : item));
};

export const _getMaxMinValue = (arr: number[]): { max: number; min: number } => {
  return arr.reduce(
    (acc, curr) => {
      if (curr > acc.max) acc.max = curr;
      if (curr < acc.min) acc.min = curr;
      return acc;
    },
    { max: -Infinity, min: Infinity }
  );
};

export const _asyncMap = async <T, U>(arr: T[], asyncFn: (item: T) => Promise<U>): Promise<U[]> => {
  const results = [];
  for (let i = 0; i < arr.length; i++) {
    results.push(await asyncFn(arr[i]));
  }
  return results;
};

export const _transformAsyncData = async <T, U>(arr: T[], transformer: (item: T) => Promise<U>): Promise<U[]> => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const transformedItem = await transformer(arr[i]);
    result.push(transformedItem);
  }
  return result;
};

export const _getNestedProperty = (obj: Record<string, any>, path: string) => {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
};

export const _deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!_deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};

export const _mergeArrays = <T>(arr1: T[], arr2: T[]): T[] => {
  return Array.from(new Set([...arr1, ...arr2]));
};

export const _filterDuplicates = <T>(arr: T[], uniqueKey: keyof T): T[] => {
  const seen = new Set();
  return arr.filter((item) => {
    const key = item[uniqueKey];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const _sortByKey = <T>(arr: T[], key: keyof T): T[] => {
  return arr.sort((a, b) => (a[key] > b[key] ? 1 : -1));
};

export const _mapAsync = async <T, U>(arr: T[], asyncFn: (item: T) => Promise<U>): Promise<U[]> => {
  const result = await Promise.all(arr.map(asyncFn));
  return result;
};

export const _formatDate = (date: Date, format: string): string => {
  const options: Intl.DateTimeFormatOptions = {};
  if (format.includes('Y')) options.year = 'numeric';
  if (format.includes('M')) options.month = 'short';
  if (format.includes('D')) options.day = 'numeric';
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const _calPercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export const _sum = (numbers: number[]): number => {
  return numbers.reduce((acc, num) => acc + num, 0);
};

export const _average = (numbers: number[]): number => {
  const total = _sum(numbers);
  return total / numbers.length;
};

export const _getPriceAfterTax = (price: number, taxRate: number): number => {
  return price * (1 + taxRate / 100);
};

export const _calculateTimeDifference = (startDate: Date, endDate: Date): string => {
  const diffInMilliseconds = endDate.getTime() - startDate.getTime();
  const days = Math.floor(diffInMilliseconds / (1000 * 3600 * 24));
  const hours = Math.floor((diffInMilliseconds % (1000 * 3600 * 24)) / (1000 * 3600));
  const minutes = Math.floor((diffInMilliseconds % (1000 * 3600)) / (1000 * 60));
  const seconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export const _arrayIncludesObject = (arr: any[], obj: any) => {
  return arr.some(item => JSON.stringify(item) === JSON.stringify(obj));
};

export const _toCamelCase = (str: string) => {
  return str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
};

export const _arrayToObject = (arr: any[], key: string) => {
  return arr.reduce((acc, curr) => {
    acc[curr[key]] = curr;
    return acc;
  }, {});
};

export const _isInArray = (arr: any[], value: any) => arr.includes(value);
export const _getObjectValues = (obj: object) => Object.values(obj);
export const _swapArrayElements = (arr: any[], index1: number, index2: number) => {
  const temp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = temp;
};

export const _filterObjectByKey = (obj: object, keys: string[]) => {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
};

export const _getScrollPosition = () => {
  return {
    scrollX: window.scrollX || window.pageXOffset,
    scrollY: window.scrollY || window.pageYOffset
  };
};

export const _arrayIntersection = (arr1: any[], arr2: any[]) => {
  return arr1.filter(item => arr2.includes(item));
};

export const _getArrayOfObjectsByProperty = (arr: any[], key: string, value: any) => {
  return arr.filter(item => item[key] === value);
};

export const _downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const _base64ToBlob = (base64: string) => {
  const binaryString = atob(base64.split(',')[1]);
  const array = [];
  for (let i = 0; i < binaryString.length; i++) {
    array.push(binaryString.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: 'application/octet-stream' });
};

export const _initializeFormValues = (fields: string[]): { [key: string]: any } => {
  return fields.reduce((acc, field) => {
    acc[field] = ''; // default value
    return acc;
  }, {} as { [key: string]: any });
};

export const _dynamicRequiredValidation = (requiredFields: string[]): Yup.ObjectSchema<any> => {
  const schema: { [key: string]: any } = {};

  requiredFields.forEach(field => {
    schema[field] = Yup.string().required(`${field} is required`);
  });

  return Yup.object(schema);
};

export const _generateYupValidation = (fields: string[]): Yup.ObjectSchema<any> => {
  const schema: { [key: string]: any } = {};

  fields.forEach(field => {
    schema[field] = Yup.string().required(`${field} is required`);
  });

  return Yup.object(schema);
};

export const _initializeFormikFields = (fields: string[]) => {
  return fields.reduce((acc, field) => {
    acc[field] = ''; // set default value for each field
    return acc;
  }, {} as { [key: string]: string });
};


export const _setNestedProperty = (obj: any, path: string, value: any): any => {
  const keys = path.split('.');
  keys.reduce((acc, key, idx) => {
    if (idx === keys.length - 1) {
      acc[key] = value;
    } else {
      acc[key] = acc[key] || {};
    }
    return acc[key];
  }, obj);
};

export const _transformArray = <T, R>(arr: T[], transformFn: (item: T) => R): R[] => {
  return arr.map(transformFn);
};

export const _findObjectById = <T>(arr: T[], id: string): T | undefined => {
  return arr.find((item: any) => item.id === id);
};

export const _getUniqueValues = (arr: any[]): any[] => {
  return Array.from(new Set(arr));
};

export const _mergeArraysByKey = (arr1: any, arr2: any, key: string) => {
  const map = new Map();
  arr1.forEach((item: any) => map.set(item[key], item));
  arr2.forEach((item: any) => {
    if (map.has(item[key])) {
      map.set(item[key], { ...map.get(item[key]), ...item });
    } else {
      map.set(item[key], item);
    }
  });
  return Array.from(map.values());
};

export const _removeDuplicates = (arr: any, key: string) => {
  const seen: Set<any> = new Set();
  return arr.filter((item: any) => {
    const value = item[key];
    if (!seen.has(value)) {
      seen.add(value);
      return true;
    }
    return false;
  });
}

export const _groupBy = (arr: any, key: string) => {
  return arr.reduce((result: any, currentValue: any) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }, {});
};

export const _arrayDiff = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter(item => !arr2.includes(item));
};

export const _deepCompareArrays = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) return false;

  return arr1.every((item, index) => _deepEqual(item, arr2[index]));
};

export const _updateObjectInArray = (arr: [], key: string, value: any, update: any) => {
  return arr.map((item: any) =>
    item[key] === value ? { ...item, ...update } : item
  );
};

export const _getKeysByValue = (obj: any, value: any): string[] => {
  return Object.keys(obj).filter(key => obj[key] === value);
};