import {useRouteMatch} from "react-router-dom";

export interface HelpPageType {
  name: string,
  slug: string,
  lazy: () => Promise<string>,

  active?: boolean,
  path?: string,
}

export const HELP_PAGES: HelpPageType[] = [
  {
    slug: 'how_to_use',
    name: 'Как использовать',
    lazy: () => import("!!raw-loader!../../docs/how_to_use.md").then(m => m.default)
  },
  {
    slug: 'profile',
    name: 'Профиль элементов',
    lazy: () => import("!!raw-loader!../../docs/profile.md").then(m => m.default)
  },
  {
    slug: 'technique',
    name: 'Методика расчета',
    lazy: () => import("!!raw-loader!../../docs/technique.md").then(m => m.default)
  },
  {
    slug: 'chelates',
    name: 'Изготовление хелатов',
    lazy: () => import("!!raw-loader!../../docs/chelates/README.md").then(m => m.default)
  },
]

export const HELP_PAGE_MAP: { [x: string]: HelpPageType } = Object.fromEntries(HELP_PAGES.map(p => [p.slug, p]))

function buildHelpPagesList(slug: string|null): Required<HelpPageType>[] {
  return HELP_PAGES.map(p => {
    return {
      ...p,
      active: p.slug === slug,
      path: '/help/' + p.slug
    }
  })
}

export function useHelpPagesList(): Required<HelpPageType>[] {
  const match = useRouteMatch<{ slug: string }>({
    path: "/help/:slug?",
  });
  return buildHelpPagesList(match?.params?.slug || null)
}
