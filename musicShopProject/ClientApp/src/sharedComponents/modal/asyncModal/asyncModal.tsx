import React, { useCallback, useContext } from "react";
import AsyncModalContext from "./context";

let uniqueCounter = 0

export interface AsyncModalProps<ReturnedType = void> {
    onClose: (result: ReturnedType) => void;
}

export default function useAsyncModal<ModalProps, ReturnedType = void>(
    ModalComponent: React.ComponentType<AsyncModalProps<ReturnedType> & ModalProps>
): (props: ModalProps) => Promise<ReturnedType> {
    const asyncModalContext = useContext(AsyncModalContext);
    if (asyncModalContext == null) throw '<AsyncModalProvider /> not registered';

    return useCallback((props: ModalProps): Promise<ReturnedType> => {
        const id = uniqueCounter++

        let onClose: (result: ReturnedType) => void;

        const promise = new Promise<ReturnedType>(resolve => {
            onClose = (result: ReturnedType) => {
                asyncModalContext.deleteModal(id)
                resolve(result);
            }
        });

        const modal = <ModalComponent onClose={onClose!} {...props} />

        asyncModalContext.addModal(id, modal);

        return promise;
    }, [ModalComponent])
}
