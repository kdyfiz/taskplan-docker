import './header.scss';

import React, { useState } from 'react';
import { Storage, Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';
import LoadingBar from 'react-redux-loading-bar';
import { Menu, X, Home, Users, Settings, User, LogOut, Globe } from 'lucide-react';

import { useAppDispatch } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';
import { Button } from 'app/shared/components/ui/button';
import { Badge } from 'app/shared/components/ui/badge';
import { cn } from 'app/shared/lib/utils';

import { AccountMenu, AdminMenu, EntitiesMenu, LocaleMenu } from '../menus';

export interface IHeaderModernProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  currentLocale: string;
}

const HeaderModern = (props: IHeaderModernProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useAppDispatch();

  const handleLocaleChange = event => {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);
    dispatch(setLocale(langKey));
  };

  const renderDevRibbon = () =>
    props.isInProduction === false ? (
      <div className="absolute top-0 right-0 z-50">
        <Badge variant="warning" className="rounded-none rounded-bl-md">
          <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
        </Badge>
      </div>
    ) : null;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {renderDevRibbon()}
      <LoadingBar className="loading-bar" />

      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">T</div>
            <span className="font-bold text-xl">TaskPlan</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {props.isAuthenticated && (
              <>
                <Link to="/" className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary">
                  <Home className="h-4 w-4" />
                  <span>
                    <Translate contentKey="global.menu.home">Home</Translate>
                  </span>
                </Link>

                <Link to="/task" className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary">
                  <span>
                    <Translate contentKey="global.menu.entities.task">Tasks</Translate>
                  </span>
                </Link>

                {props.isAdmin && (
                  <Link to="/admin" className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary">
                    <Settings className="h-4 w-4" />
                    <span>
                      <Translate contentKey="global.menu.admin.main">Administration</Translate>
                    </span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Locale Selector */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Globe className="h-4 w-4 mr-1" />
              {props.currentLocale.toUpperCase()}
            </Button>

            {/* Account Menu */}
            {props.isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-1" />
                  <Translate contentKey="global.menu.account.main">Account</Translate>
                </Button>
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <Translate contentKey="global.menu.account.login">Sign in</Translate>
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/account/register">
                    <Translate contentKey="global.menu.account.register">Register</Translate>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleMenu}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <nav className="container px-4 py-4 space-y-3">
              {props.isAuthenticated ? (
                <>
                  <Link
                    to="/"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>
                      <Translate contentKey="global.menu.home">Home</Translate>
                    </span>
                  </Link>

                  <Link
                    to="/task"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>
                      <Translate contentKey="global.menu.entities.task">Tasks</Translate>
                    </span>
                  </Link>

                  {props.isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>
                        <Translate contentKey="global.menu.admin.main">Administration</Translate>
                      </span>
                    </Link>
                  )}

                  <div className="border-t pt-3 space-y-3">
                    <Link
                      to="/account/settings"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>
                        <Translate contentKey="global.menu.account.main">Account</Translate>
                      </span>
                    </Link>
                    <button
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent w-full text-left"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>
                        <Translate contentKey="global.menu.account.logout">Sign out</Translate>
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>
                      <Translate contentKey="global.menu.account.login">Sign in</Translate>
                    </span>
                  </Link>
                  <Link
                    to="/account/register"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>
                      <Translate contentKey="global.menu.account.register">Register</Translate>
                    </span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default HeaderModern;
