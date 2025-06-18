import {
  Collapse,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
  styled,
  useMediaQuery,
} from "@mui/material";
import { parseAsBoolean, useQueryState } from "nuqs";
import { usePathname, useSearchParams } from "next/navigation";

import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import { StyledDrawer } from "./style";
import { menuItems } from "./menu-items";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { viewPort } from "@/theme/constants";

const DrawerHeader = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})<Omit<SidebarHeaderProps, "onClose" | "onOpen">>(({ theme, open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: open ? "flex-end" : "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface SidebarHeaderProps {
  onOpen: () => void;
  onClose: () => void;
  open: boolean;
}

const SidebarHeader = ({ onClose, onOpen, open }: SidebarHeaderProps) => {
  return (
    <DrawerHeader open={open}>
      {open ? (
        <IconButton onClick={onClose}>
          <ChevronLeft />
        </IconButton>
      ) : (
        <IconButton onClick={onOpen}>
          <MenuIcon />
        </IconButton>
      )}
    </DrawerHeader>
  );
};

export default function Sidebar() {
  const isMobile = useMediaQuery(viewPort.small);

  const [open, setOpen] = useQueryState<boolean>("drawerOpen", {
    ...parseAsBoolean,
    defaultValue: !isMobile,
  });

  const { handleSignOut } = useAuth();

  const DrawerType = isMobile ? MuiDrawer : StyledDrawer;

  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();

  return (
    <>
      {isMobile && pathname !== "/home" && pathname !== "/" && (
        <IconButton
          sx={{
            height: "fit-content",
            position: "absolute",
            top: 20,
            zIndex: "1101",
          }}
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      )}
      {pathname !== "/" && (
        <DrawerType
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "#333232",
            },
          }}
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? open : open && !isMobile}
          onClose={() => setOpen(false)}
        >
          <SidebarHeader
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
          />
          <List>
            {menuItems.map(({ label, icon, path, subitems, key }) => (
              <>
                <ListItem
                  component={path && !subitems ? Link : "div"}
                  href={path}
                  onClick={
                    subitems && key // Ensure key is present for subitems logic
                      ? () => {
                          const currentSearchParams = new URLSearchParams(
                            search.toString()
                          );
                          const queryParamName = `open${key}`;

                          if (
                            currentSearchParams.get(queryParamName) === "true"
                          ) {
                            currentSearchParams.delete(queryParamName);
                          } else {
                            currentSearchParams.set(queryParamName, "true");
                          }
                          const newQueryString = currentSearchParams.toString();
                          router.push(
                            newQueryString
                              ? `${pathname}?${newQueryString}`
                              : pathname
                          );
                        }
                      : path // If no subitems, check for a path
                      ? undefined
                      : handleSignOut
                  }
                  key={label}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    selected={pathname === path}
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open
                        ? {
                            justifyContent: "initial",
                          }
                        : {
                            justifyContent: "center",
                          },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: "center",
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: "auto",
                            },
                      ]}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={label}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                    {subitems &&
                      key && ( // Check for key here as well
                        <div>
                          {pathname.includes(key.toLowerCase()) ||
                          search.get(`open${key}`) === "true" ? ( // Consistent check
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </div>
                      )}
                  </ListItemButton>
                </ListItem>

                {subitems &&
                  key && ( // Check for key here as well
                    <Collapse
                      in={
                        pathname.includes(key.toLowerCase()) ||
                        !!search.get(`open${key}`)
                      }
                    >
                      {subitems.map(({ icon, label, path }) => (
                        <ListItem
                          component={Link}
                          href={path}
                          onClick={path ? undefined : handleSignOut}
                          key={label}
                          disablePadding
                          sx={{ display: "block" }}
                        >
                          <ListItemButton
                            selected={
                              !!path &&
                              (pathname.includes(path) || pathname === path)
                            }
                            sx={[
                              {
                                minHeight: 48,
                                px: 2.5,
                                pl: 4,
                              },
                              open
                                ? {
                                    justifyContent: "initial",
                                  }
                                : {
                                    justifyContent: "center",
                                  },
                            ]}
                          >
                            <ListItemIcon
                              sx={[
                                {
                                  minWidth: 0,
                                  justifyContent: "center",
                                },
                                open
                                  ? {
                                      mr: 3,
                                    }
                                  : {
                                      mr: "auto",
                                    },
                              ]}
                            >
                              {icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={label}
                              sx={[
                                open
                                  ? {
                                      opacity: 1,
                                    }
                                  : {
                                      opacity: 0,
                                    },
                              ]}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </Collapse>
                  )}
              </>
            ))}
          </List>
        </DrawerType>
      )}
    </>
  );
}
