
const initialState = { value: 'all' };

export const isTimeSelected = (state = initialState, action) => {
  switch (action.type) {
    case 'SELECT_ALL' :
      return 'all';
    case 'SELECT_MINUTE' :
      return 'minute';
    case 'SELECT_HOUR' :
      return 'hour';
    case 'SELECT_DAY' :
      return 'day';
    case 'SELECT_WEEK' :
      return 'week';
    default:
      return state;
  }
}