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
//import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
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
//import { createTheme } from "@mui/material";
import { OperatorUPage } from "./operatorU";
import { StatisticsPanel } from "./StatsPanel";
// const lightTheme = createTheme({
//   palette: {
//     mode: "light",
//   },
// });

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
    <Resource
      name="users"
      list={UserList}
      create={UserCreateForm}
      edit={UserEditForm}
      show={ShowGuesser}
      icon={UserIcon}
    />
    <Resource
      name="reportesEH"
      options={{ label: 'Reportes Emergencias Hospitalarias' }}
      list={ReporteEHList}
      edit={ReporteEHEdit}
      create={ReporteEHCreate}
      show={ReporteEHShow}
      icon={PostIcon}
    />
    <Resource
      name="reportesEU"
      options={{ label: 'Reportes Emergencias Urbanas' }}
      list={ReporteEUList}
      create={ReporteEUCreate}
      edit={ReporteEUEdit}
      show={ReporteEUShow}
    />
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
  </Admin>
);
