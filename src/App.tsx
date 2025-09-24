import { Admin, Resource, ShowGuesser } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { UserList } from "./users";
import { PostList, PostEdit, PostCreate, PostShow } from "./posts";
import { commentsList, commentsEdit, commentsCreate, commentsShow } from "./comments";
import { albumList, albumEdit, albumCreate, albumShow } from "./albums";
import { photoList, photoEdit, photoCreate, photoShow } from "./photos";
import { todosList, todosEdit, todosCreate} from "./todos";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import CommentIcon from '@mui/icons-material/Comment';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import PhotoIcon from '@mui/icons-material/Photo';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Dashboard } from './Dashboard';
import { authProvider } from './authProvider';
import { i18nProvider } from './i18nProvider';
import { MyLoginPage } from './MyLoginPage';
import { UserCreateForm, UserEditForm } from './useUnique';

export const App = () => (
    <Admin dataProvider={dataProvider} dashboard={Dashboard} layout={Layout} authProvider={authProvider} i18nProvider={i18nProvider} loginPage={MyLoginPage}>
        <Resource
            name="users"
            list={UserList}
            create={UserCreateForm}
            edit={UserEditForm}
            show={ShowGuesser}
            icon={UserIcon}
        />
        <Resource
            name="posts"
            list={PostList}
            edit={PostEdit}
            create={PostCreate}
            show={PostShow}
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
    </Admin>
)


