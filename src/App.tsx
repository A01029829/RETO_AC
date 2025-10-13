import { Admin, Resource, ShowGuesser, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { UserList } from "./users";
import { ReporteEHList, ReporteEHEdit, ReporteEHCreate, ReporteEHShow } from "./ReporteEH";
import {
  ReporteEUCreate,
  ReporteEUEdit,
  ReporteEUShow,
  ReporteEUList,
} from "./ReportesEU";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import { Dashboard } from "./Dashboard";
import { authProvider } from "./authProvider";
import { i18nProvider } from "./i18nProvider";
import { MyLoginPage } from "./MyLoginPage";
import { notaCreate, notaEdit, notaList, notaShow } from "./notas";
import { OperatorPage } from "./operador";
import { UserCreateForm, UserEditForm } from "./useUnique";
import { CommentBankRounded } from "@mui/icons-material";
import { JefeDeTurnoPage } from "./JefeDeTurno";
import { AdminDashboard } from "./AdminDashboard";
import { OperatorUPage } from "./operatorU";
import { StatisticsPanel } from "./StatsPanel";
import { UsuarioCreate, UsuarioList, UsuarioEdit } from "./registrarUsuarios";

export const App = () => (
  <Admin
    dataProvider={dataProvider}
    dashboard={Dashboard}
    layout={Layout}
    authProvider={authProvider}
    i18nProvider={i18nProvider}
    loginPage={MyLoginPage}
    defaultTheme="light"
  >
    {(permissions) => (
      <>
        {/* Recurso de usuarios - Solo para administradores */}
        {permissions === 'administrador' && (
          <Resource
            name="usuarios"
            list={UsuarioList}
            create={UsuarioCreate}
            edit={UsuarioEdit}
            icon={UserIcon}
            options={{ label: 'Gestión de Usuarios' }}
          />
        )}

        {/* Reportes Emergencias Hospitalarias - Todos los usuarios */}
        <Resource
          name="reportesEH"
          options={{ label: 'Reportes Emergencias Hospitalarias' }}
          list={ReporteEHList}
          edit={ReporteEHEdit}
          create={ReporteEHCreate}
          show={ReporteEHShow}
          icon={PostIcon}
        />

        {/* Reportes Emergencias Urbanas - Todos los usuarios */}
        <Resource
          name="reportesEU"
          options={{ label: 'Reportes Emergencias Urbanas' }}
          list={ReporteEUList}
          create={ReporteEUCreate}
          edit={ReporteEUEdit}
          show={ReporteEUShow}
        />

        {/* Notas - Todos los usuarios */}
        <Resource
          name="Notas"
          list={notaList}
          edit={notaEdit}
          create={notaCreate}
          show={notaShow}
          icon={CommentBankRounded}
        />

        <CustomRoutes>
          <Route path="/operator" element={<OperatorPage />}></Route>
          <Route path="/jefeDeTurno" element={<JefeDeTurnoPage />}></Route>
          <Route path="/operatorU" element={<OperatorUPage />}></Route>
          <Route path="/admin" element={<AdminDashboard />}></Route>
          <Route path="/stats" element={<StatisticsPanel />} />
        </CustomRoutes>
      </>
    )}
  </Admin>
);
