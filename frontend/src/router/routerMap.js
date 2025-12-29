/**
 * 基础路由
 * @type { *[] }
 */
export const Layout = () => import("@/layout/default.vue");

const constantRouterMap = [
  {
    path: "/",
    name: "Example",
    redirect: { name: "LoginIndex" },
    // DouyinWorkIndex LoginIndex
  },
  {
    path: "/login",
    children: [
      {
        path: "index",
        name: "LoginIndex",
        component: () => import("@/views/example/login/Index.vue"),
      },
    ],
  },
  {
    path: "/douyin",
    component: Layout,
    children: [
      {
        path: "index",
        name: "DouyinIndex",
        component: () => import("@/views/douyin.vue"),
      }
    ]
  },
  {
    path: "/douyinWork",
    children: [
      {
        path: "index",
        name: "DouyinWorkIndex",
        component: () => import("@/views/work.vue"),
      },
    ]
  },
  {
    path: "/kuaishou",
    component: Layout,
    children: [
      {
        path: "index",
        name: "KuaishouIndex",
        component: () => import("@/views/kuaishou.vue"),
      },
    ],
  },
  {
    path: "/shipinhao",
    component: Layout,
    children: [
      {
        path: "index",
        name: "ShipinhaoIndex",
        component: () => import("@/views/shipinhao.vue"),
      },
    ],
  },
   {
    path: "/pinduoduo",
    component: Layout,
    children: [
      {
        path: "index",
        name: "PinduoduoIndex",
        component: () => import("@/views/pinduoduo.vue"),
      },
    ],
  },
   {
    path: "/taobao",
    component: Layout,
    children: [
      {
        path: "index",
        name: "TaobaoIndex",
        component: () => import("@/views/taobao.vue"),
      },
    ],
  },
];

export default constantRouterMap;
