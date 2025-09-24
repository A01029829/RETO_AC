import { SimpleForm, TextInput, useUnique, Create, Edit, required } from 'react-admin';

export const UserCreateForm = () => {
    const unique = useUnique();
    
    return (
        <Create>
            <SimpleForm>
                <TextInput 
                    source="name" 
                    label="Nombre" 
                    validate={required()} 
                />
                <TextInput 
                    source="username" 
                    label="Usuario"
                    validate={[required(), unique()]} 
                />
                <TextInput 
                    source="email" 
                    label="Email"
                    type="email"
                    validate={[required(), unique()]} 
                />
                <TextInput 
                    source="phone" 
                    label="Teléfono" 
                />
                <TextInput 
                    source="website" 
                    label="Sitio Web" 
                />
                <TextInput 
                    source="address.street" 
                    label="Dirección" 
                />
                <TextInput 
                    source="company.name" 
                    label="Nombre de la compañía" 
                />
            </SimpleForm>
        </Create>
    );
};

export const UserEditForm = () => {
    const unique = useUnique();
    
    return (
        <Edit>
            <SimpleForm>
                <TextInput 
                    source="id" 
                    label="ID" 
                    disabled 
                />
                <TextInput 
                    source="name" 
                    label="Nombre" 
                    validate={required()} 
                />
                <TextInput 
                    source="username" 
                    label="Usuario"
                    validate={[required(), unique()]} 
                />
                <TextInput 
                    source="email" 
                    label="Email"
                    type="email"
                    validate={[required(), unique()]} 
                />
                <TextInput 
                    source="phone" 
                    label="Teléfono" 
                />
                <TextInput 
                    source="website" 
                    label="Sitio Web" 
                />
                <TextInput 
                    source="address.street" 
                    label="Dirección" 
                />
                <TextInput 
                    source="company.name" 
                    label="Nombre de la compañía" 
                />
            </SimpleForm>
        </Edit>
    );
};