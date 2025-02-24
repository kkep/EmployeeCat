import {Notification} from "@vaadin/react-components/Notification";
import { Button, Dialog, GridColumn, Icon } from "@vaadin/react-components";
import React, { useRef, useState } from "react";
import {AutoGrid, AutoGridRef} from "@vaadin/hilla-react-crud";

export abstract class Page {
    private readonly grid: any;
    hiddenColumns: string[] = [];

    editDialogOpened = useState(false)
    deleteDialogOpened = useState(false)

    modelForDelete: any;
    modelForEdit: any;

    constructor() {
        this.grid = useRef<AutoGridRef>(null);
        this.modelForDelete = useState(this.newModel());
        this.modelForEdit = useState(this.newModel());
    }

    abstract getService(): any;
    abstract getModel(): any

    abstract newModel(): any

    delDialogTitle<T>(model: T) {
        return 'Удалить запись';
    }

    delDialogQuestion<T>(model: T) {
        return 'Вы действительно хотите удалить эту запись?';
    }

    gridRefresh() {
        this.grid.current.refresh()
    }

    deleteDialogClose() {
        this.deleteDialogOpened[1](() => false);
    }

    deleteDialogOpen() {
        this.deleteDialogOpened[1](() => true);
    }

    editDialogClose() {
        this.editDialogOpened[1](() => false);
    }

    editDialogOpen() {
        this.editDialogOpened[1](() => true);
    }

    actionButtons<T>(model: T) {
        return <>
            <Button onClick={() => {this.modelForEdit[1](model); this.editDialogOpen()}}>
                <Icon icon="lumo:edit" />
            </Button>
            <Button onClick={() => {this.modelForDelete[1](model); this.deleteDialogOpen()}}>
                <Icon icon="lumo:cross" />
            </Button>
        </>
    }

    save(...params: any[]) {
        this.getService().save(...params)
            .then(()=> {
                this.editDialogClose();
                this.gridRefresh()
                const notification = Notification.show('Изменения сохранены', {
                    position: 'top-center',
                    duration: 0,
                    theme: 'success',
                });
                setTimeout(() => {
                    notification.close();
                }, 1000);
            });
    }

    abstract EditDialog(): JSX.Element

    DeleteDialog(){
        const del = () => {
            this.getService().delete(this.modelForDelete[0].id)
                .then(()=> {
                    this.deleteDialogClose();
                    this.gridRefresh()
                    const notification = Notification.show('Сотрудник удален', {
                        position: 'top-center',
                        duration: 0,
                        theme: 'success',
                    });
                    setTimeout(() => {
                        notification.close();
                    }, 1000);
                });
        }

        return <>
            <Dialog
                headerTitle={this.delDialogTitle(this.modelForDelete[0])}
                opened={this.deleteDialogOpened[0]}
                onClosed={() => this.deleteDialogClose()}
                footer={
                    <>
                        <Button theme="primary error" onClick={() => del()} style={{ marginRight: 'auto' }}>
                            Удалить
                        </Button>
                        <Button theme="tertiary" onClick={() => this.deleteDialogClose()}>
                            Отмена
                        </Button>
                    </>
                }
            >
                {this.delDialogQuestion(this.modelForDelete[0])}
            </Dialog>
        </>
    }

    columnOptions() {
        return {};
    }

    addNewRow() {
        this.modelForEdit[1](this.newModel())
        this.editDialogOpen()
    }

    backLink(): JSX.Element {
        return <></>
    }

    render<T>() {
        const actionButtonsRenderer = ({ item }: { item: T }) => {
            return this.actionButtons(item);
        }

        return <>
            {this.DeleteDialog()}
            {this.EditDialog()}

            <div style={{display: 'flex', gap: "10px", alignItems: 'center'}}>
                {this.backLink()}
                <Button onClick={() => this.addNewRow()}>
                    <Icon icon="lumo:plus" />
                    Добавить
                </Button>
            </div>

            <AutoGrid
                ref={this.grid}
                hiddenColumns={this.hiddenColumns}
                model={this.getModel()}
                service={this.getService()}
                columnOptions={this.columnOptions()}
                customColumns={[
                    <GridColumn key="actions"
                                header="Actions"
                                renderer={actionButtonsRenderer}
                                autoWidth />
                ]}
            />
        </>
    }
}