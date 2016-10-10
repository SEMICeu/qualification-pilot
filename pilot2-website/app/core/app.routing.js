"use strict";
var router_1 = require('@angular/router');
var detail_view_component_1 = require("../detail-view/detail-view.component");
var appRoutes = [
    {
        path: 'detail',
        component: detail_view_component_1.DetailView
    },
    {
        path: 'index.html',
        redirectTo: '/detail/0',
        pathMatch: 'full'
    },
    {
        path: '',
        redirectTo: '/detail/0',
        pathMatch: 'full'
    },
    // {
    //   path: '',
    //   component: AppComponent
    // },
    {
        path: 'detail/:tab',
        component: detail_view_component_1.DetailView
    },
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map