// // src/reducers/AddPokemonReducer.js

// export const formInitialState = {
//   pokemonName: "",
//   selectedTypes: [],
//   image: null,
// };

// export function formReducer(state, action) {
//   switch (action.type) {
//     case "SET_NAME":
//       return { ...state, pokemonName: action.payload };
//     case "ADD_TYPE":
//       return state.selectedTypes.length < 3 && !state.selectedTypes.includes(action.payload)
//         ? { ...state, selectedTypes: [...state.selectedTypes, action.payload] }
//         : state;
//     case "REMOVE_TYPE":
//       return {
//         ...state,
//         selectedTypes: state.selectedTypes.filter((type) => type !== action.payload),
//       };
//     case "SET_IMAGE":
//       return { ...state, image: action.payload };
//     case "RESET_FORM":
//       return formInitialState;
//     default:
//       return state;
//   }
// }
