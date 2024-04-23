import { useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { IconHome, IconLogout, IconMenu2, IconTransfer, IconUsers } from '@tabler/icons-react';
import { AuthContext } from '../context';
import { Logo } from '../assets/images';
import { classNames } from '../utils';

const navigation = [
  { name: 'Inicio', href: '/', icon: IconHome },
  { name: 'Usuarios', href: '/usuarios', icon: IconUsers },
  { name: 'Transacciones', href: '/transacciones', icon: IconTransfer },
];

const Layout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const routeName = navigation.find(x => x.href === location.pathname)?.name || '';

  const toggleSidebar = () => {
    const items = document.getElementsByClassName('desk-sidebar');
    for (let key = 0; key < items.length; key++) {
      items.item(key).classList.toggle('open');
    }
  }

  return (
    <div id="layout">
      <div className="desk-sidebar desk-sidebar__header">
        <div className="sidebar-logo">
          <div className="sidebar-logo__wrapper">
            <img className="sidebar-logo__cropped" src={Logo} alt={process.env.REACT_APP_NAME} />
            <img className="sidebar-logo__normal" src={Logo} alt={process.env.REACT_APP_NAME} />
          </div>
        </div>
        <div className="desk-headerbar">
          <button type="button" className="-mr-2.5 p-2.5 text-foreground" onClick={toggleSidebar}>
            <span className="sr-only">Open sidebar</span>
            <IconMenu2 />
          </button>

          <div className="h-6 w-px bg-gray-200" aria-hidden="true" />

          <div className="flex gap-4 items-center">
            <div id="desk-headerbar-left-slot" className="hidden" />
            <span className="font-medium text-lg">{ routeName }</span>
          </div>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6"></div>
          </div>
        </div>
      </div>

      <SideBar />

      <main>
        {!!user && <Outlet />}
      </main>
    </div>
  )
}

const SideBar = () => {
  const location = useLocation();

  return (
    <div className="desk-sidebar">
      <aside>
        <div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col -mx-2 space-y-1">
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={index} className="menu-item" title={item.name}>
                    <Link
                      to={item.href}
                      className={classNames(
                        isActive
                          ? 'text-primary active'
                          : 'text-foreground-600 hover:text-primary',
                        'group flex gap-x-3 rounded-md p-2 leading-6 font-semibold'
                      )}
                    >
                      <item.icon className={classNames('aspect-square shrink-0', isActive ? 'text-primary':'text-foreground-600 group-hover:text-foreground')} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
              <li className="menu-item" title="Cerrar sesión">
                <Link
                  to="/logout"
                  className="text-foreground-600 hover:text-primary group flex gap-x-3 rounded-md p-2 leading-6 font-semibold"
                >
                  <IconLogout className="aspect-square shrink-0 text-foreground-600 group-hover:text-foreground" />
                  <span>Cerrar sesión</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  )
}

export default Layout;