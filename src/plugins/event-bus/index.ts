import EventBus from "./event-bus"
import Vue from 'vue'

function eventBusInjection(Vuee: typeof Vue): void {
  Vuee.prototype.$eventBus = EventBus;
}

declare module 'vue/types/vue' {
  interface Vue {
    $eventBus: typeof EventBus;
  }
}

Vue.use(eventBusInjection);