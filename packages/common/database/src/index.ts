import { GecutLogger } from '@gecut/logger'
import { $GroupSchema, $SessionSchema, $UserSchema } from '@promeet/schemas'
import mongoose from 'mongoose'

import type { GroupInterface, SessionInterface, UserInterface } from '@promeet/types'

export class Database {
  constructor(
    private uri: string,
    private logger: GecutLogger = new GecutLogger('db-connector'),
    private options?: mongoose.ConnectOptions,
  ) {
    this.options = {
      dbName: 'test',

      ...(this.options ?? {}),
    }
  }

  $user = mongoose.model<UserInterface>('user', $UserSchema)
  $group = mongoose.model<GroupInterface>('group', $GroupSchema)
  $session = mongoose.model<SessionInterface>('session', $SessionSchema)

  connector?: typeof mongoose

  async connect() {
    if (this.uri.startsWith('mongodb://') || this.uri.startsWith('mongodb+srv://')) {
      this.logger.method?.('connect')

      try {
        return (this.connector = await mongoose.connect(this.uri, this.options))
      }
      catch (error) {
        return this.logger.error('connect', 'connect_failed', error)
      }
    }

    this.logger.error('connect', 'uri_not_valid', { uri: this.uri, options: this.options })

    return null
  }

  async initialize() {
    if (this.connector == null) return -1

    const total = await this.totalDocuments()

    this.logger.methodFull?.('initialize', '', total)

    return total
  }

  private async totalDocuments() {
    const [user, group, session] = await Promise.all([
      this.$user.countDocuments(),
      this.$group.countDocuments(),
      this.$session.countDocuments(),
    ])

    return { user, group, session }
  }
}
