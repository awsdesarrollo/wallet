export default {
	PLATFORM: {
		ANDROID: 'android',
		IOS: 'ios'
	},
	LEVELS: {
		ADMIN: 1,
		CLIENT: 2,
	},
	PASSWORD_RESET_STATUS: {
		ACTIVE: 1,
		INACTIVE: 0
	},
	USER: {
		VERIFIED: {
			PENDING: 0,
			APPROVED: 1,
			REJECTED: 2,
		},
		STATUS: {
			PENDING: 0,
			ACTIVE: 1,
			INACTIVE: 2,
		}
	},
	ORDER: {
		FUNDS_SOURCE: {
			BALANCE: 1,
			PERFORMANCE: 2,
		},
		PAYMENT_METHOD: {
			CASH: 1,
			WALLET: 2,
		},
		STATUS: {
			PENDING: 0,
			APPROVED: 1,
			REJECTED: 2,
		},
	},
	PER_PAGE: 20,
}