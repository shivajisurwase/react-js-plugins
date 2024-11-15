
export interface FormRef {
    current: {
        validateForm: () => Promise<Record<string, any>>;
    } | null;
}

export type ValidationResult = {
    isValid: boolean;
    errors: Record<string, any> | [];
};

export type MenuItem = {
    path?: string;
    data?: MenuItem[];
    [key: string]: any;
};

export type ReducerActionHandler<State, Action> = (state: State, action: Action) => State;

export type StorageType = 'local' | 'session';
export type StorageAction = 'SET' | 'GET' | 'REMOVE' | 'CLEAR';

export interface UseStorageParams {
    action: StorageAction;
    type: StorageType;
    key: string;
    value?: any;
}

export type FlattenedObject = { [key: string]: any };