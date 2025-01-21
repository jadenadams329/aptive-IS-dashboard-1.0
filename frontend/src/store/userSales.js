import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const SET_USER_SALES = "userSales/SET_USER_SALES";
export const ADD_USER_SALE = "userSales/ADD_USER_SALE";
export const REMOVE_USER_SALE = "userSales/REMOVE_USER_SALE";
export const UPDATE_USER_SALE = "userSales/UPDATE_USER_SALE";

/** Action Creators: */
export const setUserSales = (userSales) => ({
	type: SET_USER_SALES,
	payload: userSales,
});

export const addUserSale = (userSale) => ({
	type: ADD_USER_SALE,
	payload: userSale,
});

export const removeUserSale = (userSaleId) => ({
	type: REMOVE_USER_SALE,
	payload: userSaleId,
});

export const updateUserSale = (userSale) => ({
	type: UPDATE_USER_SALE,
	payload: userSale,
});

/** Thunk Action Creators: */
export const getAllUserSalesThunk = () => async (dispatch) => {
	const res = await csrfFetch("/api/sales/user-sales");
	if (res.ok) {
		const userSales = await res.json();
		dispatch(setUserSales(userSales));
		return res;
	}
};

export const deleteUserSaleThunk = (userSaleId) => async (dispatch) => {
	const res = await csrfFetch(`/api/sales/${userSaleId}`, {
		method: "DELETE",
	});
	if (res.ok) {
		dispatch(removeUserSale(userSaleId));
		return Promise.resolve();
	} else {
		const errorData = await res.json();
		throw errorData;
	}
};

export const updateUserSaleThunk = (userSale, saleId) => async (dispatch) => {

	const res = await csrfFetch(`/api/sales/${saleId}`, {
		method: "PUT",
		body: JSON.stringify(userSale),
	});
	if (res.ok) {
		const updatedUserSale = await res.json();
		dispatch(updateUserSale(updatedUserSale));
		return res;
	} else {
		const errorData = await res.json();
		throw errorData;
	}
};

export const createUserSaleThunk = (userSale) => async (dispatch) => {
	const res = await csrfFetch("/api/sales", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userSale),
	});
	if (res.ok) {
		const newUserSale = await res.json();
		dispatch(addUserSale(newUserSale));
		return res;
	} else {
		const errorData = await res.json();
		throw errorData;
	}
};

/** Reducer: */
const initialState = { isLoading: true, data: {} };

const userSalesReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_USER_SALES: {
			const updatedState = {};
			action.payload.forEach((userSale) => {
				updatedState[userSale.id] = userSale;
			});
			return { ...state, data: updatedState, isLoading: false };
		}

		case ADD_USER_SALE: {
			return {
				...state,
				data: {
					...state.data,
					[action.payload.id]: action.payload,
				},
				isLoading: false,
			};
		}

		case REMOVE_USER_SALE: {
			const newState = { ...state.data };
			delete newState[action.payload];
			return { ...state, data: newState, isLoading: false };
		}

		case UPDATE_USER_SALE: {
			return {
				...state,
				data: {
					...state.data,
					[action.payload.id]: action.payload,
				},
				isLoading: false,
			};
		}
		default:
			return state;
	}
};

export default userSalesReducer;
