import { useRouteMatch } from "react-router-dom";

export interface HelpPageType {
  name: string;
  slug: string;
  lazy: () => Promise<string>;
  active?: boolean;
  path?: string;
  children?: HelpPageType[];
}

interface RequiredHelpPageType extends Required<HelpPageType> {
  children: RequiredHelpPageType[];
}

export type HelpPageListType = RequiredHelpPageType[];
export type HelpPageMapType = { [x: string]: RequiredHelpPageType };

export const HELP_PAGES: HelpPageType[] = [
  {
    slug: "how_to_use",
    name: "Как использовать",
    lazy: () => import("../../docs/how_to_use.md?raw").then((m) => m.default),
  },
  {
    slug: "newbie-guide",
    name: "Гайд для новичка",
    lazy: () => import("../../docs/newbie-guide.md?raw").then((m) => m.default),
  },
  {
    slug: "profile",
    name: "Профиль элементов",
    lazy: () => import("../../docs/profile/README.md?raw").then((m) => m.default),
    children: [
      {
        slug: "example",
        name: "Примеры профилей",
        lazy: () => import("../../docs/profile/example.md?raw").then((m) => m.default),
      },
    ],
  },
  {
    slug: "technique",
    name: "Методика расчета",
    lazy: () => import("../../docs/technique.md?raw").then((m) => m.default),
  },
  {
    slug: "chelates",
    name: "Изготовление хелатов",
    lazy: () => import("../../docs/chelates/README.md?raw").then((m) => m.default),
  },
  {
    slug: "safety",
    name: "Техника безопасности",
    lazy: () => import("../../docs/safety/README.md?raw").then((m) => m.default),
    children: [
      {
        slug: "chem_table",
        name: "Таблица опасности веществ",
        lazy: () => import("../../docs/safety/chem_table.md?raw").then((m) => m.default),
      },
    ],
  },
  {
    slug: "light",
    name: "Светокультура",
    lazy: () => import("../../docs/light.md?raw").then((m) => m.default),
  },
  {
    slug: "builds",
    name: "Виды установок",
    lazy: () => import("../../docs/builds/README.md?raw").then((m) => m.default),
  },
  {
    slug: "references",
    name: "Ссылки и литература",
    lazy: () => import("../../docs/references.md?raw").then((m) => m.default),
  },
];

export const HELP_PAGE_MAP: { [x: string]: HelpPageType } = Object.fromEntries(
  HELP_PAGES.map((p) => [p.slug, p]),
);

function buildHelpPagesList(slug: string | null): HelpPageListType {
  const processPages = (pages: HelpPageType[], parentSlug: string): HelpPageListType => {
    return pages.map((p) => {
      const _slug = [parentSlug, p.slug].filter((p) => p).join("/");
      return {
        ...p,
        slug: _slug,
        children: p.children ? processPages(p.children, _slug) : [],
        active: _slug === slug,
        path: "/help/" + _slug,
      };
    });
  };
  return processPages(HELP_PAGES, "");
}

export function useHelpPagesList(): HelpPageListType {
  const match = useRouteMatch<{ slug: string }>({
    path: "/help/:slug*",
  });
  return buildHelpPagesList(match?.params?.slug || null);
}

export function useHelpPageMap(): HelpPageMapType {
  const pages = useHelpPagesList();
  const pageMap: HelpPageMapType = {};
  const pageMapBuildFunc = (_pages: HelpPageListType) => {
    for (const p of _pages) {
      pageMap[p.slug] = p;
      if (p.children.length) {
        pageMapBuildFunc(p.children);
      }
    }
  };

  pageMapBuildFunc(pages);
  return pageMap;
}
