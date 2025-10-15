import React, { useState } from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  SelectInput,
  required,
  useNotify,
  useRedirect,
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Edit,
} from 'react-admin';
import { Card, CardContent, Typography, Box } from '@mui/material';

const turnoChoices = [
  { id: 'matutino', name: 'Matutino' },
  { id: 'vespertino', name: 'Vespertino' },
  { id: 'nocturno', name: 'Nocturno' },
];

const tipoChoices = [
  { id: 'administrador', name: 'Administrador' },
  { id: 'jefeDeTurno', name: 'Jefe de Turno' },
  { id: 'operador', name: 'Operador' },
  { id: 'operatorU', name: 'Operador U' },
];

export const UsuarioCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = async (data: any) => {
    try {
      const token = sessionStorage.getItem('auth');
      const response = await fetch('http://127.0.0.1:3000/registrarse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authentication': token || '',
        },
        body: JSON.stringify({
          username: data.usuario,
          password: data.password,
          nombre: data.nombre,
          tipo: data.tipo,
          turno: data.turno || null,
        }),
      });

      if (response.ok) {
        notify('Usuario creado exitosamente', { type: 'success' });
        redirect('/usuarios');
      } else if (response.status === 403) {
        notify('El usuario ya existe', { type: 'warning' });
      } else {
        notify('Error al crear usuario', { type: 'error' });
      }
    } catch (error) {
      notify('Error de conexión', { type: 'error' });
    }
  };

  return (
    <Create>
      <SimpleForm onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Registrar Nuevo Usuario
        </Typography>
        
        <TextInput
          source="usuario"
          label="Usuario"
          validate={[required()]}
          fullWidth
        />
        
        <TextInput
          source="nombre"
          label="Nombre Completo"
          validate={[required()]}
          fullWidth
        />
        
        <PasswordInput
          source="password"
          label="Contraseña"
          validate={[required()]}
          fullWidth
        />
        
        <SelectInput
          source="tipo"
          label="Tipo de Usuario"
          choices={tipoChoices}
          validate={[required()]}
          fullWidth
        />
        
        <SelectInput
          source="turno"
          label="Turno (Opcional para operadores y jefes)"
          choices={turnoChoices}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};

export const UsuarioList = () => (
  <List>
    <Datagrid>
      <TextField source="usuario" label="Usuario" />
      <TextField source="nombre" label="Nombre" />
      <TextField source="tipo" label="Tipo" />
      <TextField source="turno" label="Turno" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const UsuarioEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="usuario" label="Usuario" disabled />
      <TextInput source="nombre" label="Nombre Completo" validate={[required()]} />
      <SelectInput
        source="tipo"
        label="Tipo de Usuario"
        choices={tipoChoices}
        validate={[required()]}
      />
      <SelectInput
        source="turno"
        label="Turno"
        choices={turnoChoices}
      />
    </SimpleForm>
  </Edit>
);
