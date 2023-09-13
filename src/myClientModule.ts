import type { ClientModule } from '@docusaurus/types';

const module: ClientModule = {
  onRouteUpdate({ location }) {
    if (!(location.pathname.startsWith('/zh-cn') || location.pathname.startsWith('/en'))) {
      window.location.href = `/zh-cn${location.pathname}`;
    }
  },
};
export default module;
