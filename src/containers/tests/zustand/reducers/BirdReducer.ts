import { GlobalStore, ReducerProps } from '../store/GlobalStore'
import { WritableDraft }             from 'immer/dist/types/types-external'

export const birdActions = { formInput: "FORM_INPUT_NAME", addView: "ADD_VIEW" }

export const birdReducer = (state: WritableDraft<GlobalStore>, { type, payload }: ReducerProps) => {
   switch (type) {
      
      case birdActions.formInput:
         state.birdInput = payload.value
         return
      case birdActions.addView:
         
         return
      
   }
}
