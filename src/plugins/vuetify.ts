import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import Notify from "@/plugins/notify";

Vue.use(Vuetify);
Vue.use(Notify, { $vuetify: new Vuetify().framework });

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#02188C',
                maincolor: '#02188C',
            },
        }
    }
});
