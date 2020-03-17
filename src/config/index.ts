import Command from '../cli'
import { OutputFlags } from '@oclif/parser'
import os from 'os'
import path from 'path'

class IotameConfig {
  homeDir: string = path.join(os.homedir(), '.iotame')

  initializeFromOclif (flags: Partial<OutputFlags<typeof Command.flags>>): void {
    if (flags.home) {
      this.homeDir = flags.home
    }
  }
}

export default new IotameConfig()
