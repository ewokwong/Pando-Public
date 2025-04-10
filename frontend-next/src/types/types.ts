export interface Message {
  senderId: string
  content: string
  senderName: string
  timestamp?: Date
  _id?: string
}

export interface OtherUser {
  id?: string
  _id?: string
  userId?: string
  name: string
  profilePhoto?: string
  bio?: string
  location?: string
  UTR?: string
  dob?: string
  media?: string[]
  userPreferences?: {
    fun_social?: boolean
    training_for_competitions?: boolean
    fitness?: boolean
    learning_tennis?: boolean
  }
}

export interface NewMessage {
  senderId: string
  content: string
  timestamp?: Date
  _id?: string
}

export type Socket = ReturnType<typeof import("socket.io-client").io>
