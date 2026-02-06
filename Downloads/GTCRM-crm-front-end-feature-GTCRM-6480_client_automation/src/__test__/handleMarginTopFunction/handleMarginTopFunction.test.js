
import { handleMarginTopLogicFunction } from '../../helperFunctions/calendarHelperfunction';

describe('handleMarginTopLogicFunction', () => {
  it('should return correct margin top for a given start and end time', () => {
    const result = handleMarginTopLogicFunction(0, 8.0);
    expect(result).toBe(1);
  });

  it('should return correct margin top for a time within a range', () => {
    const result = handleMarginTopLogicFunction(0, 8.05);
    expect(result).toBe(6);
  });

  it('should return 0 for time not in any range', () => {
    const result = handleMarginTopLogicFunction(0, 7.0);
    expect(result).toBe(0);
  });

  it('should handle multiple conditions and return correct margin top', () => {
    const result1 = handleMarginTopLogicFunction(0, 10.30); 
    const result2 = handleMarginTopLogicFunction(0, 11.45); 
    expect(result1).toBe(60 * 2 + 33);
    expect(result2).toBe(60 * 3 + 35);
  });
});
