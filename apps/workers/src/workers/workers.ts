import { WorkerId } from '@zyrohub/toolkit';

import { BaseWorker } from './Base';

import { BcryptGeneratorWorker } from './BcryptGenerator';
import { BcryptCheckerWorker } from './BcryptChecker';

export const workers: Record<WorkerId, typeof BaseWorker> = {
	bcrypt_generator: BcryptGeneratorWorker,
	bcrypt_checker: BcryptCheckerWorker
};
