import { Command, flags } from '@oclif/command'
import Config from '@config'

/**
 * oclif does not currently work with mock-fs, so we want to keep
 * this file as slim as possible for unit testing. Therefore we
 * will delegate most of the logic to other sources that can be
 * tested under mock-fs.
 * @see https://github.com/oclif/oclif/issues/182
 */
class OclifExampleSingleTs extends Command {
  static description = 'Performs'

  static flags = {
    // --version or -v
    version: flags.version({ char: 'v' }),

    // --help or -h
    help: flags.help({ char: 'h' }),

    // --home "..."
    home: flags.string({ description: '' }),
  }

  async run (): Promise<void> {
    const { flags } = this.parse(OclifExampleSingleTs)

    Config.initializeFromOclif(flags)
  }
}

export default OclifExampleSingleTs
