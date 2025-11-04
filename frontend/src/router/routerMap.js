/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  {
    path: "/",
    name: "Example",
    redirect: { name: "LoginIndex" },
    children: [
      {
        path: "/example",
        name: "ExampleHelloIndex",
        component: () => import("@/views/example/login/Index.vue"),
      },
    ],
  },
   {
    path: "/dashboard",
    children: [
      {
        path: "index",
        name: "DashboardIndex",
        component: () => import("@/views/example/hello/Index.vue"),
      }
    ],
  },
  {
    path: "/login",
    children: [
      {
        path: "index",
        name: "LoginIndex",
        component: () => import("@/views/example/login/Index.vue"),
      }
    ],
  },
];

export default constantRouterMap;
