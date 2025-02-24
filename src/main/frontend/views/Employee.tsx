import EmployeeModel from 'Frontend/generated/com/example/employeecat/employee/EmployeeModel';
import { EmployeeService } from 'Frontend/generated/endpoints';
import {
    Button,
    Dialog,
    Icon,
    Item,
    ListBox,
    TextField,
    TextFieldValueChangedEvent,
    VerticalLayout
} from '@vaadin/react-components';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import Employee from 'Frontend/generated/com/example/employeecat/employee/Employee';
import { useSignal } from '@vaadin/hilla-react-signals';
import { Link } from 'react-router-dom';
import Cat from 'Frontend/generated/com/example/employeecat/cat/Cat';
import { Page } from 'Frontend/views/Page';

class NewEmployee implements Employee{
    id?:number;
    firstName?:string
    lastName?:string
    cats?:Array<any>
}

class EmployeePage extends Page{

    delDialogTitle(model: any) {
        return `Удалить сотрудника ${model?.firstName} ${model?.lastName}`;
    }

    delDialogQuestion<T>(model: T) {
        return 'Вы действительно хотите удалить этого сотрудника?';
    }

    getService(): any {
        return EmployeeService;
    }

    columnOptions() {
        return {
            employee: {
                sortable: false,
                renderer: (e: any) => {
                    const employee = e.item.employee
                    return <>
                        {employee.firstName} {employee.lastName}
                    </>
                }
            }
        }
    }

    getModel(): any {
        return EmployeeModel;
    }

    newModel(): any {
        return new NewEmployee();
    }

    backLink(): JSX.Element {
        return <>
            <Link to="/cat"><Icon icon="lumo:angle-left" /> Кошки</Link>
        </>
    }

    EditDialog(){
        let employee = this.modelForEdit[0];
        let [cats, setCats] = useState([] as (Cat | undefined)[]);

        const newCatNameInputRef: MutableRefObject<any> = useRef();

        useEffect(() => {
            setCats(employee.cats ?? []);
        }, [employee])

        let newCatName = useSignal('')

        const close = () => {
            newCatNameInputRef.current.value = '';
            this.editDialogClose()
            newCatName.value = '';
            setCats([])
        }

        const save = () => {
            employee.cats = cats.filter((cat) => {
                return !!cat!.id || !cat!.deleted
            });
            this.save(employee);
        }

        const employeeFirstNameChange = (e: TextFieldValueChangedEvent) => {
            if (employee) {
                employee.firstName = (e.target as any).value;
            }
        }

        const employeeLastNameChange = (e:  TextFieldValueChangedEvent) => {
            employee.lastName = (e.target as any).value;
        }

        const setNewCatName = (e: TextFieldValueChangedEvent) => {
            newCatName.value = (e.target as any).value;
        }

        const addNewCat = () => {
            if (!Array.isArray(employee.cats)) {
                employee.cats = [];
            }

            setCats((prev) => [...prev, {
                nickname: newCatName.value,
                deleted: false,
            }]);
        }

        const selectedCatsChange = (e: any)=> {
            cats.map((cat, index) => {
                cat!.deleted = e.detail.value.includes(index);
            });

            setCats((prev) => [...cats]);
        }

        return <>
            <Dialog
                headerTitle={employee.id ? `Редактирование` : 'Новый'}
                opened={this.editDialogOpened[0]}
                onClosed={() => close()}
                footer={
                    <>
                        <Button theme="tertiary" onClick={() => this.editDialogClose()} style={{ marginRight: 'auto' }}>
                            Отмена
                        </Button>
                        <Button theme="primary " onClick={() => save()}>
                            Сохранить
                        </Button>
                    </>
                }
            >
                <VerticalLayout style={{ alignItems: 'stretch' }}>
                    <TextField
                        label="Имя"
                        value={employee.firstName}
                        onValueChanged={(e) => employeeFirstNameChange(e)}
                    />
                    <TextField
                        label="Фамилия"
                        value={employee.lastName}
                        onValueChanged={(e) => employeeLastNameChange(e)}
                    />
                </VerticalLayout>
                <br/>
                <b>Список кошек:</b>
                { cats.length ? '' : <i style={{fontSize: '10pt'}}>У сотрудника пока нет кошек</i> }
                <ListBox multiple onSelectedValuesChanged={(e) => selectedCatsChange(e)}>
                    {cats.map((cat: any, index) => {
                        return <Item key={index}>
                            { cat.deleted ? <del>{cat.nickname}</del> : cat.nickname}
                        </Item>
                    })}
                </ListBox>
                { cats.length ? <i style={{fontSize: '10pt'}}>*Помеченные будут удалены</i> : '' }


                <VerticalLayout style={{ alignItems: 'stretch' }}>
                    <TextField
                        label="Кличка кошки"
                        onValueChanged={(e) => setNewCatName(e)}
                        ref={newCatNameInputRef}
                    />
                    <Button theme="primary " onClick={() => addNewCat()}>
                        Добавить
                    </Button>
                </VerticalLayout>
            </Dialog>
        </>
    }
}

export function EmployeeView() {
    return (new EmployeePage()).render();
}