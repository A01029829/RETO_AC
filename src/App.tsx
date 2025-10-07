import { Admin, Resource, ShowGuesser, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { UserList } from "./users";
import { ReporteEHList, ReporteEHEdit, ReporteEHCreate, ReporteEHShow } from "./ReporteEH";
import {
  commentsList,
  commentsEdit,
  commentsCreate,
  commentsShow,
} from "./comments";
import { albumList, albumEdit, albumCreate, albumShow } from "./albums";
import { photoList, photoEdit, photoCreate, photoShow } from "./photos";
import { todosList, todosEdit, todosCreate } from "./todos";
import {
  ReporteEUCreate,
  ReporteEUEdit,
  ReporteEUShow,
  ReporteEUList,
} from "./ReportesEU";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import CommentIcon from "@mui/icons-material/Comment";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import PhotoIcon from "@mui/icons-material/Photo";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Dashboard } from "./Dashboard";
import { authProvider } from "./authProvider";
import { i18nProvider } from "./i18nProvider";
import { MyLoginPage } from "./MyLoginPage";
import { notaCreate, notaEdit, notaList, notaShow } from "./notas";
import { OperatorPage } from "./operador";
import { UserCreateForm, UserEditForm } from "./useUnique";
import { CommentBankRounded } from "@mui/icons-material";
import { JefeDeTurnoPage } from "./JefeDeTurno";
import { createTheme } from "@mui/material";
import { OperatorUPage } from "./operatorU";
const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

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
      name="Emerg Prehospitalarias"
      list={ReporteEHList}
      edit={ReporteEHEdit}
      create={ReporteEHCreate}
      show={ReporteEHShow}
      icon={PostIcon}
    />
    <Resource
      name="comments"
      list={commentsList}
      edit={commentsEdit}
      create={commentsCreate}
      show={commentsShow}
      icon={CommentIcon}
    />
    <Resource
      name="albums"
      list={albumList}
      edit={albumEdit}
      create={albumCreate}
      show={albumShow}
      icon={PhotoAlbumIcon}
    />
    <Resource
      name="photos"
      list={photoList}
      edit={photoEdit}
      create={photoCreate}
      show={photoShow}
      icon={PhotoIcon}
    />
    <Resource
      name="todos"
      list={todosList}
      edit={todosEdit}
      create={todosCreate}
      show={ShowGuesser}
      icon={FormatListBulletedIcon}
    />
    <Resource
      name="Reportes Emergencias Urbanas"
      list={ReporteEUList}
      edit={ReporteEUEdit}
      create={ReporteEUCreate}
      show={ReporteEUShow}
      icon={FormatListBulletedIcon}
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
    </CustomRoutes>
  </Admin>
);
