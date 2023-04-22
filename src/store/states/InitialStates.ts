export const InitialAppStates = {
   needLogin: null,
   credentials: null,
   twitchClient: null,
   chatClient: null,
   selectedUser: null,
   showSettingsWindow: false,
   bookmarks: null
}

export const InitialSettings = {
   appearance: {
      messages: {
         separateWithLines: false,
         alternateBackground: false,
         boldUsername: false,
         showTimestamp: false,
         redeemedHighlight: false,
      },
      showPopupProfile: false,
   },
   highlighting: {
      users: [
         {
            name: "[myusername]",
            color: "#7f3f49",
            flash: false,
            hide: false
         },
         {
            name: "[streamer]",
            color: "#7f3f49",
            flash: true,
            hide: false
         },
      ],
      messages: [
         {
            pattern: "@[streamer]",
            color: "#0e493c",
            flash: false,
            caseSensitive: false,
            regex: false,
            hide: false,
         },
      ],
   },
   commands: [
      {
         name: "union",
         func: "{1} ￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼￼ {2}",
      },
   ],
   mentions: {
      salutationPopup: false,
   },
   moderation: {
      bodyguard: false,
      quickMode: false,
      autopilot: {
         isOn: false,
         timeout: '1m',
         patterns: ['No, you’re NOT'],
         isCaseSensitive: false,
         isRegex: false
      },
      timeouts: ['1s', '30s', '1m', '5m', '10m', '30m', '1h', '3h', '8h', '1d', '3d', '1w', '2w'],
      nukes: [
         {
            pattern: "D:",
            radiation: true,
            radiationLength: "5m",
            duration: "1m",
            reach: "1m",
         },
         {
            pattern: "🏓",
            radiation: true,
            radiationLength: "5m",
            duration: "1m",
            reach: "1m",
         },
         {
            pattern: "✊",
            radiation: true,
            radiationLength: "5m",
            duration: "1m",
            reach: "1m",
         },
      ],
      games: ['Just Chatting', "Grand Theft Auto V", "Rust", "The Legend Of Zelda: Breath of the Wild"],
   },
}
