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
  { id: 'LV_0815', name: 'Lunes a viernes, 8:00 a 15:00 horas' },
  { id: 'LV_1521', name: 'Lunes a viernes, 15:00 a 21:00 horas' },
  { id: 'LMV_2108', name: 'Lunes, miércoles y viernes, 21:00 a 8:00 horas' },
  { id: 'MJD_2108', name: 'Martes, jueves y domingo, 21:00 a 8:00 horas' },
  { id: 'SD_0820', name: 'Sábados, domingos y festivos, 8:00 a 20:00 horas' },
  { id: 'SD_2008', name: 'Sábados, domingos y festivos, 20:00 a 8:00 horas' },
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
      const apiUrl = import.meta.env.VITE_JSON_SERVER_URL || 'https://localhost:3000';
      const response = await fetch(`${apiUrl}/registrarse`, {
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
