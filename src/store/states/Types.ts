import { ApiClient } from 'twitch'
import { ChatClient } from 'twitch-chat-client'

export type Credentials = { username: string, token: string, channel: string }

export interface AppState {
   needLogin: boolean | null
   twitchClient: ApiClient | null
   chatClient: ChatClient | null
   selectedUser: string | null
   showSettingsWindow: boolean
   bookmarks: any
}

type HighlightedMessage = { pattern: string, regex: boolean, caseSensitive: boolean, color: string, flash: boolean, hide: boolean }
type Command = { name: string, func: string }
type Nuke = { pattern: string, radiation: boolean, radiationLength: string, duration: string, reach: string }
type User = { name: string, color: string, flash: boolean, hide: boolean }
type NoneListed = null//[] | null

export interface Settings {
   appearance: {
      messages: {
         separateWithLines: boolean
         alternateBackground: boolean
         boldUsername: boolean
         showTimestamp: boolean
         redeemedHighlight: boolean
      }
      showPopupProfile: boolean
   },
   highlighting: {
      users: User[] | NoneListed
      messages: HighlightedMessage[] | NoneListed
   },
   commands: Command[] | NoneListed
   mentions: {
      salutationPopup: boolean
   },
   moderation: {
      bodyguard: boolean
      quickMode: boolean
      autopilot: {
         isOn: boolean,
         timeout: string,
         patterns: string[] | NoneListed
         isCaseSensitive: boolean
         isRegex: boolean
      },
      timeouts: string[] | NoneListed
      nukes: Nuke[] | NoneListed
      games: string[] | NoneListed
   }
}

interface Store {
   credentials: Credentials
   app: AppState
   settings: Settings
}
