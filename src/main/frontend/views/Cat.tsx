import {CatService, EmployeeService} from 'Frontend/generated/endpoints';
import {Page} from "Frontend/views/Page";
import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import CatDTOModel from "Frontend/generated/com/example/employeecat/cat/CatDTOModel";
import employee from "Frontend/generated/com/example/employeecat/employee/Employee";
import {Link} from "react-router-dom";
import {
    Button,
    Dialog,
    Icon,
    Select,
    TextField,
    TextFieldValueChangedEvent,
    VerticalLayout
} from "@vaadin/react-components";
import {useSignal} from "@vaadin/hilla-react-signals";
import Employee from "Frontend/generated/com/example/employeecat/employee/Employee";

class NewCat {
    id: undefined
    nickname = ''
    employee = { id: undefined }
}

interface CatInterface {
    id: number | undefined;
    nickname: string;
    employee: any
}

class CatPage extends Page{
    hiddenColumns = ['deleted'];

    delDialogTitle(model: any) {
        return 'Удалить кота ' + model?.nickname;
    }

    delDialogQuestion<T>(model: T) {
        return 'Вы действительно хотите удалить этого кота?';
    }

    getService(): any {
        return CatService;
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
        return CatDTOModel;
    }

    newModel(): any {
        return new NewCat();
    }

    backLink(): JSX.Element {
        return <>
            <Link to="/employee"><Icon icon="lumo:angle-left" /> Сотрудники</Link>
        </>
    }

    EditDialog(){
        let cat: CatInterface = this.modelForEdit[0];

        const [employees, setEmployees] = useState([] as any);

        const close = () => {
            this.editDialogClose();
        }

        useEffect(() => {
            EmployeeService.all().then(list => {
                const values: any[] = [];
                list?.forEach((employee) => {
                    values.push({
                        label: `${employee?.firstName} ${employee?.lastName}`,
                        value: employee?.id
                    })
                })
                setEmployees(values);
            })
        }, [cat])

        const save = () => {
            this.save({
                id: cat.id,
                nickname: cat.nickname,
                deleted: false,
            }, cat.employee.id);
        }

        const nicknameChange = (e: TextFieldValueChangedEvent) => {
            cat.nickname = (e.target as any).value;
        }

        const ownerChanged = (e: any) => {
            cat.employee.id = +e.target.value;
        }

        return <>
            <Dialog
                headerTitle={cat.id ? `Редактирование` : 'Новый'}
                opened={this.editDialogOpened[0]}
                onClosed={() => close()}
                footer={
                    <>
                        <Button theme="tertiary" onClick={() => close()} style={{ marginRight: 'auto' }}>
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
                        label="Кличка кота"
                        value={cat.nickname}
                        onValueChanged={(e) => nicknameChange(e)}
                    />

                    <label style={{display: 'flex', flexDirection: 'column'}}>
                        Сотрудник:
                        <select onChange={ownerChanged} defaultValue={cat.employee.id}>
                            {employees.map((e: any, index: number) => {
                                return <option key={index} value={e.value}>{e.label}</option>
                            })}
                        </select>
                    </label>

                </VerticalLayout>
            </Dialog>
        </>
    }
}

export function Cat() {
    return (new CatPage()).render();
}