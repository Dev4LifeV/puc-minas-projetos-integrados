import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentCheckIcon from "@mui/icons-material/AssignmentTurnedIn";
import CampaignIcon from "@mui/icons-material/Campaign";
import CategoryIcon from "@mui/icons-material/Category";
import HomeIcon from "@mui/icons-material/Home";
import LiquorIcon from "@mui/icons-material/Liquor";
import GroceryIcon from "@mui/icons-material/LocalGroceryStore";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { MenuItemType } from "./type";

export const menuItems: MenuItemType[] = [
  {
    icon: <HomeIcon />,
    path: "/home",
    label: "Início",
  },
  {
    icon: <AssignmentIcon />,
    label: "Pedidos",
    path: "/orders",
  },
  {
    icon: <AssignmentCheckIcon />,
    label: "Pedidos faturados",
    path: "/invoices",
  },
  {
    icon: <LiquorIcon />,
    label: "Produtos",
    path: "/products",
    key: "Products",
    subitems: [
      {
        icon: <AddIcon />,
        label: "Cadastrar produtos",
        key: "Products",
        path: "/products/new",
      },
      {
        icon: <GroceryIcon />,
        label: "Ver ou editar produtos",
        key: "Products",
        path: "/products/edit",
      },
      {
        icon: <CategoryIcon />,
        label: "Categorias",
        key: "Categories",
        path: "/products/categories",
      },
    ],
  },
  {
    icon: <LocalShippingIcon />,
    label: "Bairros",
    path: "/neighborhood",
  },
  {
    icon: <CampaignIcon />,
    label: "Campanhas",
    path: "/campaigns",
  },
  {
    icon: <PersonIcon />,
    path: "/users",
    label: "Usuários",
  },
  {
    icon: <LogoutIcon />,
    label: "Sair do sistema",
  },
];
