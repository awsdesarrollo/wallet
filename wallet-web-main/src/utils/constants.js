export const Constants = {
	PER_PAGE: 20,
	USER: {
		LEVELS: {
			ADMIN: 1,
			CLIENT: 2,
		},
		STATUS: {
			PENDING: 0,
			ACTIVE: 1,
			INACTIVE: 2,
		},
		VERIFIED: {
			PENDING: 0,
			APPROVED: 1,
			REJECTED: 2,
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
}