import {createRouter, createWebHashHistory} from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'questionnaireEdit',
            component: () => import('@/views/questionnaire/index.vue'),
            meta: {
                title: 'questionnaireEdit',
            },
        },
    ]
})

// @ts-ignore
export default router
