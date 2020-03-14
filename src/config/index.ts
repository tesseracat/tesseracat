import Command from '../cli'
import { OutputFlags } from '@oclif/parser'
import os from 'os'

class IotameConfig {
  homeDir: string = os.homedir()

  initializeFromOclif (flags: Partial<OutputFlags<typeof Command.flags>>): void {
    if (flags.home) {
      this.homeDir = flags.home
    }
  }
}

export default new IotameConfig()
