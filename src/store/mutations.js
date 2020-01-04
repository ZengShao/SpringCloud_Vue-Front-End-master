export default {
	setResturantName: (state, payload) => {
		state.resturantName = payload.resturantName;
	},
	setUserName: (state, payload) => {
		state.UserName = payload.UserName;
	},
	setJwt: (state, payload) => {
		state.jwt = payload.jwt;
	},
	clear: (state) => {
		for(let attr in state){
			state[attr] = null;
		}
	},
	setadminId: (state, payload) => {
		state.adminId = payload.adminId;
	},
}
