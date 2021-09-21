import {Store} from 'vuex';
import {cloneArray} from '@/utils/object';
import {PLUGIN_UI_COMPONENT_TYPE_TAB, PLUGIN_UI_COMPONENT_TYPE_VIEW} from '@/constants/plugin';
import {loadModule} from '@/utils/sfc';
import {Router} from 'vue-router';
import useRequest from '@/services/request';

type Plugin = CPlugin;

const PLUGIN_PROXY_ENDPOINT = '/plugin-proxy';

const {
  getRaw,
} = useRequest();

const getStoreNamespaceFromRoutePath = (path: string): ListStoreNamespace => {
  const arr = path.split('/');
  let ns = arr[1];
  if (ns.endsWith('s')) {
    ns = ns.substr(0, ns.length - 1);
  }
  return ns as ListStoreNamespace;
};

const initPluginSidebarMenuItems = (store: Store<RootStoreState>) => {
  const {
    layout,
    plugin: state,
  } = store.state;

  // sidebar menu items
  const menuItems = cloneArray(layout.menuItems);

  // add plugin nav to sidebar navs
  state.allList.forEach(p => {
    p.ui_sidebar_navs?.forEach(nav => {
      const sidebarPaths = layout.menuItems.map(d => d.path);
      if (!sidebarPaths.includes(nav.path)) {
        menuItems.push(nav);
      }
    });
  });

  // set sidebar menu items
  store.commit(`layout/setMenuItems`, menuItems);
};

const addPluginRouteTab = (router: Router, store: Store<RootStoreState>, p: Plugin, pc: PluginUIComponent) => {
  // current routes paths
  const routesPaths = router.getRoutes().map(r => r.path);

  // iterate parent paths
  pc.parent_paths?.forEach(parentPath => {
    // plugin route path
    const pluginPath = `${parentPath}/${pc.path}`;

    // skip if new route path is already in the routes
    if (routesPaths.includes(pluginPath)) return;

    // parent route
    const parentRoute = router.getRoutes().find(r => r.path === parentPath);
    if (!parentRoute) return;

    // add route
    router.addRoute(parentRoute.name?.toString() as string, {
      name: `${parentRoute.name?.toString()}-${pc.name}`,
      path: pc.path as string,
      component: () => loadModule(`${PLUGIN_PROXY_ENDPOINT}/${p.name}/_ui/${pc.src}`)
    });

    // add tab
    const ns = getStoreNamespaceFromRoutePath(pluginPath);
    const state = store.state[ns];
    const tabs = cloneArray(state.tabs);
    if (tabs.map(t => t.id).includes(pc.name as string)) return;
    tabs.push({
      id: pc.name as string,
      title: pc.title,
    });
    store.commit(`${ns}/setTabs`, tabs);
  });
};

const addPluginRouteView = (router: Router, p: Plugin, pc: PluginUIComponent) => {
  // current routes paths
  const routesPaths = router.getRoutes().map(r => r.path);

  // plugin route path
  const pluginPath = pc.path;

  // skip if plugin route already added
  if (routesPaths.includes(pluginPath as string)) return;

  // add route
  router.addRoute('Root', {
    name: pc.name,
    path: pc.path as string,
    component: () => loadModule(`${PLUGIN_PROXY_ENDPOINT}/${p.name}/_ui/${pc.src}`)
  });
};

const initPluginRoutes = (router: Router, store: Store<RootStoreState>) => {
  // store
  const {
    plugin: state,
  } = store.state as RootStoreState;

  // add plugin routes
  state.allList.forEach(p => {
    p.ui_components?.forEach(pc => {
      // skip if path is empty
      if (!pc.path) return;

      switch (pc.type) {
        case PLUGIN_UI_COMPONENT_TYPE_VIEW:
          addPluginRouteView(router, p, pc);
          break;
        case PLUGIN_UI_COMPONENT_TYPE_TAB:
          addPluginRouteTab(router, store, p, pc);
          break;
      }
    });
  });
};

const initPluginAssets = (store: Store<RootStoreState>) => {
  const {
    plugin: state,
  } = store.state;

  state.allList.forEach(async p => {
    if (!p.ui_assets) return;
    for (const asset of p.ui_assets) {
      const url = `${PLUGIN_PROXY_ENDPOINT}/${p.name}/_ui/${asset.path}`;
      const res = await getRaw(url);
      const textContent = res.data;
      if (asset.type === 'css') {
        const el = Object.assign(document.createElement('style'), {textContent});
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(el, ref);
      } else if (asset.type === 'js') {
        const el = Object.assign(document.createElement('script'), {textContent});
        const ref = document.head.getElementsByTagName('script')[0] || null;
        document.head.insertBefore(el, ref);
      }
    }
  });
};

export const initPlugins = async (router: Router, store: Store<RootStoreState>) => {
  // store
  const ns = 'plugin';
  const {
    plugin: state,
  } = store.state as RootStoreState;

  // skip if not logged-in
  if (!localStorage.getItem('token')) return;

  // skip if all plugin list is already fetched
  if (state.allList.length) return;

  // get all plugin list
  await store.dispatch(`${ns}/getAllList`);

  initPluginSidebarMenuItems(store);

  initPluginRoutes(router, store);

  initPluginAssets(store);
};

