import React, { PropsWithChildren, useState } from "react";
import AsyncModalContext from './context';

export default function AsyncModalProvider(props: PropsWithChildren<{}>) {
    const [modals, setModals] = useState<{
        id: number,
        modal: React.ReactNode
    }[]>([]);

    function addModal(id: number, modal: React.ReactNode) {
        setModals(modals => ([...modals, { id, modal }]));
    }

    function deleteModal(id: number) {
        setModals(modals => [...modals.filter(m => m.id != id)]);
    }

    return (
        <AsyncModalContext.Provider value={{ addModal, deleteModal }}>
            {props.children}
            {modals.map(modal => <React.Fragment key={modal.id}>{modal.modal}</React.Fragment>)}
        </AsyncModalContext.Provider>
    )
}
