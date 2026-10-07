import { logout } from "@/app/actions/auth";
import { LogOutIcon } from "@/app/ui/icons";
import { NavLinks } from "@/app/ui/nav-links";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="app-shell">
      <header className="topnav">
        <NavLinks />
        <div className="topnav-user">
          <form action={logout}>
            <button type="submit" className="topnav-signout">
              <LogOutIcon />
              Sair
            </button>
          </form>
        </div>
      </header>
      <div className="app-main">{children}</div>
    </div>
  );
}
