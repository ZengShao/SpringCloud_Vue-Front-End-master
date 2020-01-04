import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import actions from '@/store/actions'
import getters from '@/store/getters'
import state from '@/store/state'
import mutations from '@/store/mutations'
import createPersistedState from "vuex-persistedstate"



const store = new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	plugins: [createPersistedState({
         src: '~plugins/vue-core-image-upload.js', ssr: false,
      storage: window.sessionStorage,
      reducer(val) {
          return {
          // 只储存state中的user
					UserName :val.UserName,

        }
     }
  })]
})

export default store;
