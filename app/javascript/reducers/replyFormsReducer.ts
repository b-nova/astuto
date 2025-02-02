import {
  CommentsRequestActionTypes,
  COMMENTS_REQUEST_SUCCESS,
} from '../actions/requestComments';

import { commentRequestSuccess } from '../actions/requestComment';

import {
  HandleCommentRepliesType,
  TOGGLE_COMMENT_REPLY,
  SET_COMMENT_REPLY_BODY,
} from '../actions/handleCommentReplies';

import {
  CommentSubmitActionTypes,
  COMMENT_SUBMIT_START,
  COMMENT_SUBMIT_SUCCESS,
  COMMENT_SUBMIT_FAILURE,
} from '../actions/submitComment';

import replyFormReducer, { ReplyFormState } from './replyFormReducer';

import ICommentJSON from '../interfaces/json/IComment';

const initialState: Array<ReplyFormState> = [];

const ReplyFormsReducer = (
  state = initialState,
  action:
    CommentsRequestActionTypes |
    HandleCommentRepliesType |
    CommentSubmitActionTypes
): Array<ReplyFormState> => {
  switch (action.type) {
    case COMMENTS_REQUEST_SUCCESS:
      return ([
        ...action.comments.map(
          (comment: ICommentJSON) => replyFormReducer(undefined, commentRequestSuccess(comment))
        ),
        replyFormReducer(undefined, commentRequestSuccess({ id: null } as ICommentJSON)),
      ]);

    case TOGGLE_COMMENT_REPLY:
    case SET_COMMENT_REPLY_BODY:
      return (
        state.map(
          replyForm => (
            replyForm.commentId === action.commentId ?
              replyFormReducer(replyForm, action)
            :
              replyForm
          )
        )
      );

    case COMMENT_SUBMIT_START:
    case COMMENT_SUBMIT_FAILURE:
      return (
        state.map(
          replyForm => (
            replyForm.commentId === action.parentId ?
              replyFormReducer(replyForm, action)
            :
              replyForm
          )
        )
      );

    case COMMENT_SUBMIT_SUCCESS:
      return ([
        ...state.map(
          replyForm => (
            replyForm.commentId === action.comment.parent_id ?
              replyFormReducer(replyForm, action)
            :
              replyForm
          )
        ),
        replyFormReducer(undefined, commentRequestSuccess(action.comment)),
      ]);

    default:
      return state;
  }
}

export default ReplyFormsReducer;