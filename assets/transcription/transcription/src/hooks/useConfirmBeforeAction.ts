import { useState, useCallback } from "react";

/**
 * This hook allows the caller to insert some functionality before an
 * action is performed. It's main use case is to allow a confirmation
 * modal to warn users about some action before they perform that action.
 * 
 * For example - deleting sensitive data.
 * 
 * The condition is called everytime the user attempts the action, and,
 * if the condition is met, the action is delayed, until confirmAction()
 * is called (or cancelAction())
 * 
 * @param action the action to perform
 * @param condition the condition to check before completing the action
 */
const useConfirmBeforeAction = <T extends any[]>(
  action: (...args: T) => void,
  condition: (...args: T) => boolean
): {
  /**
   * A list of the parameters that the action has been called with.
   * This is also a way for the caller to check if the action has been
   * attempted - any time the action has been attempted, this won't be
   * undefined (unless the action was attempted with undefined)
   */
  attemptingActionWith: undefined | T;
  /**
   * Cancel the action - effectively making the original call to
   * attemptAction() a no-op
   */
  cancelAction: () => void;
  /**
   * Attempt the action
   */
  attemptAction: (...args: T) => void;
  /**
   * Confirm the action - this is a no-op if attemptingActionWith
   * is undefined
   */
  confirmAction: () => void;
} => {
  const [attemptingActionWith, setAttemptingActionWith] = useState<
    undefined | T
  >(undefined);

  const confirmAction = useCallback(() => {
    if (attemptingActionWith) {
      action(...attemptingActionWith);
      setAttemptingActionWith(undefined);
    }
  }, [attemptingActionWith, action]);

  return {
    attemptingActionWith,
    cancelAction: () => setAttemptingActionWith(undefined),
    attemptAction: (...args: T) =>
      condition(...args) ? setAttemptingActionWith(args) : action(...args),
    confirmAction,
  };
};

export default useConfirmBeforeAction;