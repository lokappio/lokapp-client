import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import Notify from "@/plugins/notify";

Vue.use(Vuetify);
Vue.use(Notify, { $vuetify: new Vuetify().framework });

export default new Vuetify({
    theme: {
        options: { customProperties: true },
        themes: {
            light: {
                primary: '#02188C',
                maincolor: '#02188C',
                background:'#FAF8F9',
                inputBackground: '#F2F3F7',
                grey: "#757575",
            },
        },
    }
});
