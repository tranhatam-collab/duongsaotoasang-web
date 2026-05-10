import { onRequestGet as __api_content_js_onRequestGet } from "/Users/tranhatam/duongsaotoasang-web/.claude/worktrees/affectionate-mcnulty/functions/api/content.js"
import { onRequestGet as __api_contents_js_onRequestGet } from "/Users/tranhatam/duongsaotoasang-web/.claude/worktrees/affectionate-mcnulty/functions/api/contents.js"
import { onRequest as __api_search_js_onRequest } from "/Users/tranhatam/duongsaotoasang-web/.claude/worktrees/affectionate-mcnulty/functions/api/search.js"
import { onRequestGet as __rss_xml_js_onRequestGet } from "/Users/tranhatam/duongsaotoasang-web/.claude/worktrees/affectionate-mcnulty/functions/rss.xml.js"
import { onRequestGet as __sitemap_xml_js_onRequestGet } from "/Users/tranhatam/duongsaotoasang-web/.claude/worktrees/affectionate-mcnulty/functions/sitemap.xml.js"

export const routes = [
    {
      routePath: "/api/content",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_content_js_onRequestGet],
    },
  {
      routePath: "/api/contents",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_contents_js_onRequestGet],
    },
  {
      routePath: "/api/search",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_search_js_onRequest],
    },
  {
      routePath: "/rss.xml",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__rss_xml_js_onRequestGet],
    },
  {
      routePath: "/sitemap.xml",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__sitemap_xml_js_onRequestGet],
    },
  ]